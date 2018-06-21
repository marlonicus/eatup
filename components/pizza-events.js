import { isEmpty, or, equals, pipe, not, pathOr } from "ramda"
import { mapIndexed } from "../utils"

const PizzaEvent = (event, index) => (
	<tr key={index}>
		<td><a href={event.link} target="_blank" title="Go to event">{ event.name }</a></td>
		<td><a href={event.link} target="_blank" title="Go to event">{ event.local_date } - { event.local_time }</a></td>
		<td>
			{ pathOr(false, ['loot', 'pizza'], event) && '🍕' }
			{ pathOr(false, ['loot', 'wine'], event) && '🍷' }
			{ pathOr(false, ['loot', 'beer'], event) && '🍺' }
		</td>
	</tr>
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
				
				<table>	
					<thead>
						<tr>
							<th>Name</th>
							<th>When</th>
							<th>Chance of</th>
						</tr>
					</thead>
					<tbody>
						{ mapIndexed(PizzaEvent, pizzas) }
					</tbody>
				</table>
			</React.Fragment>
		)
	}
	
	return null
}

export default PizzaEvents