import { useState } from 'react'
import { Alert, Button, Card, Spinner, Table } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import requestsWrapper from '../../RequestsWrapper'
import AddUserModal from './AddUserModal'

interface FormInput {
	course: string
}

const StudentsList: React.FC = () => {
	const { t } = useTranslation()
	const [students, setStudents] = useState<string[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [addingUser, setAddingUser] = useState(false)
	const { register, handleSubmit, getValues } = useForm<FormInput>()

	const onSubmit: SubmitHandler<FormInput> = async ({ course }) => {
		setLoading(true)
		const res = await requestsWrapper.getStudents(course)
		if (res._tag === 'Right') {
			setStudents(res.right.students)
		} else {
			console.error(res.left)
			alert(res.left.toString())
		}
		setLoading(false)
	}

	return (
		<div id="users-list" className="page container-md">
			<Card>
				<h1 className="card-header">
					{t(
						'Write course name and select to "List students" or to "Add a student"'
					)}
				</h1>
				<Card.Body>
					<form onSubmit={handleSubmit(onSubmit)}>
						<input className="form-control" {...register('course')} />
						<div className="d-flex justify-content-between">
							<Button type="submit">{t('List students')}</Button>
							<Button variant="success" onClick={() => setAddingUser(true)}>
								{t('Add a student')}
							</Button>
						</div>
					</form>
				</Card.Body>
			</Card>
			{loading ? (
				<div className="spinner-loader-wrapper d-flex justify-content-center">
					<Spinner className="spinner-loader" animation="border" role="status">
						<span className="visually-hidden">{t('Loading')}...</span>
					</Spinner>
				</div>
			) : (
				<section className="page">
					{students !== null &&
						(students.length > 0 ? (
							<Table bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>{t('Username')}</th>
									</tr>
								</thead>
								<tbody>
									{students.map((v, i) => (
										<tr key={i}>
											<td>{i}</td>
											<td>{v}</td>
											<td>
												<Button
													variant="danger"
													onClick={() => {
														requestsWrapper
															.removeStudent(v, getValues().course)
															.then((res) => {
																if (res._tag === 'Right') {
																	alert(
																		`${res.right.status}: ${res.right.message}`
																	)
																} else {
																	alert(res.left.toString())
																}
															})
													}}>
													{t('Delete')}
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						) : (
							<Alert variant="warning">
								{t('Nobody enrolled in this course')}
							</Alert>
						))}
				</section>
			)}
			<AddUserModal
				show={addingUser}
				setShow={setAddingUser}
				courseName={getValues().course}
			/>
		</div>
	)
}

export default StudentsList
