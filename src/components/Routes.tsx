import { Route, Routes as Switch } from 'react-router-dom'

import { edxUrl } from '@/config'
import NotFound from '@/containers/NotFound'
import { useAuth } from '@/entities/auth'
import pages from '@/pages'

import AuthenticatedRoute from './AuthenticatedRoute'

const Routes: React.FC = () => {
	const [isAuthenticated] = useAuth()
	const routeProps = { isAuthenticated, redirectUrl: `${edxUrl}/login` }
	return (
		<Switch>
			{pages.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={
						<AuthenticatedRoute {...routeProps}>
							{route.component({})}
						</AuthenticatedRoute>
					}
				/>
			))}
			<Route path="*" element={<NotFound />} />
		</Switch>
	)
}

export default Routes
