import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AppProps } from "../types";

interface AuthenticatedRouteProps extends RouteProps {
  component(props: any): JSX.Element;
  appProps: AppProps;
}

const AuthenticatedRoute = ({
  component: C,
  appProps,
  ...rest
}: AuthenticatedRouteProps) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        appProps.isAuthenticated ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
