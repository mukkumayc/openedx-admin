import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import MessageModal, { useModal } from '@/components/MessageModal'
import { FormGroup } from '@/components/form'
import { getStudents } from '@/requests'
import { isLeft } from '@/utils'

import EnrollmentModal from './EnrollmentModal'
import UnenrollList from './UnenrollList'

const handleStudentsRequest = async (
	values: FormInput,
	setStudents: Dispatch<SetStateAction<string[] | null>>,
	showError: (err: string) => void
) => {
	const res = await getStudents(values)
	if (isLeft(res)) {
		showError(res.left)
		setStudents(null)
	} else {
		setStudents(res.right.students)
	}
}

interface FormInput {
	course: string
	usernames: string
}

const StudentsListManagement: React.FC = () => {
	const { t } = useTranslation()
	const {
		register,
		handleSubmit,
		watch,
		setFocus,
		formState: { isSubmitting }
	} = useForm<FormInput>()
	const [students, setStudents] = useState<string[] | null>(null)
	const [modalProps, showModal] = useModal()
	const showError = (err: string) => showModal(t('Error'), t(err))
	const [showEnroll, setShowEnroll] = useState(false)
	const usernames = watch('usernames')
	const course = watch('course')

	return (
		<Container fluid="md" className="page">
			<Card as="section">
				<Card.Header as="h1">{t('Course student list management')}</Card.Header>
				<Card.Body>
					<FormGroup
						className="mb-3"
						name="course"
						label={t('Course')}
						{...{ register, watch }}
					/>
					<Form.Label>
						{t('Enter usernames or emails separated by comma')}
					</Form.Label>
					<InputGroup>
						<Form.Control
							aria-label={t(
								'Enter usernames or emails separated by comma'
							).toString()}
							{...register('usernames')}
						/>
						<Button
							className="text-white"
							variant="success"
							onClick={handleSubmit((values) => {
								if (
									values.usernames.match(/^([\w.@]+\s*,\s*)*[\w.@]+\s*,?\s*$/)
								) {
									setShowEnroll(true)
								} else {
									setFocus('usernames')
								}
							})}>
							{t('Enroll')}
						</Button>
					</InputGroup>
					<Button
						variant="primary"
						onClick={handleSubmit((values) =>
							handleStudentsRequest(values, setStudents, showError)
						)}
						disabled={isSubmitting}>
						{t('List students')}
					</Button>
				</Card.Body>
			</Card>
			<MessageModal {...modalProps} />
			<EnrollmentModal
				users={usernames}
				course={course}
				show={showEnroll}
				setShow={setShowEnroll}
				action="enroll"
			/>
			{students && <UnenrollList {...{ objects: students, subject: course }} />}
		</Container>
	)
}

export default StudentsListManagement
