import MessageModal, { useModal } from '@/components/MessageModal'
import type { RequestFunction } from '@/requests'
import { isLeft } from '@/utils'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { UseFormRegister, UseFormWatch, useForm } from 'react-hook-form'
import type { FieldValues, Path, SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormGroup } from '..'

interface Props<A extends FieldValues, B> {
	header: string
	fields: {
		name: Path<A>
		label: string
		type?: 'checkbox'
		optional?: Path<A>
	}[]
	submitBtnText: string
	handler: RequestFunction<A, B>
	parseResponse(data: B): React.ReactNode
}

function parseField<A extends FieldValues>(
	field: {
		name: Path<A>
		label: string
		type?: 'checkbox'
		optional?: Path<A>
	},
	register: UseFormRegister<A>,
	watch: UseFormWatch<A>,
	key?: number
) {
	return field.type === 'checkbox' ? (
		<Form.Check id={field.name} label={field.label} {...register(field.name)} />
	) : (
		<FormGroup className="mb-3" {...field} {...{ register, watch, key }} />
	)
}

function FormTemplateWithResult<A extends FieldValues, B>({
	header,
	fields,
	submitBtnText,
	handler,
	parseResponse
}: Props<A, B>) {
	const { t } = useTranslation()
	const {
		register,
		watch,
		handleSubmit,
		formState: { isSubmitting }
	} = useForm<A>()
	const [modalProps, showModal] = useModal()

	const [response, setResponse] = useState<B | null>(null)

	const onSubmit: SubmitHandler<A> = async (values) => {
		const res = await handler(values)
		if (isLeft(res)) {
			setResponse(null)
			return showModal(t('Error'), t(res.left))
		}

		return setResponse(res.right)
	}

	return (
		<Container as="main" fluid="md" className="page">
			<Card as="section">
				<Card.Header as="h1">{header}</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit(onSubmit)}>
						{fields.map((props, i) => parseField(props, register, watch, i))}
						<Button variant="primary" type="submit" disabled={isSubmitting}>
							{submitBtnText}
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<section className="results">
				{response && parseResponse(response)}
			</section>
			<MessageModal {...modalProps} />
		</Container>
	)
}

export default FormTemplateWithResult
