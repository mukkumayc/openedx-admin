import { useEffect, useState } from 'react'

import { useAuth } from './AuthenticationContext'
import requestsWrapper from './RequestsWrapper'
import MessageModal, {
	Props as MessageModalProps
} from './components/MessageModal'
import NavBar from './components/NavBar'
import Routes from './components/Routes'
import { loginAPIEndpoint as edxEndpoint } from './config'
import LoadingPage from './containers/LoadingPage'
import { AppProps } from './types'
import { curry2 } from './utils'

const App = () => {
	const [isAuthenticated, setAuthenticated] = useAuth()
	const [isAuthenticating, setAuthenticating] = useState(true)
	const [message, setMessage] = useState<Omit<MessageModalProps, 'setShow'>>({
		show: false,
		header: '',
		body: ''
	})
	const showMessage = curry2(
		(header: MessageModalProps['header'], body: MessageModalProps['body']) =>
			setMessage({ show: true, header, body })
	)

	const setShow = (show: boolean) => {
		setMessage({ ...message, show })
	}

	const appProps: AppProps = {
		showMessage
	}

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
				<NavBar {...{ appProps, isAuthenticating }} />
				{isAuthenticating ? <LoadingPage /> : <Routes appProps={appProps} />}
				{!isAuthenticating && !isAuthenticated && (
					<MessageModal
						show={message.show}
						setShow={setShow}
						header={<h4>You are not authenticated</h4>}
						showButtons={false}
						body={
							<p>
								You&apos;ll be redirected to{' '}
								<a href={`${edxEndpoint}/admin`}>login page</a> soon...
							</p>
						}
					/>
				)}
				<MessageModal {...{ ...message, setShow }} />
			</div>
		</>
	)
}

export default App
