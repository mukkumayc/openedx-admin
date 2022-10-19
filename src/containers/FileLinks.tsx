import { Field, Form as FormikForm, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import requestsWrapper from "../RequestsWrapper";
import { AppProps, courseNames, IFileLinks } from "../types";
import { fold } from "fp-ts/Either";

interface Values {
  username: string;
  course: typeof courseNames[number] | "";
}

interface FileLinksProps extends AppProps {}

const FileLinks = ({ showMessage }: FileLinksProps) => {
  const [links, setLinks] = useState<IFileLinks | null>(null);

  const handleSubmit = async (
    { username, course }: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    fold(
      showMessage("Error"),
      setLinks
    )(await requestsWrapper.fileLinks(username, course));
    setSubmitting(false);
  };

  return (
    <Container className="page d-flex justify-content-center">
      <div className="main-column">
        <Card className="form-card mb-3">
          <Card.Header>
            <h4>Get additional user files</h4>
          </Card.Header>
          <Card.Body>
            <Formik
              initialValues={{ username: "", course: "" }}
              onSubmit={handleSubmit}
            >
              <FormikForm>
                <Form.Group controlId="files-username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control as={Field} name="username" />
                </Form.Group>
                <Form.Group controlId="files-course">
                  <Form.Label>Course</Form.Label>
                  <Form.Control as={Field} name="course" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </FormikForm>
            </Formik>
          </Card.Body>
        </Card>
        <div className="links-list">
          {links && links.links.map((link) => <Alert>{link}</Alert>)}
        </div>
      </div>
    </Container>
  );
};

export default FileLinks;
