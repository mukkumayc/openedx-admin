import React from "react";
import { Switch, Route } from "react-router-dom";
import Hello from "../containers/Hello";
import Home from "../containers/Home";
import Login from "../containers/Login";
import NotFound from "../containers/NotFound";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import ProctoringLinks from "../containers/ProctoringLinks";
import Registration from "../containers/Registration";
import { AppProps } from "../types";
import StudentsList from "../containers/courses/StudentsList";
import Grades from "../containers/Grades";
import Registration2 from "../containers/Registration2";

interface RoutesProps {
  appProps: AppProps;
}

const Routes = ({ appProps }: RoutesProps) => (
  <Switch>
    <AuthenticatedRoute path="/" exact component={Home} appProps={appProps} />
    <AuthenticatedRoute
      path="/hello"
      exact
      component={Hello}
      appProps={appProps}
    />
    <AuthenticatedRoute
      path="/grades"
      exact
      component={Grades}
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
    <AuthenticatedRoute
      path="/registration2"
      exact
      component={Registration2}
      appProps={appProps}
    />
    <AuthenticatedRoute
      path="/students-list"
      exact
      component={StudentsList}
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

export default Routes;
