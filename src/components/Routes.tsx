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
import FileLinks from "../containers/FileLinks";

interface RoutesProps {
  appProps: AppProps;
}

const authenticatedRoutes: [string, (props?: any) => JSX.Element][] = [
  ["/", Home],
  ["/hello", Hello],
  ["/grades", Grades],
  ["/proctoring-links", ProctoringLinks],
  ["/registration", Registration],
  ["/registration2", Registration2],
  ["/students-list", StudentsList],
  ["/files", FileLinks],
];

const Routes = ({ appProps }: RoutesProps) => (
  <Switch>
    {authenticatedRoutes.map((route) => (
      <AuthenticatedRoute
        key={route[0]}
        path={route[0]}
        exact
        component={route[1]}
        {...{ appProps }}
      />
    ))}
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
