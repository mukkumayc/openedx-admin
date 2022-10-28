import { Link, useSearchParams } from 'react-router-dom'

const Success: React.FC = () => {
	const [searchParams] = useSearchParams()
	return (
		<section className="container error-page d-flex justify-content-center page">
			<div className="message-wrapper">
				<h1 className="text-center">Success</h1>
				<p className="text-center">{searchParams.get('message')}</p>
				<p className="text-center">
					<Link to="/">Return to home</Link>
				</p>
			</div>
		</section>
	)
}

export default Success
