import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Action from "../../utility/generalServices";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { IUser, IQuestion, IExample } from "../../interfaces/interfaces";
import { getLocalStorage, setLocalStorage } from "../../utility/helper";
import { isAuth } from "../../utility/helper";
import { IMessage } from "./challenge";
import { getSocket, getSocketId } from "../../hooks/SocketContext";
import CodeEditor from "../../components/challenges/challengeRoom/CodeEditor"

interface IUserWithStatus extends IUser {
  currentUser: boolean;
}

const ChallengeRoom = () => {
  const { id } = useParams<{ id: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(id || null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [message, setMessage] = useState<IMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<IUserWithStatus[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // State to track time
  const navigate = useNavigate();

  // Fetch user from localStorage
  useEffect(() => {
    const getUser = () => {
      const storedUser = getLocalStorage("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    getUser();
  }, [id]);

  // Fetch users in the room
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await Action.get("/user/getAllUsers");

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
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [id, currentUser]);

  // Set up socket connection
  useEffect(() => {
    if (isAuth() && currentUser?._id) {
      const newSocket = getSocket();
      const newSocketId = getSocketId();
      setSocket(newSocket);
      if (typeof newSocketId === "string") {
        setSocketId(newSocketId);
      }

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
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (roomId) {
        try {
          const res = await Action.get(`/challenge/allRooms?id=${roomId}`);
          if (res.data) {
            setSelectedQuestion(res.data[0].question);
  
            const savedStartTime = getLocalStorage(`timer_start_${roomId}`);
            const currentTime = new Date().getTime();
  
            if (!savedStartTime) {
              setLocalStorage(`timer_start_${roomId}`, currentTime.toString());
              setTimeLeft(res.data[0].question.time * 60);
            } else {
              const elapsedTime = (currentTime - parseInt(savedStartTime, 10)) / 1000;
              let remainingTime = res.data[0].question.time * 60 - elapsedTime;

              remainingTime = Math.floor(remainingTime);
  
              if (remainingTime > 0) {
                setTimeLeft(remainingTime);
              } else {
                handleExitRoom();
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch question:", err);
          setError("Failed to fetch question.");
        }
      }
    };
  
    fetchQuestion();
  }, [roomId]);
  

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft === 0) {
      handleExitRoom();
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleExitRoom = () => {
    if (roomId && socket) {
      socket.emit("exitRoom", { userId: currentUser?._id, socketId, roomId });
      localStorage.removeItem(`timer_start_${roomId}`);
    } else {
      console.error("Room ID or socket is missing.");
    }
  };

  // Format time into minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Check if current user is in the room
  const isCurrentUserInRoom = users.some(user => user._id === currentUser?._id);

  if (!isCurrentUserInRoom) {
    return <div className="noentry">You are not allowed here</div>;
  }

  return (
    <div className="challenge_room">
      <div className="left">
        <CodeEditor />
      </div>
      <div className="right">
        <div className="info">
          <div className="top">
            <div className="users_timer">
              <div className="aboutusers">{`${users[0]?.firstName} (${users[0]?.rating}) vs ${users[1]?.firstName} (${users[1]?.rating}) (${selectedQuestion?.time} Min)`}</div>
              <div className="timer">Time left: {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}</div>
            </div>
            <header>
              <div className="level">{selectedQuestion?.difficulty}</div>
              <div className="qtitle">{selectedQuestion?.title}</div>
            </header>
            <div className="desc">{selectedQuestion?.task}</div>
            <div className="examples">
              {selectedQuestion?.examples.map((example: IExample, index) => (
                <div key={index} className="example">
                  <div className="exampleno">Example {index + 1}</div>
                  <div className="aboutex_container">
                    <div className="aboutex">
                      <div className="inp ex">Input: {example.input}</div>
                      <div className="out ex">Output: {example.output}</div>
                      <div className="explain ex">Explanation: {example.explanation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom">
            <div className="actions">
              <div className="draw">1/2 DRAW</div>
              <div className="abort" onClick={handleExitRoom}>
                <img src="/icons/challenge/abort.svg" alt="abort" />
                ABORT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeRoom;
