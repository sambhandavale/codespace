import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Users';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).send('User already exists');
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();
        
        res.status(201).send('User registered'); 
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { usernameOrEmail, password } = req.body;
    try {
        // Find user by either username or email
        const user = await User.findOne({
            $or: [
                { email: usernameOrEmail },
                { username: usernameOrEmail }
            ]
        });
        
        if (!user) {
            res.status(400).send('User not found');
            return;
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).send('Invalid credentials');
            return;
        }
        
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        const userDetails = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        res.json({ token, userDetails });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
};
