import { Container } from 'react-bootstrap'

const NotFound = () => (
	<Container id="not-found" className="page d-flex justify-content-center">
		<div className="message-wrapper">
			<h1 className="text-center">Page not found</h1>
			<p>
				Sorry, the page <code>{window.location.pathname}</code> could not be
				found.
			</p>
		</div>
	</Container>
)

export default NotFound
