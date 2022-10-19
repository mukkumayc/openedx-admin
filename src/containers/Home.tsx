import React from "react";
import "./Home.css";

const Home = () => (
  <div className="page home container">
    <Lander />
  </div>
);

const Lander = () => (
  <div className="lander">
    <h1>Open edX Admin</h1>
    <p>Web app for an online course platform management</p>
  </div>
);

export default Home;
