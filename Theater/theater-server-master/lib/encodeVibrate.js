import { app } from '../app'
import encodeMedia from './encodeMedia'
import fs from 'fs'

export default function encodeVibrate(action) {
	let json = {}
	json.action = 'vibration'
	json.sound_bool = false
	json.vibrate_bool = true
	json.vibrate_length = (action.dataValues.duration * 1000)

	return JSON.stringify(json)
}
