import request from 'supertest'
import { app } from '../app'
import models from '../models'
import insertShow from './lib/insertShow'

describe('Test /devices route', () => {

	const deviceName = 'test device'
	const deviceDescription = 'test description'
	const deviceAddress = 'test address'
	const deviceId = 1
	let showId = -1

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		// clear the database table
		await models.Devices.destroy({
			where: {}
		})
		showId = await insertShow()
		// make sure that it has at least one row
		return models.Devices.create({
			id: deviceId,
			name: deviceName,
			description: deviceDescription,
			address: deviceAddress,
			showId: showId
		})
	})

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/devices')
		expect(response.statusCode).toBe(200)
	}),

	test('It should respond to GET with JSON', async () => {
		const response = await request(app).get('/devices')
		expect(response.body[0].id).toBe(1)
	}),

	test('It should respond 201 to POST', async () => {
		const newDeviceName = 'new device'
		const newDeviceDescription = 'newDeviceDescription'
		const response = await request(app)
			.post('/devices')
			.query({
				name: newDeviceName,
				description: newDeviceDescription,
				showId: showId
			})
		expect(response.statusCode).toBe(201)
	})

	test('It should insert a record on POST', async () => {
		const newDeviceName = 'new device 2'
		const newDeviceDescription = 'newDeviceDescription'

		const response = await request(app)
			.post('/devices')
			.query({
				name: newDeviceName,
				description: newDeviceDescription,
				showId: showId
			})
		const newQuery = await models.Devices.findOne({
			where: {
				name: newDeviceName
			}
		})
		expect(newQuery.dataValues.name).toBe(newDeviceName)
		expect(newQuery.dataValues.description).toBe(newDeviceDescription)
		expect(newQuery.dataValues.showId).toBe(showId)
	})

	test('It should respond 202 to PATCH', async () => {
		const newDeviceName = 'another name'
		const response = await request(app)
			.patch('/devices/' + deviceId)
			.query({
				name: newDeviceName
			})

		expect(response.statusCode).toBe(202)
	})

	test('It should update a record on PATCH', async () => {
		const newDeviceName = 'another name 2'
		const response = await request(app)
			.patch('/devices/' + deviceId)
			.query({
				name: newDeviceName
			})

		const data = await models.Devices.findById(deviceId)
		expect(data.dataValues.name).toBe(newDeviceName)
	})


	test('It should respond 202 to DELETE', async () => {
		const response = await request(app)
			.delete('/devices/' + deviceId)
		expect(response.statusCode).toBe(202)
	})

	test('It should delete a record on DELETE', async () => {
		await models.Devices.create({
			id: deviceId,
			name: deviceName,
			description: deviceDescription,
			address: deviceAddress,
			showId: showId
		})
		const response = await request(app)
			.delete('/Devices/' + deviceId)
		let record = models.Devices.findAll({
			where: {
				id: deviceId
			}
		})

		expect(record.dataValues).toBeUndefined()
	})
})
