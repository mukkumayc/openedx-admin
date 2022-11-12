import { isLeft } from 'fp-ts/lib/Either'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Spinner from '../components/Spinner'
import { getCourses } from '../requests'

interface FormInput {
	username: string
}

const GetCourses: React.FC = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		formState: { isSubmitted }
	} = useForm<FormInput>()
	const [loading, setLoading] = useState(false)
	const [courses, setCourses] = useState<string[]>([])
	const onSubmit: SubmitHandler<FormInput> = async (values) => {
		setLoading(true)
		const res = await getCourses(values)
		if (isLeft(res)) {
			return navigate('/error')
		}
		setCourses(res.right.courses)
		setLoading(false)
	}

	return (
		<main className="page">
			<section className="add-student container-md">
				<div className="card">
					<h1 className="card-header">{t('List of student courses')}</h1>
					<div className="card-body">
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
							<button className="btn btn-primary" type="submit">
								{t('Submit')}
							</button>
						</form>
					</div>
				</div>
			</section>
			<section className="results container-md">
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
							{t("User didn't enrolled in any courses")}
						</Alert>
					))
				)}
			</section>
		</main>
	)
}

export default GetCourses
