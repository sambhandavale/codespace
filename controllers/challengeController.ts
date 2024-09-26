import { Request, Response } from "express";
import { Socket } from "socket.io";
import { io } from "../src/server";

interface IUser {
    userId: string;
    socketId: string;
}

interface IUserInRoom extends IUser {
    room_id: string;
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

// Update availRoom structure to be an object with room IDs as keys
let availRoom: {
    [roomId: string]: {
        user1: string;
        user2: string;
        optionsSelected: IOptions;
    }
} = {};

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

        // Create a room entry in availRoom with user IDs and options
        availRoom[room_id] = {
            user1: userId,
            user2: matchedUser.userId,
            optionsSelected: matchedUser.optionsSelected, // You can also keep user1's options if needed
        };
        console.log("Current rooms:", availRoom);

        // Remove both users from the availableUsers array after matching
        availableUsers.splice(matchedUserIndex, 1);

        return res.status(200).json({
            message: `You are in room: ${room_id}`,
            room_id: room_id,
            msg_id: 1,
        });
    } else {
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
        } else {
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

// Updated exitRoom function
export const exitRoom = (userId: string, socketId: string, roomId: string) => {
    if (roomId) {
        // Check if the room exists
        if (availRoom[roomId]) {
            // Notify all users in the room about the exit
            const { user1, user2 } = availRoom[roomId];

            io.to(socketId).emit("exitRoom", { 
                message: `${userId} has exited the room.`,
                room_id: roomId,
                msg_id: 4,
            });

            // Notify the other user
            const otherUserSocketId = (user1 === userId) ? user2 : user1; // Get the other user's socket ID
            io.to(otherUserSocketId).emit("exitRoom", { 
                message: `${userId} has exited the room.`,
                room_id: roomId,
                msg_id: 4,
            });

            // Remove the room from availRoom
            delete availRoom[roomId];
            console.log(`Room ${roomId} has been removed from availRoom`);

            // Optionally, remove the users from availableUsers if needed
            availableUsers = availableUsers.filter(u => u.userId !== user1 && u.userId !== user2);
            console.log(`Users from room ${roomId} have been removed from availableUsers`);
        } else {
            console.error('Room not found for roomId:', roomId);
        }
    } else {
        console.error('Room ID is missing for exitRoom');
    }
};

// goToChallengeRoom function remains unchanged as it doesn't directly interact with availRoom
export const goToChallengeRoom = (userId: string, socketId: string, roomId: string) => {
    if (roomId) {
        io.to(socketId).emit("toChallengeRoom", { 
            message: `${userId} has been redirected to room: ${roomId}.`,
            room_id: roomId,
            msg_id: 5,
        });

        const otherUser = Object.values(availRoom).find(room => 
            room.user1 === userId || room.user2 === userId
        );

        if (otherUser) {
            const otherUserId = (otherUser.user1 === userId) ? otherUser.user2 : otherUser.user1;
            const otherUserSocketId = (otherUser.user1 === userId) ? otherUser.user2 : otherUser.user1;
            io.to(otherUserSocketId).emit("toChallengeRoom", { 
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

// Other functions remain unchanged
