import { FormTemplateWithModal } from '@/components/form'
import { changePassword } from '@/requests'
import { useTranslation } from 'react-i18next'

const ChangePassword: React.FC = () => {
	const { t } = useTranslation()

	return (
		<FormTemplateWithModal
			header={t('Change user password')}
			fields={[
				{ name: 'username', label: t('Username') },
				{ name: 'password', label: t('New password') }
			]}
			submitBtnText={t('Change')}
			handler={changePassword}
		/>
	)
}

export default ChangePassword
