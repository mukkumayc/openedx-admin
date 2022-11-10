import { isLeft } from 'fp-ts/lib/Either'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import MessageModal, { useModal } from '../components/MessageModal'
import { activateCourse } from '../requests'

interface FormInput {
	course: string
}

const ActivateCourse: React.FC = () => {
	const { t } = useTranslation()
	const {
		register,
		handleSubmit,
		formState: { isSubmitting }
	} = useForm<FormInput>()
	const [modalProps, showModal] = useModal()

	const onSubmit: SubmitHandler<FormInput> = async ({ course }) => {
		const res = await activateCourse(course)
		if (isLeft(res)) {
			return showModal(t('Error'), res.left)
		}

		return showModal(t(res.right.status), t(res.right.message))
	}

	return (
		<Container as="main" fluid="md" className="page">
			<Card>
				<Card.Header as="h1">{t('Activate course')}</Card.Header>
				<Card.Body>
					<Form className="add-student-form" onSubmit={handleSubmit(onSubmit)}>
						<Form.Group controlId="course">
							<Form.Label>{t('Course')}</Form.Label>
							<Form.Control {...register('course')} required />
						</Form.Group>
						<Button variant="primary" type="submit" disabled={isSubmitting}>
							{t('Activate')}
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<MessageModal {...modalProps} />
		</Container>
	)
}

export default ActivateCourse
