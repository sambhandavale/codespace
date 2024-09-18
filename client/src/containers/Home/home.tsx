import React from "react";

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="top">
        <div className="about">
          <div className="tagline">Step into the Arena Let Your Code Speak!</div>
          <div className="info">
            Codespace : Compete in real-time 1v1 Coding Challenges, create and
            share courses, and host competitions. Learn, code, and grow—with
            features for every coder, including accessibility support!
          </div>
        </div>
        <div className="main_features">
          <div className="challenges feature_link">CHALLENGE</div>
          <div className="learn feature_link">LEARN</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
