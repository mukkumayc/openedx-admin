import React, { useState } from "react";
import Routes from "./components/Routes";
import NavBar from "./components/NavBar";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  return (
    <div className="App">
      <NavBar />
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}

export default App;
