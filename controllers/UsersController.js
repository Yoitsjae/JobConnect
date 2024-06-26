import dbClient from '../utils/db';
import sha1 from 'sha1';

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
    const { email, name, password, role, username } = req.body;

    if (!email) return res.status(400).json({error: "Missing email"});
    if (!name) return res.status(400).json({error: "Missing name"});
    if (!password) return res.status(400).json({error: "Missing password"});
    if (!role) return res.status(400).json({error: "Missing role"});
    if (!username) return res.status(400).json({error: "Missing username"});

    const emailExist = await dbClient.usersCollection.findOne({email});
    const usernameExist = await dbClient.usersCollection.findOne({username});

    if (emailExist) return res.status(400).json({error: "Already exist"});
    if (usernameExist) return res.status(400).json({error: "Already exist"});

    const newUser = await dbClient.usersCollection.insertOne({
      email, name, role, username, password: sha1(password)
    });

    return res.status(201).json({email, id: newUser.insertedId});
  }
}
