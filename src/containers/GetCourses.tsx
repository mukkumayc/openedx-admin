import { isLeft } from 'fp-ts/lib/Either'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import requestsWrapper from '../RequestsWrapper'
import Spinner from '../components/Spinner'

interface FormInput {
	username: string
}

const GetCourses: React.FC = () => {
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		formState: { isSubmitted }
	} = useForm<FormInput>()
	const [loading, setLoading] = useState(false)
	const [courses, setCourses] = useState<string[]>([])
	const onSubmit: SubmitHandler<FormInput> = async ({ username }) => {
		setLoading(true)
		const res = await requestsWrapper.getCourses(username)
		if (isLeft(res)) {
			return navigate('/error')
		}
		setCourses(res.right.courses)
		setLoading(false)
	}

	return (
		<>
			<section className="add-student container-md page">
				<div className="card">
					<h1 className="card-header">List of student courses</h1>
					<main className="card-body">
						<form
							className="add-student-form"
							onSubmit={handleSubmit(onSubmit)}>
							<label htmlFor="username">Username</label>
							<input
								className="form-control"
								id="username"
								{...register('username')}
								required
							/>
							<button className="btn btn-primary" type="submit">
								Submit
							</button>
						</form>
					</main>
				</div>
			</section>
			<section className="results container-md page">
				{loading ? (
					<Spinner />
				) : (
					isSubmitted &&
					(courses.length > 0 ? (
						<Alert>
							<ul>
								{courses.map((c) => (
									<li key={c}>{c}</li>
								))}
							</ul>
						</Alert>
					) : (
						<Alert variant="warning">
							User didn&apos;t enrolled in any courses
						</Alert>
					))
				)}
			</section>
		</>
	)
}

export default GetCourses
