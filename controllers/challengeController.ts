import { Request, Response } from "express";
import { Socket } from "socket.io";
import { io } from "../src/server";

interface IUser {
    userId: string;
    socketId: string;
}

interface IUserInRoom extends IUser{
    room_id:string;
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

let onlineUsers: IUser[] = [];
let availableUsers: IAvailUser[] = [];
let peopleInRoom: IUserInRoom[][] = [];

export const addUsers = (userId: string, socketId: string) => {
    const newUser: IUser = { userId, socketId };
    onlineUsers = onlineUsers.filter(user => user.userId !== newUser.userId);
    onlineUsers.push(newUser);
}

export const findChallenge = (req: Request, res: Response) => {
    const { userId, socketId, optionsSelected } = req.body as IAvailUser;

    if (!userId || !socketId) {
        return res.status(400).json({
            success: false,
            message: 'Missing userId or socketId',
        });
    }

    // Find an available user with the same options
    const matchedUserIndex = availableUsers.findIndex(
        user => user.optionsSelected.level === optionsSelected.level &&
                user.optionsSelected.language === optionsSelected.language &&
                user.userId !== userId
    );

    if (matchedUserIndex !== -1) {
        const matchedUser = availableUsers[matchedUserIndex];
        const room_id = `room_${userId}-${matchedUser.userId}`;

        // Emit the message to both users to notify them that the room is created
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

        const room: IUserInRoom[] = [
            { userId, socketId, room_id },
            { userId: matchedUser.userId, socketId: matchedUser.socketId, room_id },
        ];
        peopleInRoom.push(room);

        // Remove both users from the availableUsers array after matching
        availableUsers.splice(matchedUserIndex, 1);

        return res.status(200).json({
            message: `You are in room: ${room_id}`,
            room_id: room_id,
            msg_id: 1,
        });
    } 
    else {
        // If the user is already in the availableUsers array
        if (availableUsers.some(user => user.userId === userId)) {
            io.to(socketId).emit('message', {
                message: `You are already in a room`,
                room_id: null,
                msg_id: 2,
            });
            return res.status(400).json({
                success: false,
                message: 'You are already in a room',
            });
        } 
        else {
            // Add the current user to the availableUsers array
            availableUsers.push({ userId, socketId, optionsSelected });
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
};

// The rest of the functions remain the same
export const exitRoom = (userId: string, socketId: string, roomId: string) => {
    if (roomId) {
        // Find the room that matches the provided roomId
        const room = peopleInRoom.find(room => 
            room.some(user => user.room_id === roomId)
        );

        if (room) {
            // Notify all users in the room about the exit
            room.forEach(user => {
                io.to(user.socketId).emit("exitRoom", { 
                    message: `${userId} has exited the room.`,
                    room_id: roomId, // Include the roomId
                    msg_id: 4,
                });
            });
        } else {
            console.error('Room not found for roomId:', roomId);
        }
    } else {
        console.error('Room ID is missing for exitRoom');
    }
};



export const goToChallengeRoom = (userId: string, socketId: string, roomId: string) => {
    if (roomId) {
        console.log(`Redirecting ${userId} with socket ${socketId} to room: ${roomId}`);
        io.to(socketId).emit("toChallengeRoom", { 
            message: `${userId} has been redirected to room: ${roomId}.`,
            room_id: roomId,
            msg_id: 5,
        });

        const otherUser = peopleInRoom.find(room => 
            room.some(user => user.userId === userId)
        )?.find(u => u.userId !== userId);

        if (otherUser) {
            console.log(`Notifying other user ${otherUser.userId} about room ${roomId}`);
            io.to(otherUser.socketId).emit("toChallengeRoom", { 
                message: `${userId} has been redirected to room: ${roomId}.`,
                room_id: roomId,
                msg_id: 5,
            });
        } else {
            console.log(`No other user found in room ${roomId}`);
        }
    } else {
        console.error('Room ID is missing for goToChallengeRoom');
    }
};
