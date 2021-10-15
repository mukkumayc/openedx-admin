import React, { useState } from "react";
import Routes from "./components/Routes";
import NavBar from "./components/NavBar";
import MessageModal, { MessageModalProps } from "./components/MessageModal";
import { AppProps } from "./types";
import { curry2 } from "./utils";

const App = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(true);
  // const [isAuthenticating, setAuthenticating] = useState(false);
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
  };

  // useEffect(() => {
  //   fetch(Config.serverUrl + "/checktoken", {
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       userHasAuthenticated(res.ok);
  //       setAuthenticating(false);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       setAuthenticating(false);
  //     });
  // }, []);
  return (
    <>
      {/* {!isAuthenticating && ( */}
      {true && (
        <div className="App">
          <NavBar appProps={appProps} />
          <Routes appProps={appProps} />
          <MessageModal {...{ ...message, setShow }} />
        </div>
      )}
    </>
  );
};

export default App;
