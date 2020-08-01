import React from "react";
import { Switch, Route } from "react-router-dom";
import Hello from "../containers/Hello";
import Home from "../containers/Home";
import Login from "../containers/Login";

const Routes = ({ appProps }) => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/hello" exact component={Hello} />
      <Route path="/login" exact component={Login} />
    </Switch>
  );
};

export default Routes;
