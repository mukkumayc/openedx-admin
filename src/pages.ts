import ActivateCourse from './containers/ActivateCourse'
import AddRemoveStudent from './containers/AddRemoveStudent'
import ChangePassword from './containers/ChangePassword/ChangePassword'
import FileLinks from './containers/FileLinks'
import GetCourses from './containers/GetCourses'
import Grades from './containers/Grades'
import Home from './containers/Home'
import StudentsList from './containers/courses/StudentsList'

const pages = [
	{
		description: 'Home page',
		path: '/',
		component: Home,
		hideInActions: true
	},
	{
		description: 'Get a list of student grades',
		path: '/grades',
		component: Grades
	},
	{
		description: 'Get a list of students',
		path: '/students-list',
		component: StudentsList
	},
	{
		description: 'Enroll a student in a course',
		path: '/course/students/add',
		component: AddRemoveStudent
	},
	{
		description: 'Unenroll a student from a course',
		path: '/course/students/remove',
		component: AddRemoveStudent
	},
	{
		description: "Get a list of student's courses",
		path: '/student/courses',
		component: GetCourses
	},
	{
		description: "Get a list of student's files in a course",
		path: '/student/files',
		component: FileLinks
	},
	{
		description: "Change user's password",
		path: '/student/change-password',
		component: ChangePassword
	},
	{
		description: 'Activate course',
		path: '/course/activate',
		component: ActivateCourse
	}
]

export default pages
