import { FormTemplateWithModal } from '@/components/form'
import { useTranslation } from 'react-i18next'

import { removeStudent } from '../requests'

const RemoveStudent: React.FC = () => {
	const { t } = useTranslation()

	return (
		<FormTemplateWithModal
			header={t('Unenrolling a student from a course')}
			fields={[
				{ controlId: 'username', label: t('Username') },
				{ controlId: 'course', label: t('Course') }
			]}
			submitBtnText={t('Submit')}
			handler={removeStudent}
		/>
	)
}

export default RemoveStudent
