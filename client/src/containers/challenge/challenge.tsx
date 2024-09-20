import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { isAuth } from "../../utility/helper";
import { Link, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../utility/helper";
import Action from "../../utility/generalServices";
import { IUser } from "../../interfaces/interfaces";

interface IMessage {
  message: string;
  room_id: string;
  msg_id: number;
}

const ChallengeComponent = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string>();
  const [user, setUser] = useState<IUser>();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [message, setMessage] = useState<IMessage>();
  console.log("roomid:",roomId,",socket:",socket);
  
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch user info from localStorage
    useEffect(() => {
      const getUser = () => {
        const storedUser = getLocalStorage('user'); 
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      };
      getUser();
    }, []);
  

  useEffect(() => {
    // Initialize socket connection and set up event listeners
    if (isAuth() && user?._id) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        setSocketId(newSocket.id);
        console.log("User:", user._id, "is connected with socket ID:", newSocket.id);

        // Emit events for onlineUser and userConnected
        newSocket.emit("onlineUser", user._id, newSocket.id);
        newSocket.emit("userConnected", user._id);
      });

      // Listen for 'message' event from server
      newSocket.on("message", (data) => {
        setMessage(data); // Set the message received from server
      });

      // Listen for 'exitRoom' event from server
      newSocket.on("exitRoom", (data) => {
        console.log("Exit room notification:", data);
        setMessage(data);
        setRoomId(null);
        navigate("/");
      });


      return () => {
        newSocket.disconnect(); // Clean up on component unmount
      };
    }
  }, [user, navigate]);

  // Handle challenge request
  const getChallenge = async () => {
    try {
      if (user?._id && socketId) {
        const res = await Action.post("/api/challenge/find", {
          userId: user._id, // Send userId from fetched user
          socketId: socketId,
        });
        if (res) {
          console.log("Challenge response:", res);
          setRoomId(res.data.room_id);
        }
      } else {
        console.error("User ID or Socket ID is missing.");
      }
    } catch (err) {
      console.error("Error getting challenge:", err);
    }
  };

  const handleExitRoom = () => {
    if (roomId && socket) {
      socket.emit("exitRoom", { userId: user?._id, socketId, roomId }); // Ensure roomId is sent
    } else {
      console.error("Room ID or socket is missing.");
    }
  };
  

  return (
    <div style={{ padding: "200px 0 0 0" }}>
      {isAuth() ? (
        <div>
          <div className="msg">You are connected with Socket ID: {socketId}</div>
          {message?.msg_id !== 1 ? <button onClick={getChallenge}>Find Challenge</button> : <button onClick={handleExitRoom}>Exit</button>}
          {message && <div>{message.message}</div>}
        </div>
      ) : (
        <Link to="/authenticate/login">Login to Challenge</Link>
      )}
    </div>
  );
};

export default ChallengeComponent;
