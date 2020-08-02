import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Config from "../config";
import "./Login.css";

class Login extends Component {
  state = {
    errorMsg: "",
  };

  render() {
    return (
      <div className="login container">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .required("Email is required")
              .email("Invalid email"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values, { setSubmitting }) =>
            this.handleSubmit(values, setSubmitting)
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <Field
                  className="form-control"
                  type="email"
                  name="email"
                  id="login-email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <Field
                  className="form-control"
                  type="password"
                  name="password"
                  id="login-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Sign in
              </button>
              {this.state.errorMsg ? (
                <div className="alert alert-danger m-3">
                  {this.state.errorMsg}
                </div>
              ) : null}
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  handleSubmit = (values, setSubmitting) => {
    fetch(Config.serverUrl + "/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        credentials: values,
      }),
    })
      .then((res) => {
        if (res.ok) {
          this.props.userHasAuthenticated(true);
        } else {
          res.json().then((json) => {
            this.setState({ errorMsg: json.error });
            setSubmitting(false);
          });
        }
      })
      .catch((err) => {
        this.setState({ errorMsg: err.toString() });
        setSubmitting(false);
      });
  };
}

export default Login;
