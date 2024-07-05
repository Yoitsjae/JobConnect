import dbClient from '../utils/db';
import paypalClient from '../utils/paypal';

/*
 * creates apps endpoints
 */
export default class AppController {
  /*
   * get apps status
   * return - {boolean}
   */
  static getStatus(req, res) {
    res.status(200).json({
      db: dbClient.isAlive(), paypal: paypalClient.isAlive(),
    });
  }

  /*
   * get collections statistics
   * return - {boolean}
   */
  static async getStats(req, res) {
    const nbUsers = await dbClient.nbUsers();
    res.status(200).json({ users: nbUsers });
  }
}
