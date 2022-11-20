import { withProviders } from '@/app/providers'
import NavBar from '@/components/NavBar'
import LoadingPage from '@/containers/LoadingPage'
import { useAuthStartup } from '@/entities/auth'
import Routes from '@/pages'

import './index.scss'

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
