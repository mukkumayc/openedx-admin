import MessageModal, { useModal } from '@/components/MessageModal'
import { isLeft } from 'fp-ts/lib/Either'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Spinner from '../components/Spinner'
import { getCourses } from '../requests'

interface FormInput {
	username: string
}

const GetCourses: React.FC = () => {
	const { t } = useTranslation()
	const [modalProps, showModal] = useModal()
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, isSubmitted }
	} = useForm<FormInput>()

	const [status, setStatus] = useState<{
		status: 'idle' | 'success' | 'error'
		courses: string[]
	}>({
		status: 'idle',
		courses: []
	})

	const onSubmit: SubmitHandler<FormInput> = async (values) => {
		const res = await getCourses(values)
		if (isLeft(res)) {
			setStatus({ status: 'error', courses: [] })
			return showModal(
				t('Error'),
				t('Unknown server error, probably some parameters not found')
			)
		}
		setStatus({
			status: 'success',
			courses: res.right.courses
		})
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
				{isSubmitting ? (
					<Spinner />
				) : (
					isSubmitted &&
					status.status === 'success' &&
					(status.courses.length > 0 ? (
						<Alert>
							<ul>
								{status.courses.map((c) => (
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
			<MessageModal {...modalProps} />
		</main>
	)
}

export default GetCourses
