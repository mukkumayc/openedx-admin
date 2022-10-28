import Actions from './Actions'
import './Home.css'

const Home = () => (
	<div className="page">
		<Lander />
		<Actions />
	</div>
)

const Lander = () => (
	<section className="lander">
		<div className="container-md">
			<div className="lander-content">
				<h1>Open edX Admin</h1>
				<p>Web app for an online course platform management</p>
			</div>
		</div>
	</section>
)

export default Home
