import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import JWTSecure from '../utils/jwt';
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
      email, password, role, username,
    } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!username) return res.status(400).json({ error: 'Missing username' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
    if (!role) return res.status(400).json({ error: 'Missing role' });

    const usernameExist = await dbClient.usersCollection.findOne({ username });
    if (usernameExist) return res.status(400).json({ error: 'Already exist' });

    const emailExist = await dbClient.usersCollection.findOne({ email });
    if (emailExist) return res.status(400).json({ error: 'Already exist' });

    const profile = {
      name: null,
      bio: null,
      skills: [],
      rating: 0,
    };

    const { createdAt, updatedAt } = { createdAt: new Date(), updatedAt: new Date() };

    console.log(`email: ${email}, password: ${password}, role: ${role}, profile: ${profile}, createdAt: ${createdAt}, updatedAt: ${updatedAt}`);

    const newUser = await dbClient.usersCollection.insertOne({
      email, role, password: sha1(password), profile, createdAt, updatedAt, username,
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

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(404).json({ error: 'Not found' });

    const user = await dbClient.usersCollection.findOne({
      _id: ObjectID(validToken.id),
    });

    return res.status(200).json({ username: user.username, id: user._id });
  }

  /**
   * patch users profile based on token
   * on success, returns a json message
   */
  static async putMe(req, res) {
    const accessToken = req.cookies['X-Token'];
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    const secretKey = process.env.SECRETKEY || 'JobConnectKey';
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(404).json({ error: 'Not found' });

    const user = await dbClient.usersCollection.findOne({
      _id: ObjectID(validToken.id),
    });

    Object.keys(user.profile).forEach((key) => {
      if (req.body.profile[key]) {
        user.profile[key] = req.body.profile[key];
      }
    });

    await dbClient.usersCollection.updateOne(
      { email: user.email },
      { $set: { profile: user.profile, updatedAt: new Date() } },
    );

    return res.status(200).json({ message: 'Profile updated' });
  }
}
