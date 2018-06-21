import { cancelEvent } from "../utils"
import { pipe } from "ramda"

const Form = ({ onSubmit, locationEl }) => (
	<form onSubmit={pipe(cancelEvent, onSubmit)}>
		<label htmlFor="location">Enter your City or location:</label>
		<br />
		<input
			type="text"
			ref={locationEl}
			id="location"
			placeholder="Göteborg, London, Atlantis..."
		/>
		<button type="submit">Search</button>
	</form>
)

export default Form