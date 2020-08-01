import React, { Component } from "react";

class Home extends Component {
  render() {
    return <div className="home">{this.renderLander()}</div>;
  }

  renderLander = () => {
    return (
      <div className="lander">
        <h1>Open edX Admin</h1>
        <p>Web app for an online course platform management</p>
      </div>
    );
  };
}

export default Home;
