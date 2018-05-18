import models from '../models'
import express from 'express'
import fileupload from 'express-fileupload'
import fs from 'fs'
import { USER_FILE_STORAGE_PATH } from '../config'

const router = express.Router()

async function getAssetTypeFromMimeType(mimetype) {
	let asset = await models.AssetTypes.findOne({
		where: {
			mime: mimetype
		}
	})
	.error(() => {
		console.log('Error getting asset type from mimetype: ' + err)
		return null
	})
	return asset.dataValues.id
}

/**
 * @api {post} /upload/ Create a new file in the filesystem for serving to a user
 * @apiName PostFile
 * @apiGroup File
 *
 * @apiParam {File} assetFile The file that the user is uploading
 * @apiParam {Number} showId The show that this file should be associated with
 *
 * @apiSuccess 200 Asset stored, database record created
 * @apiError 500 Error saving file, or error creating database record to track files
 */
router.post('/:showId', async (req, res) => {
	if (!req.files) {
		// there are no files
		console.log('no files in upload request')
		res.sendStatus(400)
		return
	}

	let assetFile = req.files.assetFile
	let assetTypeId = await getAssetTypeFromMimeType(assetFile.mimetype)

	// make sure that the directory exists
	let assetDirectory = `${USER_FILE_STORAGE_PATH}/${req.params.showId}/${assetTypeId}`
	console.log(assetDirectory)
	if (!fs.existsSync(USER_FILE_STORAGE_PATH)) {
		fs.mkdirSync(USER_FILE_STORAGE_PATH)
	}
	if (!fs.existsSync(`${USER_FILE_STORAGE_PATH}/${req.params.showId}`)) {
		fs.mkdirSync(`${USER_FILE_STORAGE_PATH}/${req.params.showId}`)
	}
	if (!fs.existsSync(assetDirectory)) {
		fs.mkdirSync(assetDirectory)
	}

	let assetPath = `${assetDirectory}/${assetFile.name}`

	assetFile.mv(assetPath, (err) => { // move the file on the server
		if (err) {
			res.sendStatus(500)
			console.log(`Error moving user file ${err}`)
			return
		} else {
			models.Assets.create({
				name: assetFile.name,
				path: assetPath,
				showId: req.params.showId,
				assetTypeId: assetTypeId
			})
			.then(() => {
				console.log('inserted record into asset')
				res.sendStatus(200)
				return
			})
			.error(() => {
				console.log('error inserting record into asset')
				res.sendStatus(500)
				return
			})
		}
	})
	return
})

module.exports = router
