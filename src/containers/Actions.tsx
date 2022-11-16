import pages from '@/pages'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { adminRoomUrl } from '../config'

const Actions: React.FC = () => {
	const { t } = useTranslation()

	return (
		<section className="actions container-md my-3">
			{pages.map(
				({ description, path, hideInActions }) =>
					!hideInActions && (
						<Button
							variant="outline-primary"
							as={Link}
							className="action"
							to={path}
							key={path}>
							{t(description)}
						</Button>
					)
			)}
			<Button
				variant="outline-primary"
				as="a"
				className="action"
				href={`${adminRoomUrl}/upload_registration_file/`}
				target="_blank"
				rel="noopener noreferrer">
				{t('New users registration')}
			</Button>
		</section>
	)
}

export default Actions
