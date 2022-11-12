import { FormTemplateWithModal } from '@/components/form'
import { changePassword } from '@/requests'
import { useTranslation } from 'react-i18next'

const ChangePassword: React.FC = () => {
	const { t } = useTranslation()

	return (
		<FormTemplateWithModal
			header={t("Change user's password")}
			fields={[
				{ controlId: 'username', label: t('Username') },
				{ controlId: 'password', label: t('New password') }
			]}
			submitBtnText={t('Change')}
			handler={changePassword}
		/>
	)
}

export default ChangePassword
