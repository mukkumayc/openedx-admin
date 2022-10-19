import { Field, Formik, Form as FForm } from "formik";
import React, { useState } from "react";
import { Button, Container, Form, Spinner, Table } from "react-bootstrap";
import requestsWrapper from "../../RequestsWrapper";
import AddUserModal from "./AddUserModal";

const StudentsList = () => {
  const [students, setStudents] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(false);

  return (
    <Container id="users-list" className="page">
      <Formik
        initialValues={{ courseName: "" }}
        onSubmit={async (values, { setSubmitting }) => {
          setLoading(true);
          const res = await requestsWrapper.getStudents(values.courseName);
          if (res._tag === "Right") {
            setStudents(res.right);
          } else {
            console.error(res.left);
            alert(res.left.toString());
          }
          setLoading(false);
          setSubmitting(false);
        }}
        validate={(values) =>
          values.courseName.length > 0 ? {} : { courseName: "Required" }
        }
      >
        {({ values, touched, errors }) => (
          <>
            <FForm>
              <Form.Group className="mb-3">
                <Field className="form-control" name="courseName" type="text" />
              </Form.Group>
              <div className="actions mb-3 d-flex justify-content-between">
                <Button type="submit" disabled={values.courseName.length === 0}>
                  List students
                </Button>
                <Button
                  variant="success"
                  onClick={() => setAddingUser(true)}
                  disabled={values.courseName.length === 0}
                >
                  Add student
                </Button>
              </div>
            </FForm>
            {loading ? (
              <div className="spinner-loader-wrapper d-flex justify-content-center">
                <Spinner
                  className="spinner-loader"
                  animation="border"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              students !== null && (
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((v, i) => (
                      <tr key={i}>
                        <td>{i}</td>
                        <td>{v}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => {
                              requestsWrapper
                                .deleteStudent(v, values.courseName)
                                .then((res) => {
                                  if (res._tag === "Right") {
                                    alert(res.right);
                                  } else {
                                    alert(res.left.toString());
                                  }
                                });
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
            )}
            <AddUserModal
              show={addingUser}
              setShow={setAddingUser}
              courseName={values.courseName}
            />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default StudentsList;
