import { FC, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

import requestsWrapper from '../../RequestsWrapper'

interface Props {
	show: boolean
	setShow(b: boolean): void
	courseName: string
}

const AddUserModal: FC<Props> = ({ show, setShow, courseName }) => {
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
					<Modal.Title>Adding user to &quot;{courseName}&quot;</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Enter username
					<Form.Control
						type="text"
						value={username}
						onChange={(event) =>
							setUsername(event.target.value)
						}></Form.Control>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={async () => {
							const res = await requestsWrapper.addStudent(username, courseName)
							if (res._tag === 'Right') {
								setMessage({ header: 'Success', message: res.right })
							} else {
								setMessage({ header: 'Error', message: res.left.toString() })
							}
						}}>
						Add user
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
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default AddUserModal
