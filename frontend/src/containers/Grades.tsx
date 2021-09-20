import React, { useState, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import "./Grades.css";
import { ICourseGrades } from "../types";
import requestsWrapper from "../RequestsWrapper";
import { Alert, Card, Container, Form as BForm } from "react-bootstrap";

interface FormValues {
  courseName: string;
  allUsers: "all" | "notall";
  username: string;
}

const ParsedCourse = ({ course }: { course: ICourseGrades }) => (
  <Alert key={course.username}>
    <div>{course.username}</div>
    <hr />
    <div>
      {course.section_breakdown.length > 0 ? (
        <div>
          {course.section_breakdown.map((grade) => (
            <div
              key={grade.subsection_name}
              className="d-flex justify-content-between"
            >
              <div>{grade.subsection_name}</div>
              <div>{grade.percent}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="font-weight-bold">No grades</div>
      )}
    </div>
  </Alert>
);

const Grades = () => {
  const [requestCompleted, setRequestCompleted] = useState(false);
  const [courses, setCourses] = useState<ICourseGrades[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async ({ courseName, allUsers, username }: FormValues, setSubmitting) => {
      setRequestCompleted(false);
      setErrorMsg("");
      const res = await (allUsers === "all"
        ? requestsWrapper.getGradesForCourse(courseName)
        : requestsWrapper.getGradesForStudent(username, courseName));
      if (res._tag === "Left") {
        setErrorMsg(res.left.toString());
        setRequestCompleted(true);
        setSubmitting(false);
        return;
      }
      setCourses(res.right);
      setRequestCompleted(true);
    },
    []
  );

  const formatCourses = useCallback(() => {
    return (
      <div className="users-list">
        {requestCompleted &&
          (errorMsg.length > 0 ? (
            <div className="alert alert-danger">{errorMsg}</div>
          ) : courses.length > 0 ? (
            courses.map((course) => <ParsedCourse {...{ course }} />)
          ) : (
            <div className="alert alert-warning">
              There are no users for this course
            </div>
          ))}
      </div>
    );
  }, [requestCompleted, errorMsg, courses]);

  return (
    <Container className="grade d-flex justify-content-center">
      <Formik
        initialValues={
          {
            courseName: "",
            allUsers: "all",
            username: "",
          } as FormValues
        }
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {({ values, isSubmitting }) => (
          <main>
            <Card className="form-card">
              <Card.Header>
                <h5>Course users and grades</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <BForm.Group className="my-3">
                    <label htmlFor="courseName">Enter course name</label>
                    <Field
                      className="form-control"
                      type="text"
                      name="courseName"
                      id="courseName"
                    />
                  </BForm.Group>
                  <BForm.Group className="my-3">
                    <label className="me-3">
                      <Field
                        className="form-check-input me-1"
                        type="radio"
                        name="allUsers"
                        value="all"
                      />
                      All users
                    </label>
                    <label>
                      <Field
                        className="form-check-input me-1"
                        type="radio"
                        name="allUsers"
                        value="notall"
                      />
                      Specify user
                    </label>
                  </BForm.Group>
                  <BForm.Group className="my-3">
                    <label htmlFor="username">Enter email or username</label>
                    <Field
                      className="form-control"
                      type="text"
                      name="username"
                      id="username"
                      {...(values.allUsers === "all" ? { disabled: true } : {})}
                    />
                  </BForm.Group>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Get grades
                  </button>
                </Form>
              </Card.Body>
            </Card>
            {formatCourses()}
          </main>
        )}
      </Formik>
    </Container>
  );
};

export default Grades;
