import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'

import { addStudent } from '../../requests'

interface Props {
	show: boolean
	setShow(b: boolean): void
	course: string
}

const AddUserModal: React.FC<Props> = ({ show, setShow, course }) => {
	const { t } = useTranslation()
	const [username, setUsername] = useState('')
	const [message, setMessage] = useState<{
		header: string
		message: string
	} | null>(null)
	const handleClose = () => setShow(false)
	return (
		<>
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>
						<Trans i18nKey="addingStudentToCourse" values={{ course }}>
							{'Adding a student to "{{courseName}}"'}
						</Trans>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{t('Enter username')}
					<Form.Control
						type="text"
						value={username}
						onChange={(event) =>
							setUsername(event.target.value)
						}></Form.Control>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						{t('Close')}
					</Button>
					<Button
						variant="primary"
						onClick={async () => {
							const res = await addStudent({ username, course })
							if (res._tag === 'Right') {
								setMessage({
									header:
										res.right.status === 'Error' ? t('Error') : t('Success'),
									message: t(res.right.message)
								})
							} else {
								setMessage({
									header: t('Error'),
									message: t(res.left.toString())
								})
							}
						}}>
						{t('Submit')}
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={message !== null}>
				<Modal.Header>
					<Modal.Title>{message?.header}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message?.message}</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setMessage(null)}>
						{t('Close')}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default AddUserModal
