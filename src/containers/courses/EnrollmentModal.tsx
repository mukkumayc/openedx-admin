import { useEffect, useState } from 'react'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { addStudent, removeStudent } from '@/requests'
import { isLeft } from '@/utils'

const EnrollmentConfirmationInfo: React.FC<{
	course: string
	users: string[]
	action: 'enroll' | 'unenroll'
}> = ({ course, users, action }) => {
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
				{users.map((user) => (
					<ListGroup.Item as="li" key={user}>
						{user}
					</ListGroup.Item>
				))}
			</ListGroup>
		</>
	)
}

const EnrollStatuses: React.FC<{
	statuses: { user: string; status: string }[]
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
				{statuses.map(({ user, status }) => (
					<ListGroup.Item as="li" key={user} className="enroll-status">
						<div className="username">{user}</div>
						<div className="status">{status}</div>
					</ListGroup.Item>
				))}
			</ListGroup>
		</>
	)
}

const EnrollmentBody: React.FC<{
	users: string[]
	course: string
	action: 'enroll' | 'unenroll'
	handleClose: () => void
}> = ({ users, course, action, handleClose }) => {
	const { t } = useTranslation()

	const [state, setState] = useState<'confirm' | 'enroll' | 'complete'>(
		'confirm'
	)

	const [statuses, setStatuses] = useState<{ user: string; status: string }[]>(
		users.map((user) => ({ user, status: t('Pending') }))
	)

	useEffect(() => {
		if (state !== 'enroll') {
			return
		}

		Promise.all(
			users.map((user) =>
				(action === 'enroll' ? addStudent : removeStudent)({
					user,
					course
				}).then((res) => {
					if (isLeft(res)) {
						setStatuses((statuses) =>
							statuses.map((el) =>
								el.user === user ? { user, status: t('Error') } : el
							)
						)
					} else {
						setStatuses((statuses) =>
							statuses.map((el) =>
								el.user === user ? { user, status: t(res.right.status) } : el
							)
						)
					}
				})
			)
		).then(() => setState('complete'))
	}, [state])

	return (
		<>
			{state === 'confirm' && (
				<EnrollmentConfirmationInfo {...{ course, users, action }} />
			)}
			{(state === 'enroll' || state === 'complete') && (
				<EnrollStatuses {...{ statuses, course, action }} />
			)}
			<div className="enrollment-modal-buttons mt-3 d-flex justify-content-end">
				{state === 'confirm' ? (
					<>
						<Button variant="secondary" onClick={handleClose}>
							{t('Cancel')}
						</Button>
						<Button
							variant={action === 'unenroll' ? 'danger' : 'primary'}
							onClick={() => setState('enroll')}>
							{t('Confirm')}
						</Button>
					</>
				) : (
					<Button
						variant="primary"
						onClick={handleClose}
						disabled={state === 'enroll'}>
						{t('Continue')}
					</Button>
				)}
			</div>
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

const EnrollmentModal: React.FC<ModalProps> = ({
	show,
	setShow,
	users: usersInput,
	course,
	action
}) => {
	if (!show) return <></>
	const { t } = useTranslation()

	const handleClose = () => setShow(false)

	const users =
		usersInput instanceof Array
			? usersInput
			: Array.from(
					usersInput
						.split(',')
						.map((el) => el.trim())
						.filter((el) => el.length > 0)
						.reduce((prev, cur) => prev.add(cur), new Set<string>())
			  )

	return (
		<Modal show={show}>
			<Modal.Header>
				<Modal.Title>
					{action === 'enroll'
						? t('Enrolling students')
						: t('Unenrolling students')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<EnrollmentBody {...{ users, course, action, handleClose }} />
			</Modal.Body>
		</Modal>
	)
}

export default EnrollmentModal
