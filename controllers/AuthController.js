import { sign, verify } from 'jsonwebtoken';
import sha1 from 'sha1';
import dbClient from '../utils/db';

/*
 * create endpoints that require authentication
 */
export default class AuthController {
  /*
   * sign-in a user by generating a new authentication token
   * using password and email signin a user
   * if email not found return status code 401 and error, unauthorized
   * on success, generate jwt with id, email return it in a cookie
   */
  static async getConnect(req, res) {
    const { email, password } = req.body;
    const user = await dbClient.usersCollection.findOne({
      email, password: sha1(password),
    });

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const accessToken = sign({
      username: user.username, id: user._id,
    }, secretKey);

    res.cookie('X-Token', accessToken, {
      maxAge: (60 * 60 * 24 * 1000),
      httpOnly: true,
    });

    return res.status(200).json({ message: 'User logged in' });
  }

  /*
   * sign-out a user
   */
  static async getDisconnect(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(400).json({ error: 'Unauthorized' });

    try {
      const secretKey = process.env.SECRETKEY || 'JobConnectKey';
      verify(accessToken, secretKey);
      res.clearCookie('X-Token');
    } catch (err) {
      return res.status(400).json({ error: err.name });
    }
    return res.status(204).json();
  }
}
