import { Route, Routes as Switch } from 'react-router-dom'

import { useAuth } from '../AuthenticationContext'
import { loginAPIEndpoint } from '../config'
import AddRemoveStudent from '../containers/AddRemoveStudent'
import Error from '../containers/Error'
import FileLinks from '../containers/FileLinks'
import GetCourses from '../containers/GetCourses'
import Grades from '../containers/Grades'
import Home from '../containers/Home'
import NotFound from '../containers/NotFound'
import Success from '../containers/Success'
import StudentsList from '../containers/courses/StudentsList'
import AuthenticatedRoute from './AuthenticatedRoute'

const authenticatedRoutes: [string, React.FC][] = [
	['/', Home],
	['/grades', Grades],
	['/students-list', StudentsList],
	['/student/files', FileLinks]
]

const Routes: React.FC = () => {
	const [isAuthenticated] = useAuth()
	return (
		<Switch>
			{authenticatedRoutes.map((route) => (
				<Route
					key={route[0]}
					path={route[0]}
					element={
						<AuthenticatedRoute
							isAuthenticated={isAuthenticated}
							redirectUrl={`${loginAPIEndpoint}/login`}>
							{route[1]({})}
						</AuthenticatedRoute>
					}
				/>
			))}
			<Route
				path="/course/students/:action"
				element={
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						redirectUrl={`${loginAPIEndpoint}/login`}>
						<AddRemoveStudent />
					</AuthenticatedRoute>
				}
			/>
			<Route
				path="/student/courses"
				element={
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						redirectUrl={`${loginAPIEndpoint}/login`}>
						<GetCourses />
					</AuthenticatedRoute>
				}
			/>
			<Route path="/error" element={<Error />} />
			<Route path="/success" element={<Success />} />
			<Route path="*" element={<NotFound />} />
		</Switch>
	)
}

export default Routes
