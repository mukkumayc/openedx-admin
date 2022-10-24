import { Route, Routes as Switch } from 'react-router-dom'

import FileLinks from '../containers/FileLinks'
import Grades from '../containers/Grades'
import Hello from '../containers/Hello'
import Home from '../containers/Home'
import Login from '../containers/Login'
import NotFound from '../containers/NotFound'
import ProctoringLinks from '../containers/ProctoringLinks'
import Registration2 from '../containers/Registration2'
import StudentsList from '../containers/courses/StudentsList'
import { AppProps } from '../types'
import AuthenticatedRoute from './AuthenticatedRoute'
import UnauthenticatedRoute from './UnauthenticatedRoute'

interface RoutesProps {
	appProps: AppProps
}

const authenticatedRoutes: [string, (props: AppProps) => JSX.Element][] = [
	['/', Home],
	['/hello', Hello],
	['/grades', Grades],
	['/proctoring-links', ProctoringLinks],
	['/registration2', Registration2],
	['/students-list', StudentsList],
	['/files', FileLinks]
]

const Routes = ({ appProps }: RoutesProps) => (
	<Switch>
		{authenticatedRoutes.map((route) => (
			<Route
				key={route[0]}
				path={route[0]}
				element={
					<AuthenticatedRoute
						isAuthenticated={appProps.isAuthenticated}
						redirectPath="/login">
						{route[1](appProps)}
					</AuthenticatedRoute>
				}
			/>
		))}
		<Route
			path="/login"
			element={
				<UnauthenticatedRoute
					isAuthenticated={appProps.isAuthenticated}
					redirectPath="/">
					<Login {...appProps} />
				</UnauthenticatedRoute>
			}
		/>
		<Route element={<NotFound />} />
	</Switch>
)

export default Routes
