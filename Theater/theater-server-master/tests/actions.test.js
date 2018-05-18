import request from 'supertest'
import { app } from '../app'
import models from '../models'
import insertCue from './lib/insertCue'
import insertActionType from './lib/insertActionType'
import insertShow from './lib/insertShow'
import insertDevice from './lib/insertDevice'

describe('Test /actions route', () => {

	const actionName = 'test action'
	const actionDescription = 'test description'
	const actionDuration = 1.0
	const actionAddress = 'test address'
	const actionId = 1
	let cueId = -1
	let actionTypeId = -1
	let deviceId = -1

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		// clear the database table
		await models.Actions.destroy({
			where: {}
		})
		const showId = await insertShow()
		cueId = await insertCue(showId)
		actionTypeId = await insertActionType(showId)
		deviceId = await insertDevice(showId)
		// make sure that it has at least one row
		return models.Actions.create({
			id: actionId,
			name: actionName,
			description: actionDescription,
			duration: actionDuration,
			address: actionAddress,
			deviceId: deviceId,
			actionTypeId: actionTypeId,
			cueId: cueId
		})
	})

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/actions')
		expect(response.statusCode).toBe(200)
	}),

	test('It should respond to GET with JSON', async () => {
		const response = await request(app).get('/actions')
		expect(response.body[0].id).toBe(1)
	}),

	test('It should respond 200 to POST', async () => {
		const newActionName = 'new action'
		const newActionDescription = 'newActionDescription'
		const response = await request(app)
			.post('/actions')
			.query({
				name: newActionName,
				description: newActionDescription,
				cueId: cueId,
				actionTypeId: actionTypeId,
				deviceId: deviceId
			})
		expect(response.statusCode).toBe(200)
	})

	test('It should insert a record on POST', async () => {
		const newActionName = 'new action 2'
		const newActionDescription = 'newActionDescription'

		const response = await request(app)
			.post('/actions')
			.query({
				name: newActionName,
				description: newActionDescription,
				cueId: cueId,
				actionTypeId: actionTypeId,
				deviceId: deviceId
			})
		const newQuery = await models.Actions.findOne({
			where: {
				name: newActionName
			}
		})
		expect(newQuery.dataValues.name).toBe(newActionName)
		expect(newQuery.dataValues.description).toBe(newActionDescription)
	})

	test('It should respond 202 to PATCH', async () => {
		const newActionName = 'another name'
		const response = await request(app)
			.patch('/actions/' + actionId)
			.query({
				name: newActionName
			})

		expect(response.statusCode).toBe(202)
	})

	test('It should update a record on PATCH', async () => {
		const newActionName = 'another name 2'
		const response = await request(app)
			.patch('/actions/' + actionId)
			.query({
				name: newActionName
			})

		const data = await models.Actions.findById(actionId)
		expect(data.dataValues.name).toBe(newActionName)
	})


	test('It should respond 202 to DELETE', async () => {
		const response = await request(app)
			.delete('/actions/' + actionId)
		expect(response.statusCode).toBe(202)
	})

	test('It should delete a record on DELETE', async () => {
		await models.Actions.create({
			id: actionId,
			name: actionName,
			description: actionDescription,
			cueId: cueId,
			actionTypeId: actionTypeId,
			deviceId: deviceId
		})
		const response = await request(app)
			.delete('/Actions/' + actionId)
		let record = models.Actions.findAll({
			where: {
				id: actionId
			}
		})

		expect(record.dataValues).toBeUndefined()
	})
})
