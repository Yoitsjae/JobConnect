import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import JWTSecure from '../utils/jwt';

/**
 * job listing endpoints
 */
export default class JobsController {
  /**
   * list a new job in database. A job has these attributes
   * title, description, budget, deadline, createdAt, updatedAt,
   * clientId, freelancerId - inital null, skills
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
      title, description, budget, deadline, skills,
    } = req.body;

    const jobExist = await dbClient.jobsCollection.find({
      title, description, budget, deadline, clientId: validToken.id,
    });
    if (jobExist) return res.status(400).json({ error: 'Already exist' });

    if (!title) return res.status(400).json({ error: 'Missing title' });
    if (!description) return res.status(400).json({ error: 'Missing description' });
    if (!budget) return res.status(400).json({ error: 'Missing budget' });
    if (!deadline) return res.status(400).json({ error: 'Missing deadline' });

    const newJob = await dbClient.jobsCollection.insertOne({
      description,
      budget,
      deadline,
      clientId: validToken.id,
      freelancerId: null,
      title,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      skills,
    });

    return res.status(201).json({
      jobId: newJob._id, createdAt: newJob.createdAt, clientId: newJob.dbClient,
    });
  }

  /**
   * retrieve or update job based on the the job id and request method. update either
   * job status - open, in-progress, completed, closed
   * or freelancerId, and updatedAt
   */
  static async showJob(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const jobExist = await dbClient.jobsCollection.findOne({
      clientId: ObjectID(validToken.id), _id: ObjectID(req.params.id),
    });
    if (!jobExist) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(jobExist);
  }

  /**
   * retrieve jobs base on a query, query may have
   * page, skillname, and level
   */
  static async getJob(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const page = parseInt(req.query.page, 10) || 1;
    const skip = page * 10;
    const pipeline = [];
    const { skillName } = req.query;
    const { skillLevel } = req.query;

    if (!skillLevel && !skillName) {
      pipeline.push({
        $match: {},
      });
    } else if (skillLevel && !skillName) {
      pipeline.push({
        $match: {
          'skills.level': skillLevel,
        },
      });
    } else if (skillName && !skillLevel) {
      pipeline.push({
        $match: {
          'skills.name': skillName,
        },
      });
    } else {
      pipeline.push({
        $match: {
          skills: {
            $elemMatch: {
              name: skillName,
              level: skillLevel,
            },
          },
          status: 'open',
        },
      });
    }
    pipeline.push({
      $sort: { budget: -1 },
    });
    pipeline.push({
      $skip: skip,
    });
    pipeline.push({
      $limit: 10,
    });
    pipeline.push({
      $set: [
        'deadline', 'budget', 'title', 'description', 'createdAt',
      ],
    });

    const queryResult = await dbClient.jobsCollection.aggregate(pipeline).toArray();
    return res.status(200).json(queryResult);
  }

  /**
   * remove a listed job based on Id and status
   */
  static async deleteJob(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const jobExist = await dbClient.jobsCollection.findOne({
      clientId: ObjectID(validToken.id), _id: ObjectID(req.params.id),
    });
    if (!jobExist) return res.status(404).json({ error: 'Not found' });

    if (jobExist.status === 'pending') return res.status(403).json({ error: 'Forbidden' });
    if (jobExist.clientId === validToken.id) return res.status(401).json({ error: 'Unauthorized' });

    await dbClient.jobsCollection.deleteOne({ _id: ObjectID(req.params.id) });
    return res.status(200).json();
  }
}
