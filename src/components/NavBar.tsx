import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import RussiaFlag from '../assets/russia-flag-icon.svg'
import USAFlag from '../assets/united-states-flag-icon.svg'

interface Props {
	isAuthenticating: boolean
}

const NavBar: React.FC<Props> = () => {
	const location = useLocation()
	const { t, i18n } = useTranslation()
	return (
		<div className="container-md">
			<nav className="navbar">
				<Link className="navbar-brand" to="/">
					{location.pathname === '/' || location.pathname === '/login'
						? 'Open edX Admin'
						: `<- ${t('Back to Home')}`}
				</Link>
				<div className="locale-choice" role="list">
					<button
						className="locale"
						onClick={() => i18n.changeLanguage('ru')}
						role="listitem">
						<img
							className="locale-image"
							src={RussiaFlag}
							alt="Изменить язык на русский"
						/>
					</button>
					<button
						className="locale"
						onClick={() => i18n.changeLanguage('en')}
						role="listitem">
						<img
							className="locale-image"
							src={USAFlag}
							alt="Change language to english"
						/>
					</button>
				</div>
			</nav>
		</div>
	)
}

export default NavBar
