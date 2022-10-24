import { useEffect, useState } from 'react'

import { adminAPIEndpoint } from '../config'

const Hello = () => {
	const [loading, setLoading] = useState(true)
	const [ok, setOk] = useState(false)
	const [text, setText] = useState('')
	useEffect(() => {
		console.log(adminAPIEndpoint + '/hello')
		fetch(adminAPIEndpoint + '/hello')
			.then((res) => {
				setOk(res.ok)
				return res.text()
			})
			.then((text) => {
				setText(text)
			})
			.catch(console.error)
			.finally(() => setLoading(false))
	}, [])

	console.log(ok, text)

	return (
		<div className="hello container">
			{loading
				? 'Loading...'
				: ok && text
				? 'Congratulations!'
				: 'Something went wrong'}
		</div>
	)
}

export default Hello
