import { Request, Response } from "express";
import { Socket } from "socket.io";
import { io } from "../src/server";

interface IUser {
    userId: string;
    socketId: string;
}

let onlineUsers: IUser[] = [];
let availableUser: IUser | null = null;
let peopleInRoom: IUser[][] = [];

export const addUsers = (userId: string, socketId: string) => {
    const newUser: IUser = { userId, socketId };
    onlineUsers = onlineUsers.filter(user => user.userId !== newUser.userId);
    onlineUsers.push(newUser);
}

export const findChallenge = (req: Request, res: Response) => {
    const { userId, socketId } = req.body;

    if (!userId || !socketId) {
        return res.status(400).json({
            success: false,
            message: 'Missing userId or socketId',
        });
    }

    if (availableUser !== null && availableUser?.userId !== userId) {
        const room_id = `room_${userId}-${availableUser.userId}`;
        
        // Emit the message to both users to notify them that the room is created
        io.to(socketId).emit('message', {
            message: `You are in room: ${room_id}`,
            room_id,
            msg_id:1,
        });
        io.to(availableUser.socketId).emit('message', {
            message: `You are in room: ${room_id}`,
            room_id,
            msg_id:1,
        });
        const room: IUser[] = [
            { userId, socketId },
            { userId:availableUser.userId, socketId:availableUser.socketId },
        ];
        peopleInRoom.push(room);
        console.log(peopleInRoom);
        
        availableUser = null; // Clear the available user***
        return res.status(200).json({
            message: `You are in room: ${room_id}`,
            room_id,
            msg_id:1,
        });
    } else if (availableUser?.userId === userId) {
        io.to(socketId).emit('message', {
            message: `You are already in a room`,
            room_id:"",
            msg_id:2,
        });
        return res.status(400).json({
            success: false,
            message: 'You are already in a room',
        });
    } else {
        availableUser = { userId, socketId };
        io.to(socketId).emit('message', {
            message: `Waiting for opponent`,
            room_id:"",
            msg_id:3,
        });
        return res.status(102).json({
            message: 'Waiting for opponent',
            room_id:"",
            msg_id:3,
        });
    }
};

export const exitRoom = (userId: string, socketId: string, roomId: string) => {
    if (roomId) {
        // Notify the current user that they have exited the room
        io.to(socketId).emit("exitRoom", { 
            message: `${userId} has exited the room.`,
            room_id: "",
            msg_id: 4,
        });

        // Find the other user in the room
        const otherUser = peopleInRoom.find(room => 
            room.some(user => user.userId === userId)
        )?.find(u => u.userId !== userId);

        // If the other user exists, notify them as well
        if (otherUser) {
            io.to(otherUser.socketId).emit("exitRoom", { 
                message: `${userId} has exited the room.`,
                room_id: "",
                msg_id: 4,
            });
        }

        console.log(`${userId} exited the room: ${roomId}`);
    } else {
        console.error('Room ID is missing for exitRoom');
    }
};

  
  




