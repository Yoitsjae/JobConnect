import { ObjectID } from 'mongodb';
import { orders } from '@paypal/checkout-server-sdk';
import dbClient from '../utils/db';
import JWTSecure from '../utils/jwt';
import paypalClient from '../utils/paypal';

/**
 * payment endpoints
 */
export default class PaymentsController {
  /**
   * create an invoice for a completed job
   * updated job status to 'completed'
   */
  static async postInvoice(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const userExist = await dbClient.usersCollection.findOne({ _id: ObjectID(validToken.id) });
    if (!userExist) return res.status(404).json({ error: 'Not found' });

    const jobExist = await dbClient.jobsCollection.findOne({
      _id: req.params.jobId,
    });
    if (!jobExist) return res.status(404).json({ error: 'Not found' });

    const request = new orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      amount: {
        currency_code: 'USD',
        value: jobExist.amount,
      },
    });

    const invoice = await paypalClient.execute(request);
    if (!invoice) res.status(500).send({ error: 'Failed request' });
    await dbClient.paymentsCollection.insertOne({
      jobId: jobExist._id,
      amount: jobExist.amount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      invoiceId: invoice.result.id,
    });
    return res.status(201).json({ id: invoice.result.id });
  }

  /**
   * captures an invoice for a completed job
   * on success, update job status to 'done'
   */
  static async captureInvoice(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized' });

    const userExist = await dbClient.usersCollection.findOne({ _id: ObjectID(validToken.id) });
    if (!userExist) return res.status(404).json({ error: 'Not found' });

    const invoiceExist = await dbClient.paymentsCollection.findOne({
      jobId: req.params.jobId,
    });
    if (!invoiceExist) return res.status(404).json({ error: 'Not found' });

    const request = new orders.OrdersCaptureRequest(invoiceExist.invoiceId);
    request.requestBody({});
    const capture = await paypalClient.execute(request);
    if (!capture) return res.status(500).json({ error: 'Failed transaction' });

    await dbClient.paymentsCollection.updateOne(
      { jobId: req.params.jobId },
      {
        $set: {
          status: 'completed',
        },
      },
    );
    return res.status(200).json(capture.result);
  }
}
