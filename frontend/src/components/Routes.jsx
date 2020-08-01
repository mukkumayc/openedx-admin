import React from "react";
import { Switch, Route } from "react-router-dom";
import Hello from "../containers/Hello";
import Home from "../containers/Home";

const Routes = ({ appProps }) => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/hello" exact component={Hello} />
    </Switch>
  );
};

export default Routes;
