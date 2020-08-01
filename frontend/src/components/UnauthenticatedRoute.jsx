import React from "react";
import { Route, Redirect } from "react-router-dom";

const UnauthenticatedRoute = ({
  component: C,
  appProps,
  isAuthenticated,
  ...rest
}) => {
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
