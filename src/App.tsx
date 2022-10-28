import { useEffect, useState } from 'react'

import { useAuth } from './AuthenticationContext'
import requestsWrapper from './RequestsWrapper'
import NavBar from './components/NavBar'
import Routes from './components/Routes'
import { loginAPIEndpoint as edxEndpoint } from './config'
import LoadingPage from './containers/LoadingPage'

const App = () => {
	const [, setAuthenticated] = useAuth()
	const [isAuthenticating, setAuthenticating] = useState(true)

	useEffect(() => {
		setAuthenticated(true)
		setAuthenticating(false)
		requestsWrapper.isAuthenticated().then((authenticated) => {
			setAuthenticated(authenticated)
			setAuthenticating(false)
			if (!authenticated) {
				window.location.href = `${edxEndpoint}/login`
			}
		})
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
