import { Route, Routes as Switch } from 'react-router-dom'

import { useAuth } from '../AuthenticationContext'
import FileLinks from '../containers/FileLinks'
import Grades from '../containers/Grades'
import Hello from '../containers/Hello'
import Home from '../containers/Home'
import Login from '../containers/Login'
import NotFound from '../containers/NotFound'
import ProctoringLinks from '../containers/ProctoringLinks'
import Registration2 from '../containers/Registration2'
import StudentsList from '../containers/courses/StudentsList'
import AuthenticatedRoute from './AuthenticatedRoute'
import UnauthenticatedRoute from './UnauthenticatedRoute'

const authenticatedRoutes: [string, React.FC][] = [
	['/', Home],
	['/hello', Hello],
	['/grades', Grades],
	['/proctoring-links', ProctoringLinks],
	['/registration2', Registration2],
	['/students-list', StudentsList],
	['/files', FileLinks]
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
			<Route element={<NotFound />} />
		</Switch>
	)
}

export default Routes
