import Form from 'react-bootstrap/Form'
import type {
	FieldValues,
	Path,
	UseFormRegister,
	UseFormWatch
} from 'react-hook-form'

interface CommonExternalProps<A extends FieldValues> {
	controlId: Path<A>
	optional?: Path<A>
	className?: string
}

interface ControlAndCheckProps<A extends FieldValues>
	extends CommonExternalProps<A> {
	type?: 'text' | 'checkbox'
	label: string
}

interface RadiosProps<A extends FieldValues> extends CommonExternalProps<A> {
	type: 'radios'
	radios: { value: string; label: string }[]
	checked: string
}

export type FormGroupExternalProps<A extends FieldValues> =
	| ControlAndCheckProps<A>
	| RadiosProps<A>

type FormGroupProps<A extends FieldValues> = {
	register: UseFormRegister<A>
	watch: UseFormWatch<A>
} & (ControlAndCheckProps<A> | RadiosProps<A>)

const FormGroup = <A extends FieldValues>({
	controlId,
	register,
	watch,
	optional,
	className,
	...rest
}: FormGroupProps<A>) => {
	// Optional is name of a form field. If field with this name has value `true`, this field is visible
	const isEnabled = optional ? watch(optional) : true

	const Component = () => {
		switch (rest.type) {
			case 'checkbox':
				return (
					<Form.Check
						id={controlId}
						label={rest.label}
						{...register(controlId)}
					/>
				)
			case 'radios':
				return (
					<>
						{rest.radios.map(({ value, label }) => (
							<Form.Check
								id={`${controlId}-${value}`}
								label={label}
								{...register(controlId)}
								type="radio"
								value={value}
								key={value}
							/>
						))}
					</>
				)

			default:
				return (
					<Form.Group {...{ controlId }} {...{ className }}>
						<Form.Label>{rest.label}</Form.Label>
						<Form.Control {...register(controlId, { required: true })} />
					</Form.Group>
				)
		}
	}

	return isEnabled ? <Component /> : <></>
}

export default FormGroup
