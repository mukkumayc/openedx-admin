import React, { Component } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import "./Registration.css";
import Config from "../config";

const initialUser = {
  email: "",
  username: "",
  first_name: "",
  second_name: "",
  password: "",
};

class Registration extends Component {
  state = {
    statuses: [],
  };
  render() {
    return (
      <div className="container">
        <Formik
          initialValues={{
            users: [initialUser],
          }}
          onSubmit={(values, { setSubmitting }) =>
            this.handleSubmit(values, setSubmitting)
          }
        >
          {({ values, isSubmitting }) => (
            <Form>
              <FieldArray name="users">
                {({ push, remove }) => (
                  <>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => push(initialUser)}
                    >
                      Add user
                    </button>

                    {values.users?.map((user, index) => (
                      <UserForm
                        key={index}
                        isSubmitting={isSubmitting}
                        remove={remove}
                        index={index}
                        status={this.state.statuses[index]}
                      />
                    ))}
                  </>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  handleSubmit = (values, setSubmitting) => {
    fetch(Config.serverUrl.concat("/massregister"), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((json) => {
        alert(JSON.stringify(json, null, 2));
        this.setState({ statuses: json.statuses });
        setSubmitting(false);
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  };
}

const UserForm = (props) => {
  const { isSubmitting, remove, index, status } = props;
  const alertClass = status
    ? status.status !== "success"
      ? "alert-danger"
      : "alert-success"
    : "alert-primary";
  return (
    <div className={"form-group alert ".concat(alertClass)}>
      <div className="row">
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].email`}
            type="email"
            placeholder="email"
          />
        </div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].username`}
            type="text"
            placeholder="username"
          />
        </div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].password`}
            type="password"
            placeholder="password"
          />
        </div>
        <div className="w-100"></div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].first_name`}
            type="text"
            placeholder="first name"
          />
        </div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].second_name`}
            type="text"
            placeholder="last name"
          />
        </div>
        <div className="col">
          <button
            type="button"
            className="btn btn-danger form-control"
            disabled={isSubmitting}
            onClick={() => remove(index)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="row">
        {status?.message && <div>{status.message}</div>}
      </div>
    </div>
  );
};

export default Registration;
