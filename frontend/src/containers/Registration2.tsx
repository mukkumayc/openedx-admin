import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
import {
  Button,
  Card,
  Container,
  Table,
  Form as BForm,
  Spinner,
} from "react-bootstrap";
import * as t from "io-ts";
import Papa from "papaparse";
import { AppProps, EmailC } from "../types";
import { validationErrorsToString } from "../utils";
import { failure } from "io-ts/lib/PathReporter";

interface Registration2Props extends AppProps {}

const UserLineC = t.tuple([EmailC, t.string, t.string, t.string, t.string]);

type UserString = t.TypeOf<typeof UserLineC>;

const Registration2 = (props: Registration2Props) => {
  const [users, setUsers] = useState<Array<UserString> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <Container id="registration" className="page d-flex justify-content-center">
      <Card id="create-many-card" className="form-card">
        <Card.Header>
          <h4>Create many certificates</h4>
        </Card.Header>
        <Card.Body>
          {!users ? (
            <Formik
              initialValues={{ file: null } as { file: File | null }}
              onSubmit={async (values, { setSubmitting }) => {
                if (!values.file) {
                  setSubmitting(false);
                  return;
                }
                const reader = new FileReader();
                reader.onload = async (e) => {
                  if (!e.target) {
                    console.error("Error: no target");
                    setSubmitting(false);
                    return;
                  }
                  const text = e.target.result
                    ? e.target.result.toString()
                    : "";
                  const parsed = Papa.parse(text);
                  console.log(parsed);
                  const UserListC = t.array(UserLineC);
                  if (!(parsed.data[0] instanceof Array)) {
                    alert("Failed to parse list");
                    props.showMessage(
                      "Error while loading file",
                      "Failed to parse file"
                    );
                    setSubmitting(false);
                    return;
                  }

                  const res = UserListC.decode(parsed.data);
                  if (res._tag === "Left") {
                    console.error(validationErrorsToString(res.left));
                    props.showMessage(
                      "Error while loading file",
                      <>
                        <p>Failed to parse file:</p>
                        {failure(res.left).map((val, ind) => (
                          <p key="ind">{val}</p>
                        ))}
                      </>
                    );
                    setSubmitting(false);
                    return;
                  }
                  setFile(values.file);
                  setUsers(res.right);
                };

                reader.readAsText(values.file);
              }}
              validate={(values) => {
                console.log(values);
                const error = !values.file
                  ? "File is required"
                  : values.file.type !== "application/csv" &&
                    values.file.type !== "text/csv"
                  ? "File is not CSV"
                  : values.file.size > 10000
                  ? "File is too big"
                  : "";
                console.log(error);
                return error ? { file: error } : {};
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <div className="form-group mt-3 mb-3">
                    Select file that contains a list of users for whom you want
                    to make a certificate. It must have the following columns:
                    Email, Course ID, Session ID
                    <BForm.Control
                      type="file"
                      name="file"
                      className="form-control"
                      onChange={(event) => {
                        const target = event.currentTarget as HTMLInputElement;
                        setFieldValue("file", target.files && target.files[0]);
                      }}
                    />
                    <ErrorMessage name="file">
                      {(msg) => (
                        <small className="text-danger d-block">{msg}</small>
                      )}
                    </ErrorMessage>
                    <BForm.Text>
                      Only csv files with semicolon as delimiter are accepted!
                    </BForm.Text>
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    Upload file
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((v, i) => (
                    <tr key={v[0]}>
                      <td>{v[0]}</td>
                      <td>{v[1]}</td>
                      <td>{v[2]}</td>
                      <td>{v[3]}</td>
                      <td>{v[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between">
                <Button
                  variant="secondary"
                  onClick={() => setUsers(null)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setLoading(true);

                    await new Promise<void>((resolve) =>
                      setTimeout(() => resolve(), 500)
                    );

                    props.showMessage(
                      "Result",
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </Table>
                    );
                    setUsers(null);
                    setLoading(false);
                  }}
                  disabled={loading}
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Registration2;
