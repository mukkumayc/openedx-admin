import { withProviders } from '@/app/providers'
import NavBar from '@/components/NavBar'
import Routes from '@/components/Routes'
import LoadingPage from '@/containers/LoadingPage'

import './index.scss'
import { useAuthStartup } from './providers/with-auth'

const App = () => {
	const isAuthenticating = useAuthStartup()

	return (
		<>
			<div className="App">
				<NavBar {...{ isAuthenticating }} />
				{isAuthenticating ? <LoadingPage /> : <Routes />}
			</div>
		</>
	)
}

export default withProviders(App)
