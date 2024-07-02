import { MongoClient } from 'mongodb';

/*
 * MongoDB client representation
 */

class DBClient {
  // Create a new instance.
  constructor() {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'jobConnect';

    this.clientIsConnected = true;
    this.client = new MongoClient(
      `mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true },
    );
    this.client.connect()
      .then(() => {
        this.clientIsConnected = true;
      })
      .catch(() => {
        this.clientIsConnected = false;
      });
    // this.client.db().dropDatabase();
    this.usersCollection = this.client.db().collection('users');
    this.jobsCollection = this.client.db().collection('jobs');
    this.proposalsCollection = this.client.db().collection('proposals');
  }

  /*
   * Monitors if database is active
   * @return - boolean
   */
  isAlive() {
    return this.clientIsConnected;
  }

  /*
   * retrieves number of users in database
   * @return - Promise<Number>
   */
  async nbUsers() {
    return this.usersCollection.countDocuments();
  }

  /*
   * retrieves number of jobs in database
   * @return - Promise<Number>
   */
  async nbJobs() {
    return this.usersCollection.countDocuments();
  }

  /*
   * retrieves number of proposals for a job in database
   * @return - Promise<Number>
   */
  async nbProposals() {
    return this.proposalsCollection.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
