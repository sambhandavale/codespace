import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from '../config/db';
import authRoutes from '../routes/authRoutes';
import usersRoutes from '../routes/usersRoutes';
import challengeRoutes from '../routes/challengeRoutes';
import { addUsers, exitRoom, goToChallengeRoom } from '../controllers/challengeController';

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["https://codespaceforyou.vercel.app", "http://localhost:4321"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/challenge', challengeRoutes); 


io.on('connection', (socket) => {
  socket.on('onlineUser',(userId, socketId) => {
    addUsers(userId,socketId);
  });
  socket.on('userConnected',(userId) =>{
    console.log('User:', userId, 'is connected:', socket.id);
  });
  socket.on('toChallengeRoom', ({ userId, socketId, roomId }) => {
    goToChallengeRoom( userId, socketId, roomId);
  });
  socket.on('exitRoom', ({ userId, socketId, roomId }) => {
    exitRoom( userId, socketId, roomId);
  });
}); 

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 