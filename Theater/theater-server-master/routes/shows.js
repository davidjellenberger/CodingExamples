import models from '../models'
import express from 'express'

const router = express.Router()

/**
 * @api {get} /show/:showId Request show information
 * @apiName GetShow
 * @apiGroup Show
 *
 * @apiParam {Number} showId Show's unique ID
 *
 * @apiSuccess {String} name The name of the action
 * @apiSuccess {String} director Name of the show's director
 * @apiSuccess {Number} splashScreenAssetId The id of the asset that is used as the splash screen for this show
 *
 * @apiError 404 The id of the show was not found
 */
router.get('/:showId?', async (req, res) => {
	if (res.params && res.params.showId) {
		let shows = await models.Shows.findAll({
			where: {
				id: req.params.showId
			}
		})
		res.send(shows)
	} else {
		let shows = await models.Shows.findAll()
		res.send(shows)
	}
})

/**
 * @api {get} /show/ Create show record
 * @apiName PostShow
 * @apiGroup Show
 *
 * @apiParam {String} name The name of the action
 * @apiParam {String} director Name of the show's director
 * @apiParam {Number} splashScreenAssetId The id of the asset that is used as the splash screen for this show
 *
 * @apiSuccess 201 Record created, body contains ID of new record
 *
 * @apiError 500 Error creating show. Show record not created.
 */
router.post('/', async (req, res) => {
	let shows = await models.Shows.create({
		name: req.query.name,
		director: req.query.director,
		splashScreenAssetId: req.query.splashScreenAssetId
	})
	.error(() => {
		res.sendStatus(500)
	})

	res.send( { id: shows.get('id') } )
})

/**
 * @api {patch} /show/:showId Change show information
 * @apiName PatchShow
 * @apiGroup Show
 *
 * @apiParam {Number} showId Show's unique ID
 *
 * @apiParam {String} name (optional) The name of the action
 * @apiParam {String} director (optional) Name of the show's director
 * @apiParam {Number} splashScreenAssetId The id of the asset that is used as the splash screen for this show
 *
 * @apiSuccess 202 Show modified.
 *
 * @apiError 404 The id of the show was not found
 * @apiError 500 Error modifying show information
 */
router.patch('/:showId', async (req, res) => {
	let show = await models.Shows.find({
		where: {
			id: req.params.showId
		}
	})
	.error((err) => {
		res.sendStatus(500)
	})

	if (!show) {
		res.sendStatus(404)
		return
	}
	show.name = req.query.name || show.name
	show.director = req.query.director || show.director
	show.splashScreenAssetId = req.query.splashScreenAssetId || show.splashScreenAssetId
	await show.save()
	res.sendStatus(202)
})

/**
 * @api {delete} /show/:showId Remove show information
 * @apiName DeleteShow
 * @apiGroup Show
 *
 * @apiParam {Number} showId Show's unique ID
 *
 * @apiSuccess 202 Show removed
 *
 * @apiError 500 Error removing show information. Show not deleted.
 */
router.delete('/:showId', async (req, res) => {
	await models.Shows.destroy({
		where: {
			id: req.params.showId
		}
	})
	.error(() => {
		res.sendStatus(500)
	})

	res.sendStatus(202)
})

module.exports = router
