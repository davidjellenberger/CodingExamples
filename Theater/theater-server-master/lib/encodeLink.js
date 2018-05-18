import { app } from '../app'

export default function encodeLink(action) {

	let json = {}
	json.media = action.dataValues.address
	json.action = 'browser'
	json.sound_bool = false
	json.vibrate_bool = false
	json.vibrate_length = 0

	return JSON.stringify(json)
}
