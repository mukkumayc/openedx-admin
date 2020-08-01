import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({
  component: C,
  appProps,
  isAuthenticated,
  ...rest
}) => {
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
