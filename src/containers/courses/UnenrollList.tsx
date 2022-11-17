import { useState } from 'react'
import { Button, Card, Form, ListGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormGroup } from '@/components/form'

import EnrollmentModal from './EnrollmentModal'

// objects is the list of things that can be unenrolled
const UnenrollList: React.FC<{ objects: string[]; subject: string }> = ({
	objects,
	subject
}) => {
	const { t } = useTranslation()

	const { register, handleSubmit, watch, reset } = useForm<{
		[x: string]: boolean
	}>({
		defaultValues: objects.reduce((obj, st) => ({ ...obj, [st]: false }), {})
	})

	const sts = watch(objects)
	const disabled = !sts.some((el) => el)
	const [showUnenroll, setShowUnenroll] = useState(false)

	const onUnenroll = () => setShowUnenroll(true)

	return (
		<Form onSubmit={handleSubmit(onUnenroll)}>
			<Card as="section" className="mt-3">
				<Card.Header className="unenroll-list">
					<div className="unenroll-actions-list">
						<Button variant="danger" type="submit" {...{ disabled }}>
							{t('Unenroll')}
						</Button>
						<Button
							variant="secondary"
							onClick={() => reset()}
							{...{ disabled }}>
							{t('Cancel')}
						</Button>
					</div>
				</Card.Header>
				<Card.Body>
					<ListGroup variant="flush">
						{objects.map((name) => (
							<ListGroup.Item key={name}>
								<FormGroup
									{...{ register, watch, name }}
									type="checkbox"
									label={name}
								/>
							</ListGroup.Item>
						))}
					</ListGroup>
				</Card.Body>
			</Card>
			<EnrollmentModal
				users={objects.filter((st, i) => sts[i])}
				course={subject}
				show={showUnenroll}
				setShow={setShowUnenroll}
				action="unenroll"
			/>
		</Form>
	)
}

export default UnenrollList
