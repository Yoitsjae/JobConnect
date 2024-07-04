import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import JWTSecure from '../utils/jwt';

/**
 * job application endpoints
 */
export default class proposalsController {
  /**
   *apply to a listed job in database. A proposal has these attributes
   * jobId, coverLetter, amount, createdAt,
   * updatedAt, freelancerId, status
   *
   */
  static async postNew(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.usersCollection.findOne({ _id: ObjectID(validToken.id) });
    if (!user) return res.status(404).json({ error: 'Not found' });

    const {
      coverLetter, freelancerId,
    } = req.body;
    const { jobId } = req.params;

    const proposalExist = await dbClient.proposalsCollection.findOne({
      jobId, freelancerId,
    });
    const amount = req.body.amount ? req.body.amount : 1500;
    if (proposalExist) return res.status(400).json({ error: 'Already exist' });

    if (!jobId) return res.status(400).json({ error: 'Missing jobId' });
    if (!coverLetter) return res.status(400).json({ error: 'Missing cover letter' });
    if (!freelancerId) return res.status(400).json({ error: 'Missing freelancerId' });

    const newProposal = await dbClient.proposalsCollection.insertOne({
      jobId,
      freelancerId,
      amount,
      coverLetter,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
    });

    return res.status(201).json({
      id: newProposal._id, createdAt: newProposal.createdAt,
    });
  }

  /**
   * retrieves all proposals on a job, base on jobs id
   */
  static async showProposal(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const jobExist = await dbClient.jobsCollection.findOne({
      _id: ObjectID(req.params.id),
    });
    if (!jobExist) return res.status(404).json({ error: 'Not found' });

    const { proposalId } = req.query;
    let proposalExist;
    if (proposalId) {
      proposalExist = await dbClient.proposalsCollection.findOne({
        _id: ObjectID(proposalId), jobId: ObjectID(req.params.id),
      });
      if (!proposalExist) return res.status(404).json({ error: 'Not found' });

      return res.status(200).json({ id: proposalExist._id });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const skip = page * 10;
    const pipeline = [];

    pipeline.push({
      $match: {
        jobId: ObjectID(req.params.id),
      },
    });
    pipeline.push({
      $sort: { amount: 1 },
    });
    pipeline.push({
      $skip: skip,
    });
    pipeline.push({
      $limit: 10,
    });
    pipeline.push({
      $set: [
        'amount', 'freelancerId',
      ],
    });

    const queryResult = await dbClient.proposalsCollection.aggregate(pipeline);
    return res.status(200).json(queryResult);
  }

  /**
   * updates jobs, and proposal status, job's freelancer,
   * updating amount
   */
  static async putProposal(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const jobExist = await dbClient.jobsCollection.findOne({
      clientId: ObjectID(validToken.id), _id: ObjectID(req.params.jobId),
    });
    if (!jobExist) return res.status(404).json({ error: 'Not found' });

    const proposalExist = await dbClient.proposalsCollection.findOne({
      _id: ObjectID(req.params.id),
    });
    if (!proposalExist) return res.status(404).json({ error: 'Not found' });

    await dbClient.jobsCollection.updateOne(
      { clientId: ObjectID(validToken.id), _id: ObjectID(req.params.jobId) },
      {
        $set: {
          status: 'in-progress',
          freelancerId: proposalExist.freelancerId,
          updatedAt: new Date(),
          amount: proposalExist.amount,
        },
      },
    );
    await dbClient.proposalsCollection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          status: 'accepted', updatedAt: new Date(),
        },
      },
    );
    await dbClient.proposalsCollection.deleteMany({
      _id: { $ne: proposalExist._id },
    });
    return res.status(200).json({ message: `Job will be completed on ${jobExist.deadline}` });
  }
}
