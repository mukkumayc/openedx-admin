import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Error: React.FC = () => {
	const [searchParams] = useSearchParams()
	const message = searchParams.get('message')
	return (
		<section className="container-md error-page d-flex justify-content-center page">
			<div className="message-wrapper">
				<h1 className="text-center">{message ?? 'Unknown error occured'}</h1>
				<p className="text-center">
					<Link to="/">Return to home</Link>
				</p>
			</div>
		</section>
	)
}

export default Error
