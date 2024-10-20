import { Router } from 'express';
import { findChallenge, getAllRooms } from '../controllers/challengeController';

const router = Router();

// Route to find a user to challenge
router.post('/find', findChallenge);
router.get('/allRooms', getAllRooms);

export default router;
