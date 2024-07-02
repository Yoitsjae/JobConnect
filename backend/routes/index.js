import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

/**
 * users specific endpoints - register, login, logout, update profifile
 * read profile
 */
router.post('/login', AuthController.getConnect);
router.get('/logout', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.put('/users/me', UsersController.putMe);
router.post('/register', UsersController.postNew);

/**
 * status and stats specific endpoints
 */
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

/**
 * jobs specific endpoints - create, update, read, delete
 * jobs
 */
router.post('/post-jobs', JobsController.postNew);
router.get('/jobs/:id', JobsController.showJob);
router.put('/jobs/:id', JobsController.showJob);
router.get('/jobs', JobsController.getJob);
router.get('/delete/:id', JobsController.deleteJob);

module.exports = router;
