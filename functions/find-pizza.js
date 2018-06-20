require("dotenv").config()
import fetch from 'node-fetch'
import { toPairs, pipe, map, join, filter, match, propOr, isEmpty, not } from 'ramda'

const MEETUP_API_ENDPOINT = `https://api.meetup.com`

const queryStringFromObject = pipe(
	toPairs, 
	map(join('=')), 
	join('&')
)

const getFetchWithParams = (url, params) => fetch(`${url}?${queryStringFromObject(params)}`)

const meetupApi = async (endpoint, params) => {
	const paramsWithKey = Object.assign({}, params, { key: process.env.MEETUP_API_KEY })
	const res = await getFetchWithParams(`${MEETUP_API_ENDPOINT}${endpoint}`, paramsWithKey)
	return await res.json()
}

const findEventsInLocation = ({ lat, lon }) => meetupApi(`/find/upcoming_events`, { lat, lon, page: 500, radius: 'smart' })
const findLatLonOfLocation = ({ location }) => meetupApi('/find/locations', { query: location })

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
