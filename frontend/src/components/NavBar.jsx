import React from "react";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Open edX Admin
      </Link>
      <CollapseController>
        <div className="nav-item">
          <Link className="nav-link" to="/hello">
            Hello
          </Link>
        </div>
        <div className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </div>
      </CollapseController>
    </nav>
  );
};

const CollapseController = (props) => {
  return (
    <>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">{props.children}</ul>
      </div>
    </>
  );
};

export default NavBar;
