import { isLeft } from 'fp-ts/lib/Either'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import requestsWrapper from '../RequestsWrapper'

interface FormInput {
	course: string
}

const GetCourseStudents: React.FC = () => {
	const navigate = useNavigate()
	const { register, handleSubmit } = useForm<FormInput>()
	const [loading, setLoading] = useState(false)
	const [courses, setCourses] = useState<string[]>([])
	const onSubmit: SubmitHandler<FormInput> = async ({ course }) => {
		setLoading(true)
		const res = await requestsWrapper.getCourses(username)
		if (isLeft(res)) {
			return navigate('/error')
		}
		setCourses(res.right.courses)
		setLoading(false)
	}

	return (
		<section className="add-student container-md">
			{loading ? (
				<Spinner />
			) : courses.length > 0 ? (
				<ul>
					{courses.map((c) => (
						<li key={c}>{c}</li>
					))}
				</ul>
			) : (
				<form className="add-student-form" onSubmit={handleSubmit(onSubmit)}>
					<label htmlFor="username">Username</label>
					<input id="username" {...register('username')} required />
					<button type="submit">Submit</button>
				</form>
			)}
		</section>
	)
}

export default GetCourseStudents
