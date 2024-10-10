import { Request, Response } from 'express';
import Question, {IQuestion} from '../models/Questions';

export const getAllQuestions = async (req: Request, res: Response): Promise<void> =>{
    try{
        const questions: IQuestion[] = await Question.find();
        res.json(questions);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching all questions:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching all questions');
    }
}

export const getEasyQuestions = async (req: Request, res: Response): Promise<void> =>{
    try{
        const questions: IQuestion[] = await Question.find();
        const result = questions.filter((question) => question.difficulty === "easy");
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching easy questions:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching easy questions');
    }
}

export const getMediumQuestions = async (req: Request, res: Response): Promise<void> =>{
    try{
        const questions: IQuestion[] = await Question.find();
        const result = questions.filter((question) => question.difficulty === "medium");
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching easy questions:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching easy questions');
    }
}

export const getHardQuestions = async (req: Request, res: Response): Promise<void> =>{
    try{
        const questions: IQuestion[] = await Question.find();
        const result = questions.filter((question) => question.difficulty === "hard");
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching easy questions:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching easy questions');
    }
}