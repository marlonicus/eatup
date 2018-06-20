import React from "react"
import { pipe, bind, partial } from "ramda"
import { cancelEvent, getInputValue } from "../utils"

const Form = ({ onSubmit, locationEl }) => (
	<form onSubmit={pipe(cancelEvent, onSubmit)}>
		<label htmlFor="location">Enter your City or ZIP Code:</label>
		<input
			type="text"
			ref={locationEl}
			id="location"
			placeholder="Gothenburg, London, New York..."
		/>
		<button type="submit">Search</button>
	</form>
)

export default class Root extends React.Component {
	constructor() {
		super()

		this.$location = React.createRef()

		this.state = {
			searching: false,
		}
	}

	searchForPizza = async () => {
		const location = getInputValue(this.$location)

		this.setState({
			searching: true,
		})

		const data = await fetch(`/.netlify/functions/hello`, { mode: "cors" })
		// const data = await fetch(`https://api.meetup.com/find/locations?query=${location}`, {
		// mode: 'no-cors'
		// })
		const json = await data.text()
		console.log(json)
	}

	render() {
		return (
			<main>
				<p>Welcome to the free pizza finder</p>
				<Form
					locationEl={this.$location}
					onSubmit={bind(this.searchForPizza, this)}
				/>
			</main>
		)
	}
}
