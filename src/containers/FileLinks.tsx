import { fold } from 'fp-ts/Either'
import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import requestsWrapper from '../RequestsWrapper'
import MessageModal, { useModal } from '../components/MessageModal'
import { IFileLinks } from '../types'

interface FileLinks {
	course_id: string
	username: string
	links: string[]
}

interface FormInput {
	username: string
	course: string
}

const FileLinks: React.FC = () => {
	const [links, setLinks] = useState<FileLinks | null>(null)
	const [modalProps, showModal] = useModal()
	const showError = (body: string) => showModal('Error', body)

	const { register, handleSubmit } = useForm<FormInput>()

	const onSubmit = async ({ username, course }: FormInput) =>
		fold<string, IFileLinks, void>(showError, (res) => setLinks(res))(
			await requestsWrapper.fileLinks(username, course)
		)

	return (
		<>
			<section className="container-md page">
				<Card className="mb-3">
					<Card.Header>
						<h4>Get additional user files</h4>
					</Card.Header>
					<Card.Body>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Form.Group controlId="files-username">
								<Form.Label>Username</Form.Label>
								<Form.Control {...register('username')} />
							</Form.Group>
							<Form.Group controlId="files-course">
								<Form.Label>Course</Form.Label>
								<Form.Control {...register('course')} />
							</Form.Group>
							<Button variant="primary" type="submit">
								Submit
							</Button>
						</form>
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
