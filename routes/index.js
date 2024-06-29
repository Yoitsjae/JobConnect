import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

/**
 * users specific endpoints - register, login, logout, update profifile
 * read profile
 */
router.get('/users/login', AuthController.getConnect);
router.get('/users/logout', AuthController.getDisconnect);
router.get('/users/profile', UsersController.getMe);
router.patch('/users/profile', UsersController.patchMe);
router.post('/users/register', UsersController.postNew);

/**
 * status and stats specific endpoints
 */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

/**
 * jobs specific endpoints -  - create, update, read, delete
 * jobs
 */

module.exports = router;
