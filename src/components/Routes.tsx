import { Route, Routes as Switch } from 'react-router-dom'

import { useAuth } from '../AuthenticationContext'
import { edxUrl } from '../config'
import ActivateCourse from '../containers/ActivateCourse'
import AddRemoveStudent from '../containers/AddRemoveStudent'
import ChangePassword from '../containers/ChangePassword/ChangePassword'
import FileLinks from '../containers/FileLinks'
import GetCourses from '../containers/GetCourses'
import Grades from '../containers/Grades'
import Home from '../containers/Home'
import NotFound from '../containers/NotFound'
import StudentsList from '../containers/courses/StudentsList'
import AuthenticatedRoute from './AuthenticatedRoute'

const authenticatedRoutes: [string, React.FC][] = [
	['/', Home],
	['/grades', Grades],
	['/students-list', StudentsList],
	['/student/files', FileLinks],
	['/student/change-password', ChangePassword],
	['/course/activate', ActivateCourse]
]

const Routes: React.FC = () => {
	const [isAuthenticated] = useAuth()
	const routeProps = { isAuthenticated, redirectUrl: `${edxUrl}/login` }
	return (
		<Switch>
			{authenticatedRoutes.map((route) => (
				<Route
					key={route[0]}
					path={route[0]}
					element={
						<AuthenticatedRoute {...routeProps}>
							{route[1]({})}
						</AuthenticatedRoute>
					}
				/>
			))}
			<Route
				path="/course/students/:action"
				element={
					<AuthenticatedRoute {...routeProps}>
						<AddRemoveStudent />
					</AuthenticatedRoute>
				}
			/>
			<Route
				path="/student/courses"
				element={
					<AuthenticatedRoute {...routeProps}>
						<GetCourses />
					</AuthenticatedRoute>
				}
			/>
			<Route path="*" element={<NotFound />} />
		</Switch>
	)
}

export default Routes
