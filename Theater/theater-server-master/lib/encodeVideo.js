import { app } from '../app'
import { SERVER_ADDRESS } from '../config'
import fs from 'fs'

export default function encodeVideo(action) {
	let filePath = action.Asset.dataValues.path
	let mimeType = action.Asset.dataValues.AssetType.dataValues.mime

	// get the file from storage
	let json = {}
	json.video = `http://${SERVER_ADDRESS}/public/${filePath}`
	json.mime = mimeType
	json.action = 'video'
	json.sound_bool = false
	json.vibrate_bool = false
	json.vibrate_length = 0

	return JSON.stringify(json)
}
