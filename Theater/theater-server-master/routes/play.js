import models from '../models'
import express from 'express'
import encodeMedia from '../lib/encodeMedia'
import actionTypes from '../lib/actionTypes'
import { app } from '../app'
import encodeAudio from '../lib/encodeAudio'
import encodeLink from '../lib/encodeLink'
import encodeVideo from '../lib/encodeVideo'
import encodeImage from '../lib/encodeImage'
import encodeVibrate from '../lib/encodeVibrate'
import encodeBackground from '../lib/encodeBackground'
const router = express.Router()

/**
 * @api {get} /play/:cueId Execute the actions in a cue
 * @apiName GetPlayCue
 * @apiGroup Play
 *
 * @apiParam {Number} cueId The ID of the cue to be played
 *
 * @apiSuccess 200 The cue was played
 * @apiError 400 The request did not contain a cueId
 * @apiError 404 The cue was not found in the database
 */
router.get('/:cueId', async (req, res) => {

	if (req.params && req.params.cueId) {
		models.Actions.findAll({
			where: {
				cueId: req.params.cueId
			},
			include: [
				{
					model: models.ActionTypes
				},
				{
					model: models.Assets,
					include: [
						{
							model: models.AssetTypes
						}
					]
				}
			]
		})
		.then((actions) => {
			if (actions) {
				// do stuff with the action
				actions.forEach((action) => {
					let json = ''

					switch (action.dataValues.ActionTypeId) {
						// do some stuff based on the action type of this action
						case actionTypes.changeBackground:
							console.log('Action type: changeBackground')
							json = encodeBackground(action)
							break
						case actionTypes.playVideo:
							console.log('Action type: playVideo')
							json = encodeVideo(action)
							break
						case actionTypes.playSound:
							console.log('Action type: playSound')
							json = encodeAudio(action)
							break
						case actionTypes.showImage:
							console.log('Action type: show image')
							json = encodeImage(action)
							console.log(json)
							break
						case actionTypes.vibratePhone:
							console.log('Action type: Vibrate Phone')
							json = encodeVibrate(action)
							break
						case actionTypes.openLink:
							console.log('Action type: Open link')
							json = encodeLink(action)
							break
						default:
							console.log('No action type!')
							break
					}

					if (json) {
						app.io.emit('json emission', json)
						res.sendStatus(200)
					} else {
						console.log('Error! json was null when sending over socket')
						res.sendStatus(500)
					}
				})
			} else {
				res.sendStatus(404)
			}
		})
		.error((err) => {
			console.log(err)
			res.sendStatus(404)
		})
	} else {
		console.log('no cueId')
		res.sendStatus(400)
	}
})

module.exports = router
