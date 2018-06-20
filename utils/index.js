import { map, addIndex } from "ramda"

export const cancelEvent = ev => {
	ev.preventDefault()
	ev.stopPropagation()
	return ev
}

export const getInputValue = $element => $element.current.value

export const mapIndexed = addIndex(map)