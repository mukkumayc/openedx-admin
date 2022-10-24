import { useEffect, useState } from 'react'

import { useAuth } from './AuthenticationContext'
import requestsWrapper from './RequestsWrapper'
import MessageModal, { useModal } from './components/MessageModal'
import NavBar from './components/NavBar'
import Routes from './components/Routes'
import { loginAPIEndpoint as edxEndpoint } from './config'
import LoadingPage from './containers/LoadingPage'

const App = () => {
	const [isAuthenticated, setAuthenticated] = useAuth()
	const [isAuthenticating, setAuthenticating] = useState(true)

	const [modalProps] = useModal({
		header: <h4>You are not authenticated</h4>,
		body: (
			<p>
				You&apos;ll be redirected to{' '}
				<a href={`${edxEndpoint}/admin`}>login page</a> soon...
			</p>
		)
	})

	useEffect(() => {
		requestsWrapper.isAuthenticated().then((authenticated) => {
			setAuthenticated(authenticated)
			setAuthenticating(false)
			if (!authenticated) {
				setTimeout(() => (window.location.href = `${edxEndpoint}/login`), 2000)
			}
		})
	}, [])

	return (
		<>
			<div className="App">
				<NavBar {...{ isAuthenticating }} />
				{isAuthenticating ? <LoadingPage /> : <Routes />}
				{!isAuthenticating && !isAuthenticated && (
					<MessageModal {...modalProps} />
				)}
			</div>
		</>
	)
}

export default App
