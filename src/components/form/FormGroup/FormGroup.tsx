import Form from 'react-bootstrap/Form'
import type {
	FieldValues,
	Path,
	UseFormRegister,
	UseFormWatch
} from 'react-hook-form'

interface Props<A extends FieldValues> {
	controlId: Path<A>
	label: string
	register: UseFormRegister<A>
	watch: UseFormWatch<A>
	optional?: Path<A>
	className?: string
}

const FormGroup = <A extends FieldValues>({
	controlId,
	label,
	register,
	watch,
	...rest
}: Props<A>) => {
	// Optional is name of a form field. If field with this name has value `true`, this field is visible
	const optional = rest.optional
	const optionalWatch = optional && watch(optional)

	return optional ? (
		optionalWatch ? (
			<Form.Group {...{ controlId }} {...rest}>
				<Form.Label>{label}</Form.Label>
				<Form.Control {...register(controlId, { required: true })} />
			</Form.Group>
		) : (
			<></>
		)
	) : (
		<Form.Group {...{ controlId }} {...rest}>
			<Form.Label>{label}</Form.Label>
			<Form.Control {...register(controlId, { required: true })} />
		</Form.Group>
	)
}

export default FormGroup
