import React, { useState, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./Grade.css";
import Config from "../config";
import { ICourse } from "../types";

interface GradeProps {
  userHasAuthenticated(b: boolean): void;
}

const Grade = (props: GradeProps) => {
  const [requestCompleted, setRequestCompleted] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [focused, setFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    (values, setSubmitting) => {
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
                console.log(json);
                setCourses(json.courses);
                setRequestCompleted(true);
              })
              .catch(console.error)
              .finally(() => setSubmitting(false));
          } else {
            if (res.status === 401) {
              props.userHasAuthenticated(false);
            }
            res
              .text()
              .then((res) => {
                setErrorMsg(res);
                setRequestCompleted(true);
                setSubmitting(false);
              })
              .catch((err) => {
                console.error(err);
                setSubmitting(false);
              });
          }
        })
        .catch((err) => {
          setErrorMsg(err.toString());
          setSubmitting(false);
        });
    },
    [props]
  );

  const parseCourse = useCallback((course: ICourse) => {
    return (
      <div key={course.courseId} className="alert alert-primary">
        <div>{course.courseId}</div>
        <hr />
        <div>
          {course.grades ? (
            <div>
              {course.grades.map((grade) => (
                <div
                  key={grade.gradeName}
                  className="d-flex justify-content-between"
                >
                  {/* className="grade-name" */}
                  <div>{grade.gradeName}</div>
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
  }, []);

  const formatCourses = useCallback(() => {
    return (
      <div className="courses-list">
        {requestCompleted &&
          (errorMsg.length > 0 ? (
            <div className="alert alert-danger">{errorMsg}</div>
          ) : courses.length > 0 ? (
            courses.map((course) => parseCourse(course))
          ) : (
            <div className="alert alert-warning">
              There are no courses for this user
            </div>
          ))}
      </div>
    );
  }, [requestCompleted, errorMsg, courses, parseCourse]);

  return (
    <div className="grade container">
      <Formik
        initialValues={{ credential: "" }}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
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
                      touched.credential && !focused
                        ? errors.credential
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    )}
                    type="text"
                    name="credential"
                    id="credential-field"
                    validate={(value: string) => {
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
                    onFocus={() => setFocused(true)}
                    onBlur={
                      () => {
                        setFocused(true);
                        setTouched({ credential: true });
                      } //...this.state,
                    }
                  />
                  {errors.credential && touched.credential && !focused && (
                    <small className="text-danger">{errors.credential}</small>
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
              {formatCourses()}
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default Grade;
