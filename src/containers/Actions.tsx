import { Link } from 'react-router-dom'

const paths: { header: string; path: string }[] = [
	{ header: 'Get a list of student grades', path: '/grades' },
	{ header: 'Get a list of students', path: '/students-list' },
	{ header: 'Enroll a student in a course', path: '/course/students/add' },
	{
		header: 'Unenroll a student from a course',
		path: '/course/students/remove'
	},
	{ header: 'Get student courses', path: '/student/courses' },
	{
		header: 'Get a list of files for a student in course',
		path: '/student/files'
	}
]

const Actions: React.FC = () => {
	return (
		<section className="actions container-md">
			{paths.map(({ header, path }) => (
				<Link className="action" to={path} key={path}>
					{header}
				</Link>
			))}
			<a
				className="action"
				href={
					'https://agymcourses.spbu.ru/admin_room/v1/upload_registration_file/'
				}
				target="_blank"
				rel="noopener noreferrer">
				Register new users
			</a>
		</section>
	)
}

export default Actions
