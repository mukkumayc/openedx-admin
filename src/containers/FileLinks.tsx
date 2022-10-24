import { Field, Formik, Form as FormikForm, FormikHelpers } from 'formik'
import { fold } from 'fp-ts/Either'
import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'

import requestsWrapper from '../RequestsWrapper'
import MessageModal, { useModal } from '../components/MessageModal'
import { IFileLinks, courseNames } from '../types'

interface Values {
	username: string
	course: typeof courseNames[number] | ''
}

const FileLinks: React.FC = () => {
	const [links, setLinks] = useState<IFileLinks | null>(null)
	const [modalProps, showModal] = useModal()
	const showError = (body: string) => showModal('Error', body)

	const handleSubmit = async (
		{ username, course }: Values,
		{ setSubmitting }: FormikHelpers<Values>
	) => {
		fold(showError, setLinks)(await requestsWrapper.fileLinks(username, course))
		setSubmitting(false)
	}

	return (
		<Container className="page d-flex justify-content-center">
			<div className="main-column">
				<Card className="form-card mb-3">
					<Card.Header>
						<h4>Get additional user files</h4>
					</Card.Header>
					<Card.Body>
						<Formik
							initialValues={{ username: '', course: '' }}
							onSubmit={handleSubmit}>
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
					{links && links.links.map((link, i) => <Alert key={i}>{link}</Alert>)}
				</div>
			</div>
			<MessageModal {...modalProps} />
		</Container>
	)
}

export default FileLinks
