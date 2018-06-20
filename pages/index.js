import React from "react"
import { pipe, bind, partial, map, isEmpty } from "ramda"
import { cancelEvent, getInputValue } from "../utils"

const Form = ({ onSubmit, locationEl }) => (
	<form onSubmit={pipe(cancelEvent, onSubmit)}>
		<label htmlFor="location">Enter your City or ZIP Code:</label>
		<br />
		<input
			type="text"
			ref={locationEl}
			id="location"
			placeholder="Gothenburg, London, 90210..."
		/>
		<button type="submit">Search</button>
	</form>
)

const Pizza = (event) => (
	<a href={event.link}>
		<h3>{ event.name }</h3>
	</a>
)

const renderPizzas = pizzas => {
	if (isEmpty(pizzas)) {
		return <p>I can't find any pizza in your area 😞</p>
	}
	else {
		return (
			<React.Fragment>
				<hr />
				<p>I found pizza at the following events near you:</p>
				{ map(Pizza, pizzas) }
			</React.Fragment>
		)
	}
}

const findPizza = async location => {
	const res = await fetch(`/.netlify/functions/find-pizza`, { 
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ location })
	})
	
	return await res.json()
}

export default class Root extends React.Component {
	constructor() {
		super()

		this.$location = React.createRef()

		this.state = {
			searching: false,
			pizzas: false,
		}
	}
	
	foundPizza(pizzas) {
		this.setState({ 
			pizzas,
			searching: false,
		})
	}

	searchForPizza = async () => {
		this.setState({ 
			pizzas: false,
			searching: true 
		})
		
		const location = getInputValue(this.$location)
		const json = await findPizza(location)
		this.foundPizza(json)
	}

	render() {
		return (
			<main>
				<h1>Welcome to the free pizza finder 🍕</h1>
				
				<Form
					locationEl={this.$location}
					onSubmit={bind(this.searchForPizza, this)}
				/>
				
				{ this.state.searching && <p>Searching for pizza 🔎</p> }
				{ renderPizzas(this.state.pizzas) }
			</main>
		)
	}
}
