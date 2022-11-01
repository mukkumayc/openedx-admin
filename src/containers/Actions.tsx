import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { adminRoomUrl } from '../config'

const Actions: React.FC = () => {
	const { t } = useTranslation()
	const paths: { header: string; path: string }[] = [
		{ header: t('Get a list of student grades'), path: '/grades' },
		{ header: t('Get a list of students'), path: '/students-list' },
		{ header: t('Enroll a student in a course'), path: '/course/students/add' },
		{
			header: t('Unenroll a student from a course'),
			path: '/course/students/remove'
		},
		{ header: t('Get list of student courses'), path: '/student/courses' },
		{
			header: t("Get a list of student's files in a course"),
			path: '/student/files'
		}
	]

	return (
		<section className="actions container-md">
			{paths.map(({ header, path }) => (
				<Link className="action" to={path} key={path}>
					{header}
				</Link>
			))}
			<a
				className="action"
				href={`${adminRoomUrl}/upload_registration_file/`}
				target="_blank"
				rel="noopener noreferrer">
				{t('Register new users')}
			</a>
		</section>
	)
}

export default Actions
