import { core } from '@paypal/checkout-server-sdk';
import { config } from 'dotenv';

/**
 * represents the paypal payment services
 */
class PayPalClient {
  /**
   * creates a new instance
   */
  constructor() {
    config();
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.Client_Secret;
    const environment = new core.SandboxEnvironment(clientId, clientSecret);
    this.client = new core.PayPalHttpClient(environment);
  }

  /**
   * executes orders request
   */
  async execute(request) {
    const result = await this.client.execute(request);
    return result;
  }

  /**
   * returns connection status
   */
  isAlive() {
    if (this.client.getUserAgent()) return true;
    return false;
  }
}

const paypalClient = new PayPalClient();
export default paypalClient;
