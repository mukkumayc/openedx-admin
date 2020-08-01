import React from "react";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/hello">Hello</Link>
    </nav>
  );
};

export default NavBar;
