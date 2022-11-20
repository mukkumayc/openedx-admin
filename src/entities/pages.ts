import ActivateCourse from '@/containers/ActivateCourse'
import AddRemoveStudent from '@/containers/AddRemoveStudent'
import ChangePassword from '@/containers/ChangePassword/ChangePassword'
import FileLinks from '@/containers/FileLinks'
import GetCourses from '@/containers/GetCourses'
import Grades from '@/containers/Grades'
import Home from '@/containers/Home'
import StudentsListManagement from '@/containers/courses/StudentListManagement'

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
		description: 'Course student list management',
		path: '/course/student-list-management',
		component: StudentsListManagement
	},
	{
		description: 'Enroll or unenroll a student',
		path: '/course/students/enrollment',
		component: AddRemoveStudent
	},
	{
		description: 'Get a list of student courses',
		path: '/student/courses',
		component: GetCourses
	},
	{
		description: 'Get a list of student files in a course',
		path: '/student/files',
		component: FileLinks
	},
	{
		description: 'Change user password',
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
