import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Action from "../../utility/generalServices";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { IUser, IQuestion, IExample } from "../../interfaces/interfaces";
import { getLocalStorage } from "../../utility/helper";
import { isAuth } from "../../utility/helper";
import { IMessage } from "./challenge";
import { getSocket, getSocketId } from "../../hooks/SocketContext";

interface IUserWithStatus extends IUser {
  currentUser: boolean; // additional field
}


const ChallengeRoom = () => {
  const { id } = useParams<{ id: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(id || null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [message, setMessage] = useState<IMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage errors
  const [users, setUsers] = useState<IUserWithStatus[]>([]); // State to store structured user info
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion>();
  const navigate = useNavigate();

  console.log(message);
  console.log(selectedQuestion);

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
        const res = await Action.get("/user/getAllUsers");
        
        if (res.data) {
          const usersInRoom = id?.split("_")[1].split("-") as string[];
          const usersInRoomInfo = res.data.filter((u: IUser) =>
            u._id === usersInRoom[0] || u._id === usersInRoom[1]
          );
          console.log(usersInRoom);
          console.log(res.data);
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
    const fetchQuestions = async () => {
      try {
        const res = await Action.get("/questions/easy");
        const questions: IQuestion[] = res.data;

        if (questions.length > 0) {
          const randomIndex = Math.floor(Math.random() * questions.length);
          setSelectedQuestion(questions[randomIndex]);
        }
      } catch (err) {
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

  const handleExitRoom = () => {
    if (roomId && socket) {
      socket.emit("exitRoom", { userId: currentUser?._id, socketId, roomId });
    } else {
      console.error("Room ID or socket is missing.");
    }
  };

  return (
    <div className="challenge_room">
      <div className="left">
        <div className="editor"></div>
      </div>
      <div className="right">
        <div className="info">
          <div className="top">
            {loading ? (
              <p>Loading players...</p>
            ) : (
              <div className="aboutusers">{`${users[0].firstName} (1200) vs ${users[1].firstName} (1250) (${selectedQuestion?.time} Min)`}</div>
            )}
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
