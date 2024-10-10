import React from "react";
import { Link } from "react-router-dom";
import { isAuth } from "../../utility/helper";

const Home: React.FC = () => {
  const lessPadding = isAuth() ? { padding: "150px 0px 100px 0px" } : {};

  return (
    <div className="home">
      <div className="aboutweb" style={lessPadding}>
        <div className="about">
          <div className="tagline">Step into the Arena Let Your Code Speak!</div>
          <div className="info">
            Codespace : Compete in real-time 1v1 Coding Challenges, create and
            share courses, and host competitions. Learn, code, and grow—with
            features for every coder, including accessibility support!
          </div>
        </div>
        <div className="main_features">
          <Link to={"/challenge"}className="challenges feature_link">CHALLENGE</Link>
          <div className="learn feature_link">LEARN</div>
        </div>
      </div>
      <div className="services">
        <header>
          <div className="left">
            <div className="top">
              <span>~</span>Services 
            </div>
            <div className="bottom">Start with</div>
          </div>
          <div className="right"></div>
        </header>
        {/* <div className="eacserv">
          <div className="serv events"></div>
          <div className="serv course"></div>
          <div className="serv write"></div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
