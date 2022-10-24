import { Field, Form, Formik, FormikHelpers } from 'formik'
import { fold } from 'fp-ts/Either'
import { useCallback, useState } from 'react'
import { Alert, Form as BForm, Card, Container, Spinner } from 'react-bootstrap'

import requestsWrapper from '../RequestsWrapper'
import { ICourseGrades, courseNames } from '../types'
import './Grades.css'

interface FormValues {
	courseName: typeof courseNames[number] | ''
	allUsers: 'all' | 'notall'
	username: string
}

const ParsedCourse = ({ course }: { course: ICourseGrades }) => (
	<Alert key={course.username}>
		<div>{course.username}</div>
		<hr />
		<div>
			{course.section_breakdown.length > 0 ? (
				<div>
					{course.section_breakdown.map((grade) => (
						<div
							key={grade.subsection_name}
							className="d-flex justify-content-between">
							<div>{grade.subsection_name}</div>
							<div>{grade.percent}</div>
						</div>
					))}
				</div>
			) : (
				<div className="font-weight-bold">No grades</div>
			)}
		</div>
	</Alert>
)

const Grades = () => {
	const [requestCompleted, setRequestCompleted] = useState(false)
	const [courses, setCourses] = useState<ICourseGrades[]>([])
	const [errorMsg, setErrorMsg] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = useCallback(
		async (
			{ courseName, allUsers, username }: FormValues,
			{ setSubmitting }: FormikHelpers<FormValues>
		) => {
			setRequestCompleted(false)
			setLoading(true)
			setErrorMsg('')

			const res = await (allUsers === 'all'
				? requestsWrapper.gradesForCourse(courseName)
				: requestsWrapper.gradesForStudent(username, courseName))

			fold(setErrorMsg, setCourses)(res)

			setRequestCompleted(true)
			setSubmitting(false)
			setLoading(false)
		},
		[]
	)

	const FormattedCourses = useCallback(() => {
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
							There are no users for this course
						</div>
					))}
			</div>
		)
	}, [requestCompleted, errorMsg, courses])

	return (
		<Container className="grade page d-flex justify-content-center">
			<Formik
				initialValues={
					{
						courseName: '',
						allUsers: 'all',
						username: ''
					} as FormValues
				}
				onSubmit={handleSubmit}>
				{({ values, isSubmitting }) => (
					<main>
						<Card className="form-card">
							<Card.Header>
								<h4>Course users and grades</h4>
							</Card.Header>
							<Card.Body>
								<Form>
									<BForm.Group className="my-3">
										<label htmlFor="courseName">Select course</label>
										<Field
											className="form-select"
											as="select"
											name="courseName">
											<option value="" disabled>
												-- Select course --
											</option>
											{courseNames.map((name) => (
												<option key={name} value={name}>
													{name}
												</option>
											))}
										</Field>
									</BForm.Group>
									<BForm.Group className="my-3">
										<label className="me-3">
											<Field
												className="form-check-input me-1"
												type="radio"
												name="allUsers"
												value="all"
											/>
											All users
										</label>
										<label>
											<Field
												className="form-check-input me-1"
												type="radio"
												name="allUsers"
												value="notall"
											/>
											Specify user
										</label>
									</BForm.Group>
									<BForm.Group className="my-3">
										<label htmlFor="username">Enter email or username</label>
										<Field
											className="form-control"
											type="text"
											name="username"
											id="username"
											disabled={values.allUsers === 'all'}
										/>
									</BForm.Group>
									<button
										type="submit"
										className="btn btn-primary"
										disabled={isSubmitting}>
										Get grades
									</button>
								</Form>
							</Card.Body>
						</Card>
						{loading ? (
							<div className="d-flex justify-content-center m-3">
								<Spinner
									animation="border"
									role="status"
									style={{ width: '150px', height: '150px' }}>
									<span className="visually-hidden">Loading...</span>
								</Spinner>
							</div>
						) : (
							<FormattedCourses />
						)}
					</main>
				)}
			</Formik>
		</Container>
	)
}

export default Grades
