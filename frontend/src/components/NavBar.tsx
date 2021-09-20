import React from "react";
import { Link } from "react-router-dom";
import { AppProps } from "../types";
import { Navbar, Nav } from "react-bootstrap";
import requestsWrapper from "../RequestsWrapper";

interface NavBarProps {
  appProps: AppProps;
}

const NavBar = ({ appProps }: NavBarProps) => {
  const { isAuthenticated } = appProps;
  return (
    <Navbar variant="dark" bg="dark" expand="lg">
      <Nav>
        <Link className="navbar-brand" to="/">
          Open edX Admin
        </Link>
        <CollapseController>
          {isAuthenticated ? (
            <>
              {/* <div className="nav-item">
                <Link className="nav-link" to="/proctoring-links">
                  Proctoring links
                </Link>
              </div> */}
              <div className="nav-item">
                <a
                  className="nav-link"
                  href={`${requestsWrapper.serverUrl}/upload_registration_file`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register new users
                </a>
              </div>
              <div className="nav-item">
                <Link className="nav-link" to="/grades">
                  Grades
                </Link>
              </div>
              {/* <div className="nav-item">
                <Link className="nav-link" to="/students-list">
                  Students list
                </Link>
              </div> */}
            </>
          ) : (
            <>
              <div className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </div>
            </>
          )}
        </CollapseController>
      </Nav>
    </Navbar>
  );
};

interface CollapseControllerProps {
  children: JSX.Element;
}

const CollapseController = (props: CollapseControllerProps) => {
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
