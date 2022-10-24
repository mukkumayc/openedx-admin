import { Field, Form, Formik, FormikHelpers } from 'formik'
import { useCallback, useState } from 'react'
import * as Yup from 'yup'

import { useAuth } from '../AuthenticationContext'
import { adminAPIEndpoint } from '../config'
import './Login.css'

interface FormValues {
	email: string
	password: string
}

const Login = () => {
	const [, setAuthenticated] = useAuth()
	const [errorMsg, setErrorMsg] = useState('')

	const handleSubmit = useCallback(
		(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
			fetch(adminAPIEndpoint + '/login', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({
					credentials: values
				})
			})
				.then((res) => {
					if (res.ok) {
						setAuthenticated(true)
					} else {
						res.json().then((json) => {
							setErrorMsg(json.error)
							setSubmitting(false)
						})
					}
				})
				.catch((err) => {
					setErrorMsg(err.toString())
					setSubmitting(false)
				})
		},
		[setAuthenticated]
	)

	return (
		<div className="login container">
			<Formik
				initialValues={{ email: '', password: '' }}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.required('Email is required')
						.email('Invalid email'),
					password: Yup.string().required('Password is required')
				})}
				onSubmit={handleSubmit}>
				{({ isSubmitting }) => (
					<Form>
						<div className="form-group">
							<label htmlFor="login-email">Email</label>
							<Field
								className="form-control"
								type="email"
								name="email"
								id="login-email"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="login-password">Password</label>
							<Field
								className="form-control"
								type="password"
								name="password"
								id="login-password"
							/>
						</div>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isSubmitting}>
							Sign in
						</button>
						{errorMsg ? (
							<div className="alert alert-danger m-3">{errorMsg}</div>
						) : null}
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default Login
