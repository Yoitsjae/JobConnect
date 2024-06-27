import sha1 from 'sha1';
import { verify } from 'jsonwebtoken';
import dbClient from '../utils/db';

/*
 * creates new users endpoints
 */
export default class UsersController {
  /*
   * creates a new user in database, using email, password, username,
   * role, name
   *
   * if an attribute is missing, returns a status code 400, "Missing <attr>"
   * if email, username already exists in DB, returns a status code 400, "Already exist"
   * On success, returns status code 201, {email, id}
   */
  static async postNew(req, res) {
    const {
      email, name, password, role, username,
    } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
    if (!role) return res.status(400).json({ error: 'Missing role' });
    if (!username) return res.status(400).json({ error: 'Missing username' });

    const emailExist = await dbClient.usersCollection.findOne({ email });
    const usernameExist = await dbClient.usersCollection.findOne({ username });

    if (emailExist) return res.status(400).json({ error: 'Already exist' });
    if (usernameExist) return res.status(400).json({ error: 'Already exist' });

    const newUser = await dbClient.usersCollection.insertOne({
      email, name, role, username, password: sha1(password),
    });

    return res.status(201).json({ email, id: newUser.insertedId });
  }

  /*
   * retrieve user based on the token
   *
   * return an unauthorized error with status code 401
   * on success, return the user object email, and id
   */
  static async getMe(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    let validToken;
    try {
      const secretKey = process.env.SECRETKEY || 'JobConnectKey';
      validToken = verify(accessToken, secretKey);
    } catch (err) {
      return res.status(400).json({ error: err.name });
    }
    return res.status(200).json({ username: validToken.username, id: validToken.id });
  }
}
