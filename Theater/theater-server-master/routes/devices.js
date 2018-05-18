import models from '../models'
import express from 'express'

const router = express.Router()

/**
 * @api {get} /device/:deviceId Request device information
 * @apiName GetDevice
 * @apiGroup Device
 *
 * @apiParam {Number} deviceId Device's unique ID
 *
 * @apiSuccess {String} address The address of the device
 * @apiSuccess {String} name The name of the device
 * @apiSuccess {String} description A description of the device
 * @apiSuccess {Number} showId The show that this device is associated with
 *
 * @apiError 404 The id of the device was not found
 */
router.get('/:deviceId?', async (req, res) => {
	if (req.params && req.params.deviceId) {
		let devices = await models.Devices.findAll({
			where: {
				id: req.params.deviceId
			}
		})
		res.send(devices)
	} else {
		let devices = await models.Devices.findAll()
		res.send(devices)
	}
})

/**
 * @api {post} /device/ Input device information
 * @apiName PostDevice
 * @apiGroup Device
 *
 * @apiParam {String} address The address of the device
 * @apiParam {String} name The name of the device
 * @apiParam {String} description A description of the device
 * @apiParam {Number} showId The show that this device is associated with
 *
 * @apiError 404 The id of the device was not found
 * @apiSuccess 201 Record created
 */
router.post('/', async (req, res) => {
	let devices = await models.Devices.create({
		name: req.query.name,
		description: req.query.description,
		address: req.query.address,
		showId: req.query.showId
	})
	.error(() => {
		res.sendStatus(500)
	})
	res.sendStatus(201)
})

/**
 * @api {patch} /device/:deviceId Modify device information
 * @apiName PostDevice
 * @apiGroup Device
 *
 * @apiParam {String} address (optional) The address of the device
 * @apiParam {String} name (optional) The name of the device
 * @apiParam {String} description (optional) A description of the device
 * @apiParam {Number} showId (optional) The show that this device is associated with
 *
 * @apiError 404 The id of the device was not found
 * @apiError 500 Error when modifying the device information. Device not updated.
 * @apiSuccess 202 Record modified
 */
router.patch('/:deviceId', async (req, res) => {
	let device = await models.Devices.find({
		where: {
			id: req.params.deviceId
		}
	})
	.error((err) => {
		res.sendStatus(500)
	})

	if (!device) {
		res.sendStatus(404)
		return
	}
	device.name = req.query.name || device.name
	device.description = req.query.description || device.description
	device.address = req.query.address || device.address
	device.showId = req.query.showId || device.showId
	await device.save()
	res.sendStatus(202)
})

/**
 * @api {delete} /device/:deviceId Delete device record
 * @apiName DeleteDevice
 * @apiGroup Device
 *
 * @apiParam {Number} deviceId The device ID to be deleted
 *
 * @apiError 500 Error deleting device
 * @apiSuccess 202 Record deleted
 */
router.delete('/:deviceId', async (req, res) => {
	await models.Devices.destroy({
		where: {
			id: req.params.deviceId
		}
	})
	.error(() => {
		res.sendStatus(500)
	})

	res.sendStatus(202)
})

module.exports = router
