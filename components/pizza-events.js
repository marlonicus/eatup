import { map, isEmpty, or, equals, pipe, not } from "ramda"

const PizzaEvent = (event) => (
	<a href={event.link}>
		<h3>{ event.name }</h3>
	</a>
)

const PizzaEvents = ({ pizzas }) => {
	const hasSearchedForPizzas = not(equals(false)(pizzas))
	
	if (isEmpty(pizzas)) {
		return <p>I can't find any pizza in your area 😞</p>
	}
	else if (hasSearchedForPizzas && pipe(isEmpty, not)(pizzas)) {
		return (
			<React.Fragment>
				<hr />
				<p>I found pizza at the following events near you:</p>
				{ map(PizzaEvent, pizzas) }
			</React.Fragment>
		)
	}
	
	return null
}

export default PizzaEvents