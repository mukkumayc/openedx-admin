import React, { Component } from "react";
import config from "../config";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    console.log(config.serverUrl + "/hello");
    fetch(config.serverUrl + "/hello")
      .then((res) => {
        res.text().then((text) => {
          this.setState({ loading: false, ok: res.ok, text: text });
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div className="Home">
        {this.state.loading
          ? "Loading..."
          : this.state.ok && this.state.text
          ? "Congratulations!"
          : "Something went wrong"}
      </div>
    );
  }
}
