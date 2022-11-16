import { FormTemplateWithResult } from '@/components/form'
import { Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { gradesForCourse, gradesForStudent } from '../requests'
import { CourseGrades } from '../types'
import './Grades.css'

interface FormInput {
	course: string
	specifyUser: boolean
	username: string
}

const ParsedCourse = ({ course }: { course: CourseGrades }) => {
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

const Grades: React.FC = () => {
	const { t } = useTranslation()

	const handler = ({ specifyUser, course, username }: FormInput) =>
		specifyUser
			? gradesForStudent({ username, course })
			: gradesForCourse({ course })

	const parseResponse = (courses: CourseGrades[]) => {
		return (
			<div className="users-list">
				{courses.length > 0 ? (
					courses.map((course, ind) => (
						<ParsedCourse key={ind} {...{ course }} />
					))
				) : (
					<div className="alert alert-warning">{t("Grades wasn't found")}</div>
				)}
			</div>
		)
	}

	return (
		<FormTemplateWithResult
			header={t('Course users and grades')}
			fields={[
				{ controlId: 'course', label: t('Course') },
				{
					controlId: 'specifyUser',
					label: t('Specify user'),
					type: 'checkbox'
				},
				{
					controlId: 'username',
					label: t('Username'),
					optional: 'specifyUser'
				}
			]}
			submitBtnText={t('Get grades')}
			{...{ handler, parseResponse }}
		/>
	)
}

export default Grades
