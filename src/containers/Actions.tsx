import pages from '@/pages'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { adminRoomUrl } from '../config'

const Actions: React.FC = () => {
	const { t } = useTranslation()

	return (
		<section className="actions container-md">
			{pages.map(
				({ description, path, hideInActions }) =>
					!hideInActions && (
						<Link className="action" to={path} key={path}>
							{t(description)}
						</Link>
					)
			)}
			<a
				className="action"
				href={`${adminRoomUrl}/upload_registration_file/`}
				target="_blank"
				rel="noopener noreferrer">
				{t('Register new users')}
			</a>
		</section>
	)
}

export default Actions
