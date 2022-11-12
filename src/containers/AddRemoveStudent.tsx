import { FormTemplateWithModal } from '@/components/form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { addStudent, removeStudent } from '../requests'

const AddRemoveStudent: React.FC = () => {
	const { action } = useParams()
	const { t } = useTranslation()

	return (
		<FormTemplateWithModal
			header={
				action === 'add'
					? t('Enrolling a student in a course')
					: t('Unenrolling a student from a course')
			}
			fields={[
				{ controlId: 'username', label: t('Username') },
				{ controlId: 'course', label: t('Course') }
			]}
			submitBtnText={t('Submit')}
			handler={action === 'add' ? addStudent : removeStudent}
		/>
	)
}

export default AddRemoveStudent
