import express, { Router } from 'express';
import { getAllQuestions, getEasyQuestions, getMediumQuestions, getHardQuestions } from '../controllers/questionController';

const router: Router = express.Router();

// Routes
router.get('/allQuestions', getAllQuestions);
router.get('/easy', getEasyQuestions);
router.get('/medium', getMediumQuestions);
router.get('/hard', getHardQuestions);

export default router;