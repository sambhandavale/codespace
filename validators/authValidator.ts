import { check, ValidationChain } from 'express-validator';

export const validateRegister: ValidationChain[] = [
    check('username')
        .not().isEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    
    check('email')
        .isEmail().withMessage('Please provide a valid email address'),
    
    check('password')
        .not().isEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[0-9]/).withMessage('Password must contain a number')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
];

export const validateLogin: ValidationChain[] = [
    check('password')
        .not().isEmpty().withMessage('Password is required'),
];
