import React, { useState, useEffect } from "react";
import Routes from "./components/Routes";
import NavBar from "./components/NavBar";
import Config from "./config";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    setAuthenticating(true);
    console.log(document.cookie);
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
        <NavBar />
        <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
    )
  );
}

export default App;
