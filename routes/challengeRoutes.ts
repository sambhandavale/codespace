import { Router } from 'express';
import { findChallenge } from '../controllers/challengeController';

const router = Router();

// Route to find a user to challenge
router.post('/find', findChallenge);

// // Route to join the challenge room 
// router.get('/:roomId', joinChallengeRoom); 

export default router;
