import React, { Component } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
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
  state = {};
  render() {
    return <UsersForm />;
  }
}

class UsersForm extends Component {
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
          validationSchema={Yup.object().shape({
            users: Yup.array().of(
              Yup.object({
                email: Yup.string()
                  .required("Required")
                  .email("Wrong email format"),
                username: Yup.string().required("Required"),
                password: Yup.string().required("Required").min(8),
                first_name: Yup.string().required("Required"),
                second_name: Yup.string().required("Required"),
              })
            ),
          })}
        >
          {({ errors, touched, values, isSubmitting }) => (
            <Form>
              <FieldArray name="users">
                {({ push, remove }) => (
                  <div className="container">
                    <div className="row buttons-row d-flex justify-content-between">
                      <button type="submit" className="btn btn-primary col-sm">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-success col-sm"
                        onClick={() => push(initialUser)}
                      >
                        Add user
                      </button>
                    </div>

                    <div className="row">
                      {values.users?.map((user, index) => (
                        <UserForm
                          key={index}
                          isSubmitting={isSubmitting}
                          remove={(index) => {
                            let statuses = this.state.statuses.slice();
                            statuses.splice(index, 1);
                            console.log("statuses", statuses);
                            this.setState({
                              statuses: statuses,
                            });
                            remove(index);
                          }}
                          index={index}
                          status={this.state.statuses[index]}
                          errors={errors[index]}
                          touched={touched[index]}
                        />
                      ))}
                    </div>
                  </div>
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
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        if (res.status === 401) {
          this.props.userHasAuthenticated(false);
        }
        return res.json();
      })
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
    : "alert-secondary";
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
          <ErrorMessage name={`users[${index}].email`}>
            {(msg) => <small className="text-danger">{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].username`}
            type="text"
            placeholder="username"
          />
          <ErrorMessage name={`users[${index}].username`}>
            {(msg) => <small className="text-danger">{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].password`}
            type="password"
            placeholder="password"
          />
          <ErrorMessage name={`users[${index}].password`}>
            {(msg) => <small className="text-danger">{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="w-100"></div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].first_name`}
            type="text"
            placeholder="first name"
          />
          <ErrorMessage name={`users[${index}].first_name`}>
            {(msg) => <small className="text-danger">{msg}</small>}
          </ErrorMessage>
        </div>
        <div className="col">
          <Field
            className="form-control"
            name={`users[${index}].second_name`}
            type="text"
            placeholder="last name"
          />
          <ErrorMessage name={`users[${index}].second_name`}>
            {(msg) => <small className="text-danger">{msg}</small>}
          </ErrorMessage>
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
