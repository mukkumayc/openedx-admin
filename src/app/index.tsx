import { useEffect, useState } from 'react'

import { useAuth } from '@/AuthenticationContext'
import NavBar from '@/components/NavBar'
import Routes from '@/components/Routes'
import LoadingPage from '@/containers/LoadingPage'
import { isAuthenticated } from '@/requests'

import './index.scss'

function authVerification() {
	const [, setAuthenticated] = useAuth()
	const [isAuthenticating, setAuthenticating] = useState(true)

	useEffect(() => {
		setAuthenticating(true)
		if (import.meta.env.VITE_AUTHENTICATION !== 'disabled') {
			isAuthenticated()
				.then(setAuthenticated)
				.then(() => setAuthenticating(false))
		} else {
			setAuthenticated(true)
			setAuthenticating(false)
		}
	}, [])

	return isAuthenticating
}

const App = () => {
	const isAuthenticating = authVerification()

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
