import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Action from "../../utility/generalServices";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { IUser } from "../../interfaces/interfaces";
import { getLocalStorage } from "../../utility/helper";
import { isAuth } from "../../utility/helper";
import { IMessage } from "./challenge";

interface IUserWithStatus extends IUser {
  currentUser: boolean; // additional field
}


const ChallengeRoom = () => {
  const { id } = useParams<{ id: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(id);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [message, setMessage] = useState<IMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage errors
  const [users, setUsers] = useState<IUserWithStatus[]>([]); // State to store structured user info
  const navigate = useNavigate();
  console.log(message)

  console.log("Room:",roomId);
  console.log("socket:",socketId);

  useEffect(() => {
    const getUser = () => {
      const storedUser = getLocalStorage("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    getUser();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await Action.get("/api/user/getAllUsers");
        
        if (res.data) {
          const usersInRoom = id?.split("_")[1].split("-") as string[];
          const usersInRoomInfo = res.data.filter((u: IUser) =>
            u._id === usersInRoom[0] || u._id === usersInRoom[1]
          );
          const structuredUsers = usersInRoomInfo.map((user: IUser) => ({
            ...user,
            currentUser: user._id === currentUser?._id,
          }));

          setUsers(structuredUsers);
        }
      } catch (err) {
        setError("Failed to fetch users."); // Set error if the request fails
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    fetchUsers();
  }, [id, currentUser]);

  useEffect(() => {
    // Initialize socket connection and set up event listeners
    if (isAuth() && currentUser?._id) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        setSocketId(newSocket.id as string);
        console.log("User:", currentUser?._id, "is connected with socket ID:", newSocket.id);

        newSocket.emit("onlineUser", currentUser?._id, newSocket.id);
        newSocket.emit("userConnected", currentUser?._id);
      });

      newSocket.on("message", (data) => {
        setMessage(data);
        if (data.room_id) {
          setRoomId(data.room_id);
        }
      });

      newSocket.on("exitRoom", (data) => {
        console.log("Exit room notification:", data);
        setMessage(data);
        setRoomId(null);
        navigate("/");
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentUser, navigate]);

  const handleExitRoom = () => {
    if (roomId && socket) {
      socket.emit("exitRoom", { userId: currentUser?._id, socketId, roomId }); // Ensure roomId is sent
    } else {
      console.error("Room ID or socket is missing.");
    }
  };

  return (
    <div style={{ padding: "200px 0 0 0" }}>
      <h1>Challenge Room</h1>
      {loading ? (
        <p>Loading players...</p>
      ) : (
        <p>
          {`${users[0].firstName} vs ${users[1].firstName}`}
        </p>
      )}
      <button className="exit" onClick={handleExitRoom}>Quit Challenge</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ChallengeRoom;
