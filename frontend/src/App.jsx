import React, { useState, useEffect } from "react";
import Routes from "./components/Routes";
import NavBar from "./components/NavBar";
import Config from "./config";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(true);
  const appProps = { isAuthenticated, userHasAuthenticated };

  useEffect(() => {
    fetch(Config.serverUrl + "/checktoken", {
      credentials: "include",
    })
      .then((res) => {
        userHasAuthenticated(res.ok);
        setAuthenticating(false);
      })
      .catch((e) => {
        console.error(e);
        setAuthenticating(false);
      });
  }, []);
  return (
    !isAuthenticating && (
      <div className="App">
        <NavBar appProps={appProps} />
        <Routes appProps={appProps} />
      </div>
    )
  );
}

export default App;
