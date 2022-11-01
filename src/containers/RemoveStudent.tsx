import { isLeft } from 'fp-ts/lib/Either'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import requestsWrapper from '../RequestsWrapper'
import Spinner from '../components/Spinner'

interface FormInput {
	username: string
	course: string
}

const RemoveStudent: React.FC = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { register, handleSubmit } = useForm<FormInput>()
	const [loading, setLoading] = useState(false)
	const onSubmit: SubmitHandler<FormInput> = async ({ username, course }) => {
		setLoading(true)
		const res = await requestsWrapper.addStudent(username, course)
		if (isLeft(res)) {
			return navigate('/error')
		}
		const { status, message } = res.right

		if (status === 'Success') {
			return navigate(`/success?message=${message}`)
		}
		navigate(`/error?message=${message}`)
	}

	return (
		<section className="add-student container-md">
			{loading ? (
				<Spinner />
			) : (
				<form className="add-student-form" onSubmit={handleSubmit(onSubmit)}>
					<label htmlFor="username">{t('Username')}</label>
					<input id="username" {...register('username')} required />
					<label htmlFor="course">{t('Course')}</label>
					<input id="course" {...register('course')} required />
					<button className="btn btn-primary" type="submit">
						{t('Submit')}
					</button>
				</form>
			)}
		</section>
	)
}

export default RemoveStudent
