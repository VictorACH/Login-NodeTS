import express from 'express';
import controller from '../controllers/UserController';
import auth from '../middlewares/authentication';
import { verifyRole } from '../middlewares/verifyRole';

const router = express.Router();

router.get('/users', [auth.verifyToken], controller.GetUsers);
router.post('/users', [auth.verifyToken, verifyRole], controller.CreateUser);
router.put('/users/:id', [auth.verifyToken, verifyRole], controller.UpdateUsers);
router.delete('/users/:id', [auth.verifyToken, verifyRole], controller.DeleteUser);

export = router;