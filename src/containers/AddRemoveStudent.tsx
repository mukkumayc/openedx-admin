import { isLeft } from 'fp-ts/lib/Either'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import requestsWrapper from '../RequestsWrapper'
import Spinner from '../components/Spinner'

interface FormInput {
	username: string
	course: string
}

const AddRemoveStudent: React.FC = () => {
	const { action } = useParams()
	const { t } = useTranslation()

	const navigate = useNavigate()
	const { register, handleSubmit } = useForm<FormInput>()
	const [loading, setLoading] = useState(false)
	const onSubmit: SubmitHandler<FormInput> = async ({ username, course }) => {
		setLoading(true)
		const res =
			action === 'add'
				? await requestsWrapper.addStudent(username, course)
				: await requestsWrapper.removeStudent(username, course)
		if (isLeft(res)) {
			return navigate('/error')
		}
		const { status, message } = res.right

		if (status === t('Success')) {
			return navigate(`/success?message=${message}`)
		}
		navigate(`/error?message=${message}`)
	}

	return (
		<section className="add-student container-md page">
			{loading ? (
				<Spinner />
			) : (
				<div className="card">
					<h1 className="card-header">
						{action === 'add'
							? t('Enrolling a student in a course')
							: t('Unenrolling a student from a course')}
					</h1>
					<main className="card-body">
						<form
							className="add-student-form"
							onSubmit={handleSubmit(onSubmit)}>
							<label htmlFor="username">{t('Username')}</label>
							<input
								className="form-control"
								id="username"
								{...register('username')}
								required
							/>
							<label htmlFor="course">{t('Course')}</label>
							<input
								className="form-control"
								id="course"
								{...register('course')}
								required
							/>
							<button className="btn btn-primary" type="submit">
								{t('Submit')}
							</button>
						</form>
					</main>
				</div>
			)}
		</section>
	)
}

export default AddRemoveStudent
