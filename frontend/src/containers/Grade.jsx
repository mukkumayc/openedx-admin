import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./Grade.css";
import Config from "../config";

class Grade extends Component {
  state = { isRequesting: false, courses: [], isFocused: false };
  render() {
    return (
      <div className="grade container">
        <Formik
          initialValues={{ credential: "" }}
          onSubmit={(values, { setSubmitting }) =>
            this.handleSubmit(values, setSubmitting)
          } //{(values, { setSubmitting }) => {
          //   console.log(values);
          //   setSubmitting(false);
          // }}
        >
          {(props) => {
            const { errors, touched, setTouched, isSubmitting } = props;
            return (
              <>
                <Form>
                  <div className="form-group">
                    <label htmlFor="credential-field">
                      Enter email or username
                    </label>
                    <Field
                      className={"form-control ".concat(
                        touched.credential && !this.state.isFocused
                          ? errors.credential
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      )}
                      type="text"
                      name="credential"
                      id="credential-field"
                      validate={(value) => {
                        let error;
                        if (!value) {
                          error = "Required";
                        } else if (!Yup.string().email().isValidSync(value)) {
                          if (
                            !Yup.string()
                              .matches(/^[a-z][a-z0-9]*$/i)
                              .isValidSync(value)
                          ) {
                            error = "Isn't email or username";
                          }
                        }
                        return error;
                      }}
                      onFocus={() => this.setState({ isFocused: true })}
                      onBlur={
                        () => {
                          this.setState({ isFocused: false });
                          setTouched({ credential: true });
                        } //...this.state,
                      }
                    />
                    {errors.credential &&
                      touched.credential &&
                      !this.state.isFocused && (
                        <small className="text-danger">
                          {errors.credential}
                        </small>
                      )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Get grades
                  </button>
                  {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
                </Form>
                {this.formatCourses()}
              </>
            );
          }}
        </Formik>
      </div>
    );
  }

  handleSubmit = (values, setSubmitting) => {
    const isEmail = Yup.string().email().isValidSync(values.credential);
    const params = "?".concat(
      isEmail ? "email=" : "username=",
      values.credential
    );
    fetch(Config.serverUrl + "/grade" + params, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          res
            .json()
            .then((json) => {
              this.setState({
                courses: json.courses,
                requestCompleted: true,
                errorMsg: "",
              });
            })
            .catch((err) => console.error(err));
          setSubmitting(false);
        } else {
          if (res.status === 401) {
            this.props.userHasAuthenticated(false);
          }
          res
            .text()
            .then((res) => {
              this.setState({ errorMsg: res, requestCompleted: true });
              setSubmitting(false);
            })
            .catch((err) => {
              console.error(err);
              setSubmitting(false);
            });
        }
      })
      .catch((err) => {
        this.setState({ errorMsg: err.toString() });
        setSubmitting(false);
      });
  };

  parseCourse = (course) => {
    return (
      <div key={course.course_id} className="alert alert-primary">
        <div>{course.course_id}</div>
        <hr />
        <div>
          {course.grades ? (
            <div>
              {course.grades.map((grade) => (
                <div
                  key={grade.grade_name}
                  className="d-flex justify-content-between"
                >
                  {/* className="grade-name" */}
                  <div>{grade.grade_name}</div>
                  {/* className="grade" */}
                  <div>{grade.grade}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-weight-bold">No grades</div>
          )}
        </div>
      </div>
    );
  };

  formatCourses = () => {
    return (
      <div className="courses-list">
        {this.state.requestCompleted &&
          (this.state.errorMsg.length > 0 ? (
            <div className="alert alert-danger">{this.state.errorMsg}</div>
          ) : this.state.courses.length > 0 ? (
            this.state.courses.map((course) => this.parseCourse(course))
          ) : (
            <div className="alert alert-warning">
              There are no courses for this user
            </div>
          ))}
      </div>
    );
  };
}

export default Grade;
