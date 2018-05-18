import models from '../models'
import express from 'express'

const router = express.Router()

/**
 * @api {get} /actionType/:actionTypeId Request action type information
 * @apiName GetActionType
 * @apiGroup ActionType
 *
 * @apiParam {Number} actionTypeId The action type's unique ID
 *
 * @apiSuccess {String} name The name of the action
 *
 * @apiError 404 The id of the action was not found
 */
router.get('/:actionTypeId?', async (req, res) => {
	if (req.params && req.params.actionTypeId) {
		let actions = await models.ActionTypes.findAll({
			where: {
				id: req.params.actionTypeId
			}
		})
		res.send(actions)
	} else {
		let actions = await models.ActionTypes.findAll()
		res.send(actions)
	}
})

/**
 * @api {post} /actionType/ Create new action type record
 * @apiName PostActionType
 * @apiGroup ActionType
 *
 * @apiParam {String} name The name of the action
 *
 * @apiSuccess {Number} actionTypeId The action type's unique ID
 *
 * @apiError 500 Failed to create record in database
 */
router.post('/', async (req, res) => {
	let actionTypes = await models.ActionTypes.create({
		name: req.query.name
	})
	.error(() => {
		res.sendStatus(500)
	})

	res.send( { id: actionTypes.get('id') } )
})

/**
 * @api {patch} /actionType/:actionTypeId Modify action type information
 * @apiName PatchActionType
 * @apiGroup ActionType
 *
 * @apiParam {String} name (optional) The name of the action
 *
 * @apiSuccess 202 The record was updated
 *
 * @apiError 404 The id of the action type was not found
 * @apiError 500 Internal server error while updating record
 */
router.patch('/:actionTypeId', async (req, res) => {
	let actionType = await models.ActionTypes.find({
		where: {
			id: req.params.actionTypeId
		}
	})
	.error((err) => {
		res.sendStatus(500)
	})

	if (!actionType) {
		res.sendStatus(404)
		return
	}
	actionType.name = req.query.name || actionType.name
	await actionType.save()
	res.sendStatus(202)
})

/**
 * @api {delete} /actionType/:actionTypeId Delete action type information
 * @apiName DeleteActionType
 * @apiGroup ActionType
 *
 * @apiParam {Number} actionTypeId Action's unique ID
 *
 * @apiSuccess 202 The record was deleted
 *
 * @apiError 500 Internal server error while updating record
 */
router.delete('/:actionTypeId', async (req, res) => {
	await models.ActionTypes.destroy({
		where: {
			id: req.params.actionTypeId
		}
	})
	.error(() => {
		res.sendStatus(500)
	})

	res.sendStatus(202)
})

module.exports = router
