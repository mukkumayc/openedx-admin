import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Config from "../config";

class Login extends Component {
  render() {
    return (
      <div className="Login">
        Login page
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
              <label htmlFor="login-email">Email</label>
              <Field type="email" name="email" id="login-email" />
              <ErrorMessage name="email" component="div" />
              <label htmlFor="login-password">Password</label>
              <Field type="password" name="password" id="login-password" />
              <ErrorMessage name="password" component="div" />
              <button type="submit" disabled={isSubmitting}>
                Sign in
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  handleSubmit = async (values, setSubmitting) => {
    console.log(values);
    await fetch(Config.serverUrl + "/hello", {
      method: "get",
    })
      .then((res) => res.text())
      .then((res) => console.log(res));

    setSubmitting(false);

    this.props.history.push("/");
  };
}

export default Login;
