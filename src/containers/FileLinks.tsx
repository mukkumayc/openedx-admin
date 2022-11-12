import { fold } from 'fp-ts/Either'
import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import MessageModal, { useModal } from '../components/MessageModal'
import { fileLinks } from '../requests'
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
	const { t } = useTranslation()
	const [links, setLinks] = useState<FileLinks | null>(null)
	const [modalProps, showModal] = useModal()
	const showError = (body: string) => showModal(t('Error'), t(body))

	const { register, handleSubmit } = useForm<FormInput>()

	const onSubmit: SubmitHandler<FormInput> = async (values) =>
		fold<string, IFileLinks, void>(showError, (res) => setLinks(res))(
			await fileLinks(values)
		)

	return (
		<main className="page">
			<section className="container-md">
				<Card className="mb-3">
					<Card.Header>
						<h4>{t('Get additional user files')}</h4>
					</Card.Header>
					<Card.Body>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Form.Group controlId="files-username">
								<Form.Label>{t('Username')}</Form.Label>
								<Form.Control {...register('username')} />
							</Form.Group>
							<Form.Group controlId="files-course">
								<Form.Label>{t('Course')}</Form.Label>
								<Form.Control {...register('course')} />
							</Form.Group>
							<Button variant="primary" type="submit">
								{t('Submit')}
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
							{t('No files found for this user and course')}
						</Alert>
					)}
				</div>
			</section>
			<MessageModal {...modalProps} />
		</main>
	)
}

export default FileLinks
