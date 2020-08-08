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
  state = {};
  render() {
    return (
      <div className="container">
        <Formik
          initialValues={{
            users: [initialUser],
          }}
          onSubmit={(values, { setSubmitting }) =>
            handleSubmit(values, setSubmitting)
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
}

const UserForm = (props) => {
  const { isSubmitting, remove, index } = props;
  return (
    <div className="row form-group alert alert-primary">
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
  );
};

const handleSubmit = (values, setSubmitting) => {
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
      setSubmitting(false);
    })
    .catch((err) => {
      console.log(err);
      setSubmitting(false);
    });
};

export default Registration;
