import express from 'express';
import controller from '../controllers/MeController';
import auth from '../middlewares/authentication';

const router = express.Router();

router.get('/me', [auth.verifyToken], controller.GetUser);

export = router;