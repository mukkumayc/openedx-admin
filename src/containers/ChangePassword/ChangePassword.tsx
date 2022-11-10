import { isLeft } from 'fp-ts/lib/Either'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import MessageModal, { useModal } from '../../components/MessageModal'
import { changePassword } from '../../requests'

interface FormInput {
	password: string
	username: string
}

const ChangePassword: React.FC = () => {
	const { t } = useTranslation()
	const {
		register,
		handleSubmit,
		formState: { isSubmitting }
	} = useForm<FormInput>()
	const [modalProps, showModal] = useModal()

	const onSubmit: SubmitHandler<FormInput> = async ({ username, password }) => {
		const res = await changePassword(username, password)
		if (isLeft(res)) {
			return showModal(t('Error'), res.left)
		}

		return showModal(t(res.right.status), t(res.right.message))
	}

	return (
		<Container as="main" fluid="md" className="page">
			<Card>
				<Card.Header as="h1">{t("Change user's password")}</Card.Header>
				<Card.Body>
					<Form className="add-student-form" onSubmit={handleSubmit(onSubmit)}>
						<Form.Group controlId="username">
							<Form.Label>{t('Username')}</Form.Label>
							<Form.Control {...register('username')} required />
						</Form.Group>
						<Form.Group controlId="password">
							<Form.Label>{t('New password')}</Form.Label>
							<Form.Control {...register('password')} required />
						</Form.Group>
						<Button variant="primary" type="submit" disabled={isSubmitting}>
							{t('Change')}
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<MessageModal {...modalProps} />
		</Container>
	)
}

export default ChangePassword
