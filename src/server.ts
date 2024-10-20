import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from '../config/db';
import authRoutes from '../routes/authRoutes';
import usersRoutes from '../routes/usersRoutes';
import questionRoutes from '../routes/questionRoutes';
import challengeRoutes from '../routes/challengeRoutes';
import { exitRoom, goToChallengeRoom } from '../controllers/challengeController';

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "https://codespaceforyou.vercel.app",
      "http://localhost:4321",
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  path: '/socket.io/', // Define the socket.io path explicitly
});


app.use(
  cors({
    credentials: true,
    origin: [
      "https://codespaceforyou.vercel.app", 
      "http://localhost:4321",
    ],
  }),
);

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/questions', questionRoutes)


io.on('connection', (socket) => {
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
 