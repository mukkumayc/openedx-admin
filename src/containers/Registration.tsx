import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import { FC, useCallback, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import * as Yup from 'yup'

import { adminAPIEndpoint } from '../config'
import './Registration.css'

interface IUser {
	email: string
	username: string
	name: string
	surname: string
	password: string
}

const initialUser: IUser = {
	email: '',
	username: '',
	name: '',
	surname: '',
	password: ''
}

interface Props {
	isSubmitting: boolean
	setAuthenticated(b: boolean): void
}

const Registration: FC<Props> = (props: Props) => <UsersForm {...props} />

const UsersForm: FC<Props> = (props) => {
	const [statuses, setStatuses] = useState<any[]>([])

	const handleSubmit = useCallback(
		(values: { users: IUser[] }, setSubmitting: (b: boolean) => void) => {
			fetch(adminAPIEndpoint.concat('/massregister'), {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(values)
			})
				.then((res) => {
					if (res.ok) {
						return res.json()
					}
					if (res.status === 401) {
						props.setAuthenticated(false)
					}
					return res.json()
				})
				.then(({ statuses }) => {
					alert(JSON.stringify(statuses, null, 2))
					setStatuses(statuses)
					setSubmitting(false)
				})
				.catch((err) => {
					console.log(err)
					setSubmitting(false)
				})
		},
		[props]
	)

	return (
		<Container>
			<Formik
				initialValues={{
					users: [initialUser]
				}}
				onSubmit={(values, { setSubmitting }) =>
					handleSubmit(values, setSubmitting)
				}
				validationSchema={Yup.object().shape({
					users: Yup.array().of(
						Yup.object({
							email: Yup.string()
								.required('Required')
								.email('Wrong email format'),
							username: Yup.string().required('Required'),
							password: Yup.string().required('Required').min(8),
							first_name: Yup.string().required('Required'),
							second_name: Yup.string().required('Required')
						})
					)
				})}>
				{({ values, isSubmitting }) => (
					<Form>
						<FieldArray name="users">
							{({ push, remove }) => (
								<Container>
									<Row className="buttons-row d-flex justify-content-between">
										<Button type="submit" className="col-sm">
											Submit
										</Button>
										<Button
											className="col-sm"
											variant="success"
											onClick={() => push(initialUser)}>
											Add user
										</Button>
									</Row>

									<Row>
										{values.users?.map((_user, index) => (
											<UserForm
												key={index}
												{...{ isSubmitting, index }}
												remove={(index: number) => {
													const nStatuses = statuses.slice()
													nStatuses.splice(index, 1)
													console.log('statuses', nStatuses)
													setStatuses(nStatuses)
													remove(index)
												}}
												index={index}
												status={statuses[index]}
											/>
										))}
									</Row>
								</Container>
							)}
						</FieldArray>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

interface UserFormProps {
	isSubmitting: boolean
	index: number
	remove(ind: number): void
	status: any
}

const UserForm: FC<UserFormProps> = (props) => {
	const { isSubmitting, remove, index, status } = props
	const alertClass = status
		? status.status !== 'success'
			? 'alert-danger'
			: 'alert-success'
		: 'alert-secondary'
	return (
		<div className={'form-group alert '.concat(alertClass)}>
			<Row>
				<Col>
					<Field
						className="form-control"
						name={`users[${index}].email`}
						type="email"
						placeholder="email"
					/>
					<ErrorMessage name={`users[${index}].email`}>
						{(msg) => <small className="text-danger">{msg}</small>}
					</ErrorMessage>
				</Col>
				<Col>
					<Field
						className="form-control"
						name={`users[${index}].username`}
						type="text"
						placeholder="username"
					/>
					<ErrorMessage name={`users[${index}].username`}>
						{(msg) => <small className="text-danger">{msg}</small>}
					</ErrorMessage>
				</Col>
				<Col>
					<Field
						className="form-control"
						name={`users[${index}].password`}
						type="password"
						placeholder="password"
					/>
					<ErrorMessage name={`users[${index}].password`}>
						{(msg) => <small className="text-danger">{msg}</small>}
					</ErrorMessage>
				</Col>
				<div className="w-100"></div>
				<Col>
					<Field
						className="form-control"
						name={`users[${index}].first_name`}
						type="text"
						placeholder="first name"
					/>
					<ErrorMessage name={`users[${index}].first_name`}>
						{(msg) => <small className="text-danger">{msg}</small>}
					</ErrorMessage>
				</Col>
				<Col>
					<Field
						className="form-control"
						name={`users[${index}].second_name`}
						type="text"
						placeholder="last name"
					/>
					<ErrorMessage name={`users[${index}].second_name`}>
						{(msg) => <small className="text-danger">{msg}</small>}
					</ErrorMessage>
				</Col>
				<Col>
					<Button
						type="button"
						className="form-control"
						variant="danger"
						disabled={isSubmitting}
						onClick={() => remove(index)}>
						Delete
					</Button>
				</Col>
			</Row>
			<Row>{status?.message && <div>{status.message}</div>}</Row>
		</div>
	)
}

export default Registration
