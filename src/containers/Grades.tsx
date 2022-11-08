import { fold } from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import { useCallback, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Spinner from '../components/Spinner'
import { gradesForCourse, gradesForStudent } from '../requests'
import { ICourseGrades } from '../types'
import './Grades.css'

interface FormInput {
	courseName: string
	specifyUser: boolean
	username: string
}

const ParsedCourse = ({ course }: { course: ICourseGrades }) => {
	const { t } = useTranslation()
	return (
		<Alert key={course.username}>
			<div>{course.username}</div>
			<hr />
			<div>
				{course.section_breakdown.length > 0 ? (
					<div>
						{course.section_breakdown.map((grade, i) => (
							<div key={i} className="d-flex justify-content-between">
								<div>{grade.subsection_name}</div>
								<div>{Math.round(grade.percent * 100)}%</div>
							</div>
						))}
					</div>
				) : (
					<div className="font-weight-bold">{t('No grades')}</div>
				)}
			</div>
		</Alert>
	)
}

const Grades = () => {
	const { t } = useTranslation()
	const [requestCompleted, setRequestCompleted] = useState(false)
	const [courses, setCourses] = useState<ICourseGrades[]>([])
	const [errorMsg, setErrorMsg] = useState('')
	const [loading, setLoading] = useState(false)
	const {
		register,
		handleSubmit,
		watch,
		formState: { isSubmitting }
	} = useForm<FormInput>()
	const watchSpecifyUser = watch('specifyUser', false)

	const onSubmit: SubmitHandler<FormInput> = async ({
		specifyUser,
		courseName,
		username
	}) => {
		setRequestCompleted(false)
		setLoading(true)
		setErrorMsg('')

		const res = await (specifyUser
			? gradesForStudent(username, courseName)
			: gradesForCourse(courseName))

		fold(flow(t, setErrorMsg), setCourses)(res)

		setRequestCompleted(true)
		setLoading(false)
	}

	const FormattedCourses = useCallback(() => {
		const { t } = useTranslation()
		return (
			<div className="users-list">
				{requestCompleted &&
					(errorMsg.length > 0 ? (
						<div className="alert alert-danger">{errorMsg}</div>
					) : courses.length > 0 ? (
						courses.map((course, ind) => (
							<ParsedCourse key={ind} {...{ course }} />
						))
					) : (
						<div className="alert alert-warning">
							{watchSpecifyUser
								? t("This student isn't enrolled in the course")
								: t('This course has no students')}
						</div>
					))}
			</div>
		)
	}, [requestCompleted, errorMsg, courses])

	return (
		<>
			<section className="page grades">
				<div className="container-md">
					<div className="card">
						<h1 className="card-header">{t('Course users and grades')}</h1>
						<form
							className="card-body grades__form"
							onSubmit={handleSubmit(onSubmit)}>
							<label className="form-label" htmlFor="courseName">
								{t('Course')}
							</label>
							<input
								className="form-control"
								id="courseName"
								{...register('courseName')}
								required
							/>
							<div className="form-check">
								<input
									className="form-check-input"
									id="specifyUser"
									{...register('specifyUser')}
									type="checkbox"
								/>
								<label className="form-check-label" htmlFor="specifyUser">
									{t('Specify user')}
								</label>
							</div>
							{watchSpecifyUser && (
								<>
									<label htmlFor="username">{t('Username')}</label>
									<input
										className="form-control"
										id="username"
										{...register('username')}
										disabled={!watchSpecifyUser}
										required={watchSpecifyUser}
									/>
								</>
							)}
							<button
								type="submit"
								className="btn btn-primary"
								disabled={isSubmitting}>
								{t('Get grades')}
							</button>
						</form>
					</div>
				</div>
			</section>
			<section className="result">
				<div className="container-md">
					{loading ? <Spinner /> : <FormattedCourses />}
				</div>
			</section>
		</>
	)
}

export default Grades
