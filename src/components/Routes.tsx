import { Route, Routes as Switch } from 'react-router-dom'

import { useAuth } from '../AuthenticationContext'
import AddRemoveStudent from '../containers/AddRemoveStudent'
import Error from '../containers/Error'
import FileLinks from '../containers/FileLinks'
import GetCourses from '../containers/GetCourses'
import Grades from '../containers/Grades'
// import Hello from '../containers/Hello'
import Home from '../containers/Home'
import Login from '../containers/Login'
import NotFound from '../containers/NotFound'
import Success from '../containers/Success'
// import ProctoringLinks from '../containers/ProctoringLinks'
// import Registration2 from '../containers/Registration2'
import StudentsList from '../containers/courses/StudentsList'
import AuthenticatedRoute from './AuthenticatedRoute'
import UnauthenticatedRoute from './UnauthenticatedRoute'

const authenticatedRoutes: [string, React.FC][] = [
	['/', Home],
	// ['/hello', Hello],
	['/grades', Grades],
	['/students-list', StudentsList],
	// ['/proctoring-links', ProctoringLinks],
	// ['/registration2', Registration2],
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
							redirectPath="/login">
							{route[1]({})}
						</AuthenticatedRoute>
					}
				/>
			))}
			<Route
				path="/login"
				element={
					<UnauthenticatedRoute
						isAuthenticated={isAuthenticated}
						redirectPath="/">
						<Login />
					</UnauthenticatedRoute>
				}
			/>
			<Route
				path="/course/students/:action"
				element={
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						redirectPath="/">
						<AddRemoveStudent />
					</AuthenticatedRoute>
				}
			/>
			<Route
				path="/student/courses"
				element={
					<AuthenticatedRoute
						isAuthenticated={isAuthenticated}
						redirectPath="/">
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
