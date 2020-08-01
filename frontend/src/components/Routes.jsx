import React from "react";
import { Switch, Route } from "react-router-dom";
import Hello from "../containers/Hello";
import Home from "../containers/Home";
import Login from "../containers/Login";
import NotFound from "../containers/NotFound";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

const Routes = ({ appProps }) => {
  return (
    <Switch>
      <AuthenticatedRoute path="/" exact component={Home} appProps={appProps} />
      <AuthenticatedRoute
        path="/hello"
        exact
        component={Hello}
        appProps={appProps}
      />
      <UnauthenticatedRoute
        path="/login"
        exact
        component={Login}
        appProps={appProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
