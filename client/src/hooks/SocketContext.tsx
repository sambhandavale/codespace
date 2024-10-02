// socketService.ts
import { io, Socket } from "socket.io-client";
import { isAuth } from "../utility/helper";

const socket: Socket = io(import.meta.env.VITE_SERVER_URL); // Replace with your server URL

export const getSocket = (): Socket => {
  return socket;
};

export const getSocketId = ():string | undefined =>{
    return socket.id;
}

export const initializeSocket = (): void => {
  if (isAuth()) {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });
  } else {
    console.log("User is not Authenticated!! Please Login");
  }
};
