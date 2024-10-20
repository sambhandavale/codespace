import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { isAuth } from "../../utility/helper";
import { Link, useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../utility/helper";
import Action from "../../utility/generalServices";
import { IUser } from "../../interfaces/interfaces";
import { challengeInfo } from "../../utility/challengeInfo";
import { getSocket, getSocketId } from "../../hooks/SocketContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

export interface IMessage {
  message: string;
  room_id: string;
  msg_id: number;
}

interface IOptions {
  level: string;
  language: string;
}

const ChallengeComponent = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [message, setMessage] = useState<IMessage | null>(null);
  const [optionsSelected, setOptionsSelected] = useState<IOptions>({ level: "", language: "" });
  const navigate = useNavigate();

  const levels = [
    { label: "Friendly Spar", value: "Easy" },
    { label: "Tactical Duel", value: "Medium" },
    { label: "Ultimate Showdown", value: "Hard" },
  ];

  const languages = [
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C", value: "c" },
    { label: "C++", value: "cpp" },
  ];

  // Fetch user info from localStorage
  useEffect(() => {
    const getUser = () => {
      const storedUser = getLocalStorage("user");
      if (storedUser) { 
        setUser(JSON.parse(storedUser));
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (isAuth() && user?._id) {
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

      newSocket.on("toChallengeRoom", (data) => {
        if (data.room_id) {
          console.log("You are in room:", data.room_id);
          setMessage(data);
          navigate(`/challenge/${data.room_id}`);
        } else {
          console.error("Room ID is missing in toChallengeRoom event.");
        }
      });
    }
  }, [user, navigate]);
  


  useEffect(() => {
    if (message?.room_id && socket) {
      socket.emit("toChallengeRoom", { userId: user?._id, socketId, roomId: message.room_id });
    }
  }, [roomId, socket, message]);

  const getChallenge = async () => {
    if (!optionsSelected.level && !optionsSelected.language) {
      toast.error("Please select Level of Challenge and Language:");
      return;
    }
    try {
      if (user?._id && socketId) {
        const res = await Action.post("/challenge/find", {
          userId: user._id,
          socketId,
          optionsSelected,
        });
        if (res) {
          console.log("Challenge response:", res);
          const room_id = res.data.room_id;
          setRoomId(room_id);
        }
      } else {
        console.error("User ID or Socket ID is missing.");
      }
    } catch (err) {
      console.error("Error getting challenge:", err);
    }
  };

  const handleSelection = (key: keyof IOptions, value: string) => {
    setOptionsSelected((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value, // Toggle selection
    }));
  };

  return (
    <div className="challenge">
      <ToastContainer /> {/* Toast container for notifications */}
      {isAuth() ? (
        <main>
          <div className="left">
            <img src="/assets/challenges/middle.png" alt="" />
          </div>
          <div className="right">
            <div className="top">Challenge To Win</div>
            <div className="bottom">
              <div className="options">
                <div className="levels">
                  {levels.map((level) => (
                    <button
                      key={level.value}
                      className={`level ${optionsSelected.level === level.value ? "selected" : ""}`}
                      onClick={() => handleSelection("level", level.value)}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
                <div className="lang">
                  <div className="top">Choose Your Language</div>
                  <div className="bottom">
                    {languages.map((language) => (
                      <div
                        key={language.value}
                        className={`lan ${optionsSelected.language === language.value ? "selected" : ""}`}
                        onClick={() => handleSelection("language", language.value)}
                      >
                        <div className="langname">{language.label}</div>
                        <img src={`/icons/challenge/languages/${language.value}.svg`} alt={language.label} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className={`finding ${(optionsSelected.level && optionsSelected.language) ? 'find' : ''}`}
                onClick={getChallenge}
              >
                {message?.msg_id !== 3 ? `Find Challenge` : `${message.message}...`}
              </button>
            </div>
          </div>
        </main>
      ) : (
        <Link to="/authenticate/login">Login to Challenge</Link>
      )}
      <div className="about">
        <header>About Challenges</header>
        <div className="content">
          <div className="gen">{challengeInfo.description}</div>
          <div className="info">
            {challengeInfo.levels.map((level, index) => (
              <div key={index} className="point">
                <div className="levelname">{level.levelName}</div>
                <div className="aboutlevel">{level.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeComponent;
