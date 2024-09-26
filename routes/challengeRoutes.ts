import { Router } from 'express';
import { findChallenge } from '../controllers/challengeController';

const router = Router();

// Route to find a user to challenge
router.post('/find', findChallenge);

export default router;
