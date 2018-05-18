import { app } from '../app'
import { SERVER_ADDRESS } from '../config'
import fs from 'fs'

export default function encodeAudio(action) {
	let filePath = action.Asset.dataValues.path
	let mimeType = action.Asset.dataValues.AssetType.dataValues.mime

	// get the file from storage
	let json = {}
	json.sound = `http://${SERVER_ADDRESS}/public/${filePath}`
	json.mime = mimeType
	json.action = 'audio'
	json.sound_bool = true
	json.vibrate_bool = false
	json.vibrate_length = 0

	console.log(json)
	return JSON.stringify(json)
}

