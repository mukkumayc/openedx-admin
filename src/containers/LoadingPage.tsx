import React from "react";
import { Container } from "react-bootstrap";
import Spinner from "../components/Spinner";

const LoadingPage = () => (
  <Container id="loading" className="page d-flex justify-content-center">
    <div className="message-wrapper">
      <h1 className="text-center">Loading...</h1>
      <div className="d-flex justify-content-center">
        <Spinner />
      </div>
    </div>
  </Container>
);

export default LoadingPage;
