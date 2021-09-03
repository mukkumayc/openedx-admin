import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AppProps } from "../types";

interface UnauthenticatedRouteProps extends RouteProps {
  component(props: any): JSX.Element;
  appProps: AppProps;
}

const UnauthenticatedRoute = ({
  component: C,
  appProps,
  ...rest
}: UnauthenticatedRouteProps) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !appProps.isAuthenticated ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default UnauthenticatedRoute;
