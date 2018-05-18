import models from '../models'
import express from 'express'

const router = express.Router()

/**
 * @api {get} /user/:userId Request user information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} userId User's unique ID
 *
 * @apiSuccess {Boolean} isAdmin The user's permission level
 * @apiSuccess {String} deviceType The kind of device that the user is connecting with
 * @apiSuccess {String} seat The seath that the user is occupying
 * @apiSuccess {String} firstName The user's first name
 * @apiSuccess {String} lastName The user's last name
 * @apiSuccess {String} email The user's email address
 * @apiSuccess {String} ipAddress The user's IP address
 */
router.get('/:userId?', async (req, res) => {
	if (req.params && req.params.userId) {
		let users = await models.Users.findAll({
			where: {
				id: req.params.userId
			}
		})
		res.send(users)
	} else {
		let users = await models.Users.findAll()
		res.send(users)
	}
})

/**
 * @api {post} /user/ Create new user record
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam {Boolean} isAdmin The user's permission level
 * @apiParam {String} deviceType The kind of device that the user is connecting with
 * @apiParam {String} seat The seath that the user is occupying
 * @apiParam {String} ipAddress The user's IP address
 * @apiParam {String} firstName The user's first name
 * @apiParam {String} lastName The user's last name
 * @apiParam {String} email The user's email address
 *
 * @apiError 500 Error creating user record
 */
router.post('/', async (req, res) => {
	let users = await models.Users.create({
		deviceType: req.query.deviceType,
		firstName: req.query.firstName,
		lastName: req.query.lastName,
		email: req.query.email,
		isAdmin: req.query.isAdmin,
		seat: req.query.seat,
		ipAddress: req.query.ipAddress
	})
	.error(() => {
		res.sendStatus(500)
	})
	res.sendStatus(201)
})

/**
 * @api {patch} /user/:userId Modify user record
 * @apiName PatchUser
 * @apiGroup User
 *
 * @apiParam {Number} userId The user to be edited
 * @apiParam {Boolean} isAdmin (optional) The user's permission level
 * @apiParam {String} deviceType (optional) The kind of device that the user is connecting with
 * @apiParam {String} seat (optional) The seath that the user is occupying
 * @apiParam {String} ipAddress (optional) The user's IP address
 * @apiParam {String} firstName The user's first name
 * @apiParam {String} lastName The user's last name
 * @apiParam {String} email The user's email address
 *
 * @apiError 500 Error changing user record
 * @apiError 404 User not found with provided userId
 *
 * @apiSuccess 202 User record edited
 */
router.patch('/:userId', async (req, res) => {
	let user = await models.Users.find({
		where: {
			id: req.params.userId
		}
	})
	.error((err) => {
		res.sendStatus(500)
	})

	if (!user) {
		res.sendStatus(404)
		return
	}
	user.deviceType = req.query.deviceType || user.deviceType
	user.isAdmin = req.query.isAdmin || user.isAdmin
	user.seat = req.query.seat || user.seat
	user.ipAddress = req.query.ipAddress || user.ipAddress
	user.firstName = req.query.firstName || user.firstName
	user.lastName = req.query.lastName || user.lastName
	user.email = req.query.email || user.email
	await user.save()
	res.sendStatus(202)
})

/**
 * @api {delete} /user/:userId Delete user record
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} userId The user to be deleted
 *
 * @apiError 500 Error deleting user record. User not deleted.
 *
 * @apiSuccess 202 User record removed
 */
router.delete('/:userId', async (req, res) => {
	await models.Users.destroy({
		where: {
			id: req.params.userId
		}
	})
	.error(() => {
		res.sendStatus(500)
	})

	res.sendStatus(202)
})

module.exports = router
