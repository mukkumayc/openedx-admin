import { FormTemplateWithModal } from '@/components/form'
import { useTranslation } from 'react-i18next'

import { addStudent } from '../requests'

const AddStudent: React.FC = () => {
	const { t } = useTranslation()

	return (
		<FormTemplateWithModal
			header={t('Enrolling a student in a course')}
			fields={[
				{ controlId: 'username', label: t('Username') },
				{ controlId: 'course', label: t('Course') }
			]}
			submitBtnText={t('Submit')}
			handler={addStudent}
		/>
	)
}

export default AddStudent
