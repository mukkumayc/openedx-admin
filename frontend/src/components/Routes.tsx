import React from "react";
import { Switch, Route } from "react-router-dom";
import Hello from "../containers/Hello";
import Home from "../containers/Home";
import Login from "../containers/Login";
import NotFound from "../containers/NotFound";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import Grade from "../containers/Grade";
import ProctoringLinks from "../containers/ProctoringLinks";
import Registration from "../containers/Registration";
import { AppProps } from "../types";

interface RoutesProps {
  appProps: AppProps;
}

const Routes = ({ appProps }: RoutesProps) => {
  return (
    <Switch>
      <AuthenticatedRoute path="/" exact component={Home} appProps={appProps} />
      <AuthenticatedRoute
        path="/hello"
        exact
        component={Hello}
        appProps={appProps}
      />
      <AuthenticatedRoute
        path="/grade"
        exact
        component={Grade}
        appProps={appProps}
      />
      <AuthenticatedRoute
        path="/proctoring-links"
        exact
        component={ProctoringLinks}
        appProps={appProps}
      />
      <AuthenticatedRoute
        path="/registration"
        exact
        component={Registration}
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
