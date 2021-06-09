import express from 'express';
import controller from '../controllers/LoginController';

const router = express.Router();

router.post('/login', controller.LoginUser);

export = router;