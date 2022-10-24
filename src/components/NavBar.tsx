import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { useAuth } from '../AuthenticationContext'
import { adminAPIEndpoint } from '../config'

interface NavBarProps {
	isAuthenticating: boolean
}

const NavBar = ({ isAuthenticating }: NavBarProps) => {
	const [isAuthenticated] = useAuth()
	return (
		<Navbar variant="dark" bg="dark" expand="md">
			<Nav>
				<Link className="navbar-brand" to="/">
					Open edX Admin
				</Link>
				{!isAuthenticating && (
					<CollapseController>
						{isAuthenticated ? (
							<>
								{/* <div className="nav-item">
                <Link className="nav-link" to="/proctoring-links">
                  Proctoring links
                </Link>
              </div> */}
								<div className="nav-item">
									<a
										className="nav-link"
										href={`${adminAPIEndpoint}/upload_registration_file/`}
										target="_blank"
										rel="noopener noreferrer">
										Register new users
									</a>
								</div>
								<div className="nav-item">
									<Link className="nav-link" to="/registration2">
										Register new users(form)
									</Link>
								</div>
								<div className="nav-item">
									<Link className="nav-link" to="/grades">
										Grades
									</Link>
								</div>
								<div className="nav-item">
									<Link className="nav-link" to="/files">
										Files
									</Link>
								</div>
								{/* <div className="nav-item">
                <Link className="nav-link" to="/students-list">
                  Students list
                </Link>
              </div> */}
							</>
						) : (
							<>
								<div className="nav-item">
									<Link className="nav-link" to="/login">
										Login
									</Link>
								</div>
							</>
						)}
					</CollapseController>
				)}
			</Nav>
		</Navbar>
	)
}

interface CollapseControllerProps {
	children: JSX.Element
}

const CollapseController = (props: CollapseControllerProps) => {
	return (
		<>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">{props.children}</ul>
			</div>
		</>
	)
}

export default NavBar
