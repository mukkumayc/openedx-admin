import React, { Component } from "react";
import config from "../config";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      message: "Loading...",
    };
  }

  componentDidMount() {
    console.log(config.serverUrl + "/hello");
    fetch(config.serverUrl + "/hello")
      .then((res) => res.text())
      .then((res) => this.setState({ message: res }));
  }

  render() {
    return (
      <div>
        <p>{this.state.message}</p>
      </div>
    );
  }
}
