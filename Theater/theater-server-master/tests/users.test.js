import request from 'supertest'
import { app } from '../app'
import models from '../models'

describe('Test /users route', () => {

	const userSeat = 'A1'
	const ipAddress = '1.1.1.1'
	const deviceType = 'iPhone'
	const userId = 1

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		// clear the database table
		await models.Users.destroy({
			where: {}
		})
		// make sure that it has at least one row
		return models.Users.create({
			id: userId,
			seat: userSeat,
			ipAddress: ipAddress,
			deviceType: deviceType
		})
	})

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/users')
		expect(response.statusCode).toBe(200)
	}),

	test('It should respond to GET with JSON', async () => {
		const response = await request(app).get('/users')
		expect(response.body[0].id).toBe(1)
	}),

	test('It should respond 201 to POST', async () => {
		const newUserDescription = 'newUserDescription'
		const response = await request(app)
			.post('/users')
			.query({
				id: userId,
				seat: userSeat,
				ipAddress: ipAddress,
				deviceType: deviceType
			})
		expect(response.statusCode).toBe(201)
	})

	test('It should insert a record on POST', async () => {
		const newIpAddress = '2.2.2.2'

		const response = await request(app)
			.post('/users')
			.query({
				id: userId,
				seat: userSeat,
				ipAddress: newIpAddress,
				deviceType: deviceType
			})
		const newQuery = await models.Users.findOne({
			where: {
				ipAddress: newIpAddress
			}
		})
		expect(newQuery.dataValues.ipAddress).toBe(newIpAddress)
		expect(newQuery.dataValues.deviceType).toBe(deviceType)
	})

	test('It should respond 202 to PATCH', async () => {
		const newIpAddress = '2.2.2.2'
		const response = await request(app)
			.patch('/users/' + userId)
			.query({
				ipAddress: newIpAddress
			})

		expect(response.statusCode).toBe(202)
	})

	test('It should update a record on PATCH', async () => {
		const newIpAddress = '2.2.2.2'
		const response = await request(app)
			.patch('/users/' + userId)
			.query({
				ipAddress: newIpAddress
			})

		const data = await models.Users.findById(userId)
		expect(data.dataValues.ipAddress).toBe(newIpAddress)
	})


	test('It should respond 202 to DELETE', async () => {
		const response = await request(app)
			.delete('/users/' + userId)
		expect(response.statusCode).toBe(202)
	})

	test('It should delete a record on DELETE', async () => {
		await models.Users.create({
			id: userId,
			seat: userSeat,
			ipAddress: ipAddress,
			deviceType: deviceType
		})
		const response = await request(app)
			.delete('/Users/' + userId)
		let record = models.Users.findAll({
			where: {
				id: userId
			}
		})

		expect(record.dataValues).toBeUndefined()
	})
})
