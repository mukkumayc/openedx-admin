import React, { useEffect, useState } from "react";
import Routes from "./components/Routes";
import NavBar from "./components/NavBar";
import MessageModal, { MessageModalProps } from "./components/MessageModal";
import { AppProps } from "./types";
import { curry2 } from "./utils";
import requestsWrapper from "./RequestsWrapper";
import LoadingPage from "./containers/LoadingPage";
import { RouteComponentProps, withRouter } from "react-router";

const App = ({ history }: RouteComponentProps) => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(true);
  const [message, setMessage] = useState<Omit<MessageModalProps, "setShow">>({
    show: false,
    header: "",
    body: "",
  });
  const showMessage = curry2(
    (header: MessageModalProps["header"], body: MessageModalProps["body"]) =>
      setMessage({ show: true, header, body })
  );

  const setShow = (show: boolean) => {
    setMessage({ ...message, show });
  };

  const appProps: AppProps = {
    showMessage,
    isAuthenticated,
    userHasAuthenticated,
    isAuthenticating,
    setAuthenticating,
  };

  useEffect(() => {
    requestsWrapper.isAuthenticated().then((res) => {
      userHasAuthenticated(res);
      setAuthenticating(false);
      setTimeout(
        () =>
          (window.location.href =
            "http://vmi625775.contaboserver.net:18000/admin"),
        2000
      );
    });
  }, []);

  return (
    <>
      <div className="App">
        <NavBar appProps={appProps} />
        {isAuthenticating ? <LoadingPage /> : <Routes appProps={appProps} />}
        {!isAuthenticating && !isAuthenticated && (
          <MessageModal
            show
            setShow={() => {}}
            header={<h4>You are not authenticated</h4>}
            showButtons={false}
            body={
              <p>
                You'll be redirected to{" "}
                <a href="http://vmi625775.contaboserver.net:18000/admin">
                  login page
                </a>{" "}
                soon...
              </p>
            }
          />
        )}
        <MessageModal {...{ ...message, setShow }} />
      </div>
    </>
  );
};

export default withRouter(App);
