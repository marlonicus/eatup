import { cancelEvent } from "../utils"
import { pipe } from "ramda"

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

export default Form