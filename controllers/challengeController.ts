import { Request, Response } from "express";
import { Socket } from "socket.io";
import { io } from "../src/server";
import { AvailableUsers, Rooms } from "../models/Challenge";
import axios from "axios";

interface IOnlineUser {
    userId: string;
    socketId: string;
}

export interface IRoom{
    room_id: string;
    user1: IOnlineUser;
    user2: IOnlineUser;
    optionsSelected: IOptions;
    question: IQuestion;
}

export interface IExample {
    _id: string;
    input: string;
    output: string;
    explanation: string;
}

export interface IQuestion {
    _id: string;
    id: number;
    title: string;
    difficulty: string;
    task: string;
    input_format: string;
    constraints: string;
    output_format: string;
    time: number;
    examples: IExample[];
}

interface IAvailUser {
    userId: string;
    socketId: string;
    optionsSelected: IOptions;
}

interface IOptions {
    level: string;
    language: string;
}

const base_url = process.env.BASE_URL;

// Function to find a challenge
export const findChallenge = async (req: Request, res: Response) => {
    const { userId, socketId, optionsSelected } = req.body as IAvailUser;

    if (!userId || !socketId) {
        return res.status(400).json({
            success: false,
            message: 'Missing userId or socketId',
        });
    }

    const matchedUser = await AvailableUsers.findOne({
        "optionsSelected.level": optionsSelected.level,
        "optionsSelected.language": optionsSelected.language,
        userId: { $ne: userId }
    }) as IAvailUser; // Type assertion

    try {
        // Fetch questions based on the level selected (convert to lowercase for API call)
        const response = await axios.get(`${base_url}/api/questions/${optionsSelected.level.toLowerCase()}`);
        const questions = response.data as IQuestion[];
        if (!questions || questions.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'No questions available for the selected level.',
            });
        }

        // Randomly select a question from the array
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

        if (matchedUser) {
            const room_id = `room_${userId}-${matchedUser.userId}`;

            // Notify both users
            io.to(socketId).emit('message', {
                message: `You are in room: ${room_id}`,
                room_id: room_id,
                msg_id: 1,
            });
            io.to(matchedUser.socketId).emit('message', {
                message: `You are in room: ${room_id}`,
                room_id: room_id,
                msg_id: 1,
            });

            // Save room with the selected question
            const newRoom = new Rooms({
                room_id,
                user1: { userId: userId, socketId: socketId },
                user2: { userId: matchedUser.userId, socketId: matchedUser.socketId },
                optionsSelected,
                question: randomQuestion,
            });
            await newRoom.save();

            // Remove the users from availableUsers after matching
            await AvailableUsers.deleteMany({ userId: { $in: [userId, matchedUser.userId] } });

            return res.status(200).json({
                message: `You are in room: ${room_id}`,
                room_id: room_id,
                msg_id: 1,
                question: randomQuestion, // Return the selected question in the response
            });
        } else {
            const existingUser = await AvailableUsers.findOne({ userId });
            if (existingUser) {
                io.to(socketId).emit('message', {
                    message: `You are already in a room`,
                    room_id: null,
                    msg_id: 2,
                });
                return res.status(400).json({
                    success: false,
                    message: 'You are already in a room',
                });
            } else {
                const availableUser = new AvailableUsers({ userId, socketId, optionsSelected });
                await availableUser.save();

                io.to(socketId).emit('message', {
                    message: `Waiting for opponent`,
                    room_id: null,
                    msg_id: 3,
                });
                return res.status(102).json({
                    message: 'Waiting for opponent',
                    room_id: null,
                    msg_id: 3,
                });
            }
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch questions for the challenge.',
        });
    }
};

// Updated exitRoom function
export const exitRoom = async (userId: string, socketId: string, roomId: string) => {
    if (roomId) {
        // Find the room in the Rooms collection
        const room = await Rooms.findOne({ room_id: roomId });

        if (room) {
            const { user1, user2 } = room;

            // Notify both users in the room about the exit
            io.to(user1.socketId).emit("exitRoom", {
                message: `${user1.userId} has exited the room.`,
                room_id: roomId,
                msg_id: 4,
            });

            io.to(user2.socketId).emit("exitRoom", {
                message: `${user2.userId} has exited the room.`,
                room_id: roomId,
                msg_id: 4,
            });

            // Remove the room from the Rooms collection
            await Rooms.deleteOne({ room_id: roomId });
            console.log(`Room ${roomId} has been removed from the Rooms collection`);

            // Optionally, remove the users from AvailableUsers if needed
            await AvailableUsers.deleteMany({ userId: { $in: [user1.userId, user2.userId] } });
            console.log(`Users from room ${roomId} have been removed from AvailableUsers`);
        } else {
            console.error('Room not found for roomId:', roomId);
        }
    } else {
        console.error('Room ID is missing for exitRoom');
    }
};

// Updated goToChallengeRoom function
export const goToChallengeRoom = async (userId: string, socketId: string, roomId: string) => {
    if (roomId) {
        // Emit to the requesting user
        io.to(socketId).emit("toChallengeRoom", { 
            message: `${userId} has been redirected to room: ${roomId}.`,
            room_id: roomId,
            msg_id: 5,
        });

        // Find the room in the Rooms collection
        const room = await Rooms.findOne({ room_id: roomId });

        if (room) {
            // Identify the other user in the room
            const otherUser = (room.user1.userId === userId) ? room.user2 : room.user1;

            // Notify the other user
            io.to(otherUser.socketId).emit("toChallengeRoom", {
                message: `${userId} has been redirected to room: ${roomId}.`,
                room_id: roomId,
                msg_id: 5,
            });
        } else {
            console.log(`Room ${roomId} not found in the Rooms collection`);
        }
    } else {
        console.error('Room ID is missing for goToChallengeRoom');
    }
};

// To get all the Rooms
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        const { room_id } = req.query;
        let rooms: IRoom[];
        if (room_id) {
            rooms = await Rooms.find({ room_id });
        } else {
            rooms = await Rooms.find();
        }

        res.json(rooms);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching all rooms:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        res.status(500).send('Error fetching all rooms');
    }
}

