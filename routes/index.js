import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

// to get databaes info
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// user registration
router.post('/users', UsersController.postNew);

// user login
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

// profile
router.get('/users/me', UsersController.getMe);

module.exports = router;
