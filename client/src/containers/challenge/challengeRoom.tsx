// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Your server URL

const ChallengeRoom: React.FC = () => {
  // const { id } = useParams<{ id: string }>(); // Get room ID from URL params
  // const [opponentName, setOpponentName] = useState<string | null>(null);
  // const navigate = useNavigate(); // Hook to navigate between routes

  // useEffect(() => {
  //   // Join the room when component is mounted
  //   socket.emit('join_room', id);

  //   // Listen for opponent info
  //   socket.on('opponent_info', (data: { opponentName: string }) => {
  //     setOpponentName(data.opponentName);
  //   });

  //   // Clean up on component unmount
  //   return () => {
  //     socket.off('opponent_info');
  //   };
  // }, [id]);

  // const handleExitRoom = () => {
  //   // Emit a leave event to the server
  //   socket.emit('leave_room', id);

  //   // Redirect the user back to the challenge screen or home
  //   navigate('/challenge');
  // };

  return (
    <div style={{padding:"200px"}}>
      {/* <h1>Challenge Room: {id}</h1>
      {opponentName ? (
        <p>You're competing against: {opponentName}</p>
      ) : (
        <p>Waiting for an opponent...</p>
      )}

      <button onClick={handleExitRoom} style={{ marginTop: '20px' }}>
        Exit Room
      </button> */}
    </div>
  );
};

export default ChallengeRoom;
