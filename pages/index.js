import React from "react"
import { bind } from "ramda"
import { getInputValue } from "../utils"

import Head from "../components/head"
import Form from "../components/form"
import PizzaEvents from "../components/pizza-events"
import Footer from "../components/footer"

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
		
		if (location.toLowerCase() === `atlantis`) {
			window.alert('I was only joking about Atlantis 🙄')
			return this.foundPizza([])	
		}
		
		const json = await findPizza(location)
		this.foundPizza(json)
	}

	render() {
		return (
			<main className="container" style={{padding: '70px 20px 200px'}}>
				<Head />
				
				<h2 className="row">Welcome to the free pizza finder 🍕</h2>
				<h6><b>Version:</b> <a href="https://xkcd.com/37/" target="_blank">basic ass-prototype</a></h6>
				<hr />
				
				<Form
					locationEl={this.$location}
					onSubmit={bind(this.searchForPizza, this)}
				/>
				
				{ this.state.searching && <p>Searching for pizza 🔎</p> }
				
				<PizzaEvents pizzas={this.state.pizzas} />
				
				<Footer />
			</main>
		)
	}
}