import models from '../models'
import express from 'express'

const router = express.Router()

/**
 * @api {get} /cue/show/:showId Request cue information by show
 * @apiName GetCueShow
 * @apiGroup Cue
 *
 * @apiParam {Number} showId The show ID that you want cues for
 *
 * @apiSuccess {String} name The name of the cue
 * @apiSuccess {String} description A description of the action
 * @apiSuccess {Number} sequenceNum Where this cue falls relative to other cues with the same showId
 * @apiSuccess {Number} showId The show that this cue should be associated with
 * @apiSuccess {Number} id The ID of the cue
 *
 * @apiError 404 The id of the show was not found
 */
router.get('/show/:showId?', async (req, res) => {
	if (req.params && req.params.showId) {
		let cues = await models.Cues.findAll({
			where: {
				showId: req.params.showId
			}
		})
		res.send(cues)
	} else {
		res.sendStatus(400)
	}
})

/**
 * @api {get} /cue/:cueId Request cue information
 * @apiName GetCue
 * @apiGroup Cue
 *
 * @apiParam {Number} cueId Cue's unique ID
 *
 * @apiSuccess {String} name The name of the cue
 * @apiSuccess {String} description A description of the action
 * @apiSuccess {Number} sequenceNum Where this cue falls relative to other cues with the same showId
 * @apiSuccess {Number} showId The show that this cue should be associated with
 *
 * @apiError 404 The id of the cue was not found
 */
router.get('/:cueId?', async (req, res) => {
	if (req.params && req.params.cueId) {
		let cues = await models.Cues.findAll({
			where: {
				id: req.params.cueId
			}
		})
		res.send(cues)
	} else {
		let cues = await models.Cues.findAll()
		res.send(cues)
	}
})

/**
 * @api {post} /cue/ Create new cue information
 * @apiName PostCue
 * @apiGroup Cue
 *
 * @apiParam {String} name The name of the cue
 * @apiParam {String} description A description of the action
 * @apiParam {Number} sequenceNum Where this cue falls relative to other cues with the same showId
 * @apiParam {Number} showId The show that this cue should be associated with
 *
 * @apiError 500 There was an error creating this cue. Cue has not been created.
 *
 * @apiSuccess 201 The cue has been created, with body containing ID of created cue
 */
router.post('/', async (req, res) => {
	let cues = await models.Cues.create({
		name: req.query.name,
		description: req.query.description,
		sequenceNum: req.query.sequenceNum,
		showId: req.query.showId
	})
	.error(() => {
		res.sendStatus(500)
	})


	res.send( { id: cues.get('id') } )
})

/**
 * @api {patch} /cue/:cueId Modify existing cue information
 * @apiName PatchCue
 * @apiGroup Cue
 *
 * @apiParam {Number} cueId The cue's unique ID
 *
 * @apiParam {String} name (optional) The name of the cue
 * @apiParam {String} description (optional) A description of the action
 * @apiParam {Number} sequenceNum (optional) Where this cue falls relative to other cues with the same showId
 * @apiParam {Number} showId (optional) The show that this cue should be associated with
 *
 * @apiError 500 There was an error modifying this cue. Cue has not been altered.
 *
 * @apiSuccess 202 This cue has been modified.
 */
router.patch('/:cueId', async (req, res) => {
	let cue = await models.Cues.find({
		where: {
			id: req.params.cueId
		}
	})
	.error((err) => {
		res.sendStatus(500)
	})

	if (!cue) {
		res.sendStatus(404)
		return
	}
	cue.name = req.query.name || cue.name
	cue.description = req.query.description || cue.description
	cue.sequenceNum = req.query.sequenceNum || cue.sequenceNum
	cue.showId = req.query.showId || cue.showId
	console.log('saving cue')
	await cue.save()
	res.sendStatus(202)
})

/**
 * @api {delete} /cue/:cueId Delete cue information
 * @apiName DeleteCue
 * @apiGroup Cue
 *
 * @apiParam {Number} cueId The cue's unique ID
 *
 * @apiError 500 There was an error deleting this cue. Cue has not been altered.
 *
 * @apiSuccess 202 This cue has been deleted.
 */
router.delete('/:cueId', async (req, res) => {
	await models.Cues.destroy({
		where: {
			id: req.params.cueId
		}
	})
	.error(() => {
		res.sendStatus(500)
	})

	res.sendStatus(202)
})

module.exports = router
