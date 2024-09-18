import express, { Router } from 'express';
import { register,login } from '../controllers/authController';
import { validateRegister, validateLogin } from '../validators/authValidator';

const router: Router = express.Router();

// Routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
