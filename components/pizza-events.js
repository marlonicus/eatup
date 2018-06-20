import { isEmpty, or, equals, pipe, not } from "ramda"
import { mapIndexed } from "../utils"

const PizzaEvent = (event, index) => (
	<a href={event.link} key={index}>
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
				{ mapIndexed(PizzaEvent, pizzas) }
			</React.Fragment>
		)
	}
	
	return null
}

export default PizzaEvents