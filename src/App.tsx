import { useEffect, useState } from 'react'

import { useAuth } from './AuthenticationContext'
import requestsWrapper from './RequestsWrapper'
import NavBar from './components/NavBar'
import Routes from './components/Routes'
import LoadingPage from './containers/LoadingPage'

const App = () => {
	const [, setAuthenticated] = useAuth()
	const [isAuthenticating, setAuthenticating] = useState(true)

	useEffect(() => {
		setAuthenticating(true)
		if (import.meta.env.VITE_AUTHENTICATION !== 'disabled') {
			requestsWrapper
				.isAuthenticated()
				.then(setAuthenticated)
				.then(() => setAuthenticating(false))
		} else {
			setAuthenticated(true)
			setAuthenticating(false)
		}
	}, [])

	return (
		<>
			<div className="App">
				<NavBar {...{ isAuthenticating }} />
				{isAuthenticating ? <LoadingPage /> : <Routes />}
			</div>
		</>
	)
}

export default App
