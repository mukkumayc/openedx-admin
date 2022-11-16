import MessageModal, { useModal } from '@/components/MessageModal'
import { FormGroup } from '@/components/form'
import { addStudent, getStudents, removeStudent } from '@/requests'
import { isLeft } from 'fp-ts/lib/Either'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
	Button,
	Card,
	Container,
	Form,
	InputGroup,
	ListGroup,
	Modal
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const UnenrollList: React.FC<{ students: string[]; course: string }> = ({
	students,
	course
}) => {
	const { t } = useTranslation()

	const { register, handleSubmit, watch, reset } = useForm<{
		[x: string]: boolean
	}>({
		defaultValues: students.reduce((obj, st) => ({ ...obj, [st]: false }), {})
	})

	const sts = watch(students)
	const [showUnenroll, setShowUnenroll] = useState(false)

	const onUnenroll = () => setShowUnenroll(true)

	return (
		<Form onSubmit={handleSubmit(onUnenroll)}>
			<Card as="section" className="mt-3">
				<Card.Header className="unenroll-list">
					{sts.some((el) => el) && (
						<div className="unenroll-actions-list">
							<Button variant="danger" type="submit">
								{t('Unenroll')}
							</Button>
							<Button variant="secondary" onClick={() => reset()}>
								{t('Cancel')}
							</Button>
						</div>
					)}
				</Card.Header>
				<Card.Body>
					<ListGroup variant="flush">
						{students.map((st) => (
							<ListGroup.Item key={st}>
								<Form.Group controlId={st}>
									<Form.Check type="checkbox">
										<Form.Check.Input type="checkbox" {...register(st)} />
										<Form.Check.Label>{st}</Form.Check.Label>
									</Form.Check>
								</Form.Group>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Card.Body>
			</Card>
			<EnrollModal
				users={students.filter((st, i) => sts[i])}
				course={course}
				show={showUnenroll}
				setShow={setShowUnenroll}
				action="unenroll"
			/>
		</Form>
	)
}

const EnrollConfirmationInfo: React.FC<{
	course: string
	usernames: string[]
	action: 'enroll' | 'unenroll'
}> = ({ course, usernames, action }) => {
	const { t } = useTranslation()
	return (
		<>
			<p>
				{action === 'enroll'
					? t('The following users will be enrolled in the course')
					: t('The following users will be unenrolled from the course')}{' '}
				&quot;{course}&quot;
			</p>
			<ListGroup as="ol" numbered>
				{usernames.map((u) => (
					<ListGroup.Item as="li" key={u}>
						{u}
					</ListGroup.Item>
				))}
			</ListGroup>
		</>
	)
}

const EnrollStatuses: React.FC<{
	statuses: { st: string; status: string }[]
	course: string
	action: 'enroll' | 'unenroll'
}> = ({ statuses, course, action }) => {
	const { t } = useTranslation()

	return (
		<>
			<p>
				{action === 'enroll'
					? t('Enrolling users in the course')
					: t('Unenrolling users from the course')}{' '}
				&quot;{course}&quot;
			</p>
			<ListGroup as="ol" numbered>
				{statuses.map(({ st, status }) => (
					<ListGroup.Item as="li" key={st} className="enroll-status">
						<div className="username">{st}</div>
						<div className="status">{status}</div>
					</ListGroup.Item>
				))}
			</ListGroup>
		</>
	)
}

interface ModalProps {
	show: boolean
	setShow: (s: boolean) => void
	users: string | string[]
	course: string
	action: 'enroll' | 'unenroll'
}

const EnrollModal: React.FC<ModalProps> = ({
	show,
	setShow,
	users,
	course,
	action
}) => {
	if (!show) return <></>
	const { t } = useTranslation()
	const [state, setState] = useState<'confirm' | 'enroll' | 'complete'>(
		'confirm'
	)

	const handleClose = () => setShow(false)
	const usernames =
		users instanceof Array
			? users
			: Array.from(
					users
						.split(',')
						.map((el) => el.trim())
						.filter((el) => el.length > 0)
						.reduce((prev, cur) => prev.add(cur), new Set<string>())
			  )

	const [statuses, setStatuses] = useState<{ st: string; status: string }[]>(
		usernames.map((st) => ({ st, status: t('Pending') }))
	)

	useEffect(() => {
		if (state !== 'enroll') {
			return
		}

		Promise.all(
			usernames.map((username) => {
				;(action === 'enroll' ? addStudent : removeStudent)({
					username,
					course
				}).then((res) => {
					if (isLeft(res)) {
						setStatuses((statuses) =>
							statuses.map((el) =>
								el.st === username ? { st: username, status: t('Error') } : el
							)
						)
					} else {
						setStatuses((statuses) =>
							statuses.map((el) =>
								el.st === username
									? { st: username, status: t(res.right.status) }
									: el
							)
						)
					}
				})
			})
		).then(() => setState('complete'))
	}, [state])

	return (
		<Modal
			show={show}
			{...{ onHide: state === 'enroll' ? undefined : handleClose }}>
			<Modal.Header closeButton>
				<Modal.Title>
					{action === 'enroll'
						? t('Enrolling students')
						: t('Unenrolling students')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{state === 'confirm' && (
					<EnrollConfirmationInfo {...{ course, usernames, action }} />
				)}
				{(state === 'enroll' || state === 'complete') && (
					<EnrollStatuses {...{ statuses, course, action }} />
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant={
						action === 'unenroll' && state === 'confirm' ? 'danger' : 'primary'
					}
					onClick={() =>
						state === 'complete' ? handleClose() : setState('enroll')
					}
					disabled={state === 'enroll'}>
					{state === 'complete' ? t('Continue') : t('Confirm')}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

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
						controlId="course"
						label={t('Course')}
						{...{ register, watch }}
					/>
					<Form.Label>{t('Enter usernames separated by comma')}</Form.Label>
					<InputGroup>
						<Form.Control
							aria-label={t('Enter usernames separated by comma').toString()}
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
			<EnrollModal
				users={usernames}
				course={course}
				show={showEnroll}
				setShow={setShowEnroll}
				action="enroll"
			/>
			{students && <UnenrollList {...{ students, course }} />}
		</Container>
	)
}

export default StudentsListManagement
