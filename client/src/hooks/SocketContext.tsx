// socketService.ts
import { io, Socket } from "socket.io-client";
import { isAuth } from "../utility/helper";

const socket: Socket = io("http://localhost:5000"); // Replace with your server URL

export const getSocket = (): Socket => {
  return socket;
};

export const getSocketId = ():string | undefined =>{
    return socket.id;
}

export const initializeSocket = (): void => {
  if (isAuth()) { // Use a regular if statement
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });
  } else {
    console.log("User is not Authenticated!! Please Login");
  }
};
