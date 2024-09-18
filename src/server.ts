import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../config/db';
import authRoutes from '../routes/authRoutes';
import profileRoutes from '../routes/profileRoutes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', profileRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
