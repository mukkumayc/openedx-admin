import Form from 'react-bootstrap/Form'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface Props<A extends FieldValues> {
	controlId: Path<A>
	label: string
	register: UseFormRegister<A>
}

const FormGroup = <A extends FieldValues>({
	controlId,
	label,
	register
}: Props<A>) => {
	return (
		<Form.Group {...{ controlId }}>
			<Form.Label>{label}</Form.Label>
			<Form.Control {...register(controlId, { required: true })} />
		</Form.Group>
	)
}

export default FormGroup
