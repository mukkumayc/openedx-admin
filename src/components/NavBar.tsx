import { Link, useLocation } from 'react-router-dom'

interface Props {
	isAuthenticating: boolean
}

const NavBar: React.FC<Props> = () => {
	const location = useLocation()
	return (
		<div className="container-md">
			<nav className="navbar">
				{
					<Link className="navbar-brand" to="/">
						{location.pathname === '/' || location.pathname === '/login'
							? 'Open edX Admin'
							: '<- Back to Home'}
					</Link>
				}
			</nav>
		</div>
	)
}

export default NavBar
