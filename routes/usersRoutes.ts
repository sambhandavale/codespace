import express, { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { getAllUsers, getUser } from '../controllers/usersController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/getAllUsers', getAllUsers);
router.get('/getUser/:id', getUser);

export default router;
