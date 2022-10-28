import { Field, Formik, Form as FormikForm, FormikHelpers } from 'formik'
import { fold } from 'fp-ts/Either'
import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'

import requestsWrapper from '../RequestsWrapper'
import MessageModal, { useModal } from '../components/MessageModal'
import { IFileLinks, courseNames } from '../types'

interface Values {
	username: string
	course: typeof courseNames[number] | ''
}

interface FileLinks {
	course_id: string
	username: string
	links: string[]
}

const FileLinks: React.FC = () => {
	const [links, setLinks] = useState<FileLinks | null>(null)
	const [modalProps, showModal] = useModal()
	const showError = (body: string) => showModal('Error', body)

	const handleSubmit = async (
		{ username, course }: Values,
		{ setSubmitting }: FormikHelpers<Values>
	) => {
		fold<string, IFileLinks, void>(showError, (res) =>
			setLinks({ ...res, links: JSON.parse(res.links.replaceAll("'", '"')) })
		)(await requestsWrapper.fileLinks(username, course))
		setSubmitting(false)
	}

	return (
		<>
			<section className="container-md page">
				<Card className="mb-3">
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
			</section>
			<section className="container-md results">
				<div className="links-list">
					{links &&
						links.links.map((link, i) => (
							<Alert key={i}>
								<a
									className="text-truncate d-inline-block"
									href={link}
									rel="noreferrer"
									target="_blank"
									style={{ width: '100%' }}>
									{link}
								</a>
							</Alert>
						))}
					{links && links.links.length === 0 && (
						<Alert variant="warning">
							No files found for this user and course
						</Alert>
					)}
				</div>
			</section>
			<MessageModal {...modalProps} />
		</>
	)
}

export default FileLinks
