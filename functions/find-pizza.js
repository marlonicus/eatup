require("dotenv").config()
import diacritics from "diacritics"
import fetch from "node-fetch"
import {
	toPairs,
	pipe,
	map,
	join,
	filter,
	match,
	propOr,
	isEmpty,
	not,
	reduce,
	anyPass,
	equals,
	any,
	nth,
	fromPairs,
} from "ramda"

const MEETUP_API_ENDPOINT = `https://api.meetup.com`
const LOCATIONIQ_API_ENDPOINT = `https://eu1.locationiq.org/v1/search.php`

const PIZZA_TERMS = [`pizza`, `🍕`, `'za`]
const BEER_TERMS = [`beer`, `ale`, `brewski`, `lager`, `pint`, `🍺`, `🍻`]

const matches = term => pipe(match(term), isEmpty, not)

const queryStringFromObject = pipe(toPairs, map(join("=")), join("&"))

const getFetchWithParams = (url, params) => {
	console.log(`Fetching: ${url}?${queryStringFromObject(params)}`)
	return fetch(`${url}?${queryStringFromObject(params)}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
}

const meetupApi = async (endpoint, params) => {
	const paramsWithKey = Object.assign({}, params, {
		key: process.env.MEETUP_API_KEY,
	})
	const res = await getFetchWithParams(
		`${MEETUP_API_ENDPOINT}${endpoint}`,
		paramsWithKey,
	)
	return await res.json()
}

const findEventsInLocation = ({ lat, lon }) =>
	meetupApi(`/find/upcoming_events`, { lat, lon, page: 500, radius: "smart" })

const findLatLonOfLocation = async ({ location }) => {
	const res = await getFetchWithParams(LOCATIONIQ_API_ENDPOINT, {
		q: diacritics.remove(location),
		key: process.env.LOCATIONIQ_API_KEY,
		format: `json`,
	})

	return await res.json()
}

const wordMatch = word => new RegExp(`(\s|\W)?${word}'?s?[.!?\\-,]?(\s|\W)?`, 'gmi')

const containsPizzaMention = anyPass([
	matches(wordMatch('pizza')),
	matches(wordMatch('food is served')),
	matches(wordMatch('🍕')),
	matches(wordMatch('\'za'))
])

const containsBeerMention = anyPass([
	matches(wordMatch('beer')),
	matches(wordMatch('ale')),
	matches(wordMatch('brewski')),
	matches(wordMatch('lager')),
	matches(wordMatch('pint'))
])

const containsWineMention = anyPass([
	matches(wordMatch('wine')),
	matches(wordMatch('pinot')),
	matches(wordMatch('rosé'))
])

const getFoodOrDrinkMentionsFromEvent = event => {
	const description = propOr("", "description", event)

	return [
		['pizza', containsPizzaMention(description)],
		['beer', containsBeerMention(description)],
		['wine', containsWineMention(description)],
	]
}

const addLootToEvents = reduce((prev, curr) => {
	const loot = getFoodOrDrinkMentionsFromEvent(curr)

	if (
		any(
			pipe(
				nth(1),
				equals(true)
			)
		)(loot)
	) {
		return [
			...prev,
			Object.assign({}, curr, { loot: fromPairs(loot) }),
		]
	}

	return prev
}, [])

exports.handler = async (event, context, callback) => {
	const { location } = JSON.parse(event.body)

	try {
		const [primaryLocation] = await findLatLonOfLocation({ location })
		const { city, events } = await findEventsInLocation(primaryLocation)

		callback(null, {
			statusCode: 200,
			body: JSON.stringify(addLootToEvents(events)),
		})
	} catch (e) {
		console.log(e)
		callback(null, {
			statusCode: 200,
			body: JSON.stringify([]),
		})
	}
}
