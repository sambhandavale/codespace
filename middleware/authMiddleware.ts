import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Define a custom type for the decoded JWT payload
interface JwtPayload {
    id: string;
}

interface CustomRequest extends Request {
    user?: JwtPayload;
}

export const protect = (req: CustomRequest, res: Response, next: NextFunction): void => {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Access denied');
        return;
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded; // Adding user to request object
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};
