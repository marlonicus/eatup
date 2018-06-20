require("dotenv").config()
import diacritics from "diacritics"
import fetch from 'node-fetch'
import { toPairs, pipe, map, join, filter, match, propOr, isEmpty, not } from 'ramda'

const MEETUP_API_ENDPOINT = `https://api.meetup.com`
const LOCATIONIQ_API_ENDPOINT = `https://eu1.locationiq.org/v1/search.php`

const queryStringFromObject = pipe(
	toPairs, 
	map(join('=')), 
	join('&')
)

const getFetchWithParams = (url, params) => {
	console.log(`Fetching: ${url}?${queryStringFromObject(params)}`)
	return fetch(`${url}?${queryStringFromObject(params)}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

const meetupApi = async (endpoint, params) => {
	const paramsWithKey = Object.assign({}, params, { key: process.env.MEETUP_API_KEY })
	const res = await getFetchWithParams(`${MEETUP_API_ENDPOINT}${endpoint}`, paramsWithKey)
	return await res.json()
}

const findEventsInLocation = ({ lat, lon }) => meetupApi(`/find/upcoming_events`, { lat, lon, page: 500, radius: 'smart' })

const findLatLonOfLocation = async({ location }) => {
	const res = await getFetchWithParams(LOCATIONIQ_API_ENDPOINT, {
		q: diacritics.remove(location),
		key: process.env.LOCATIONIQ_API_KEY,
		format: `json`
	})
	
	return await res.json()
}

const eventHasPizza = event => {
	const description = propOr('', 'description', event)
	return pipe(match('pizza'), isEmpty, not)(description)
}

exports.handler = async (event, context, callback) => {
	const { location } = JSON.parse(event.body)
	
	try {
		const [primaryLocation] = await findLatLonOfLocation({ location })	
		const { city, events } = await findEventsInLocation(primaryLocation)	
		
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(filter(eventHasPizza, events))
		})	
	}
	catch (e) {
		callback(null, {
			statusCode: 200,
			body: JSON.stringify([])
		})	
	}
}
