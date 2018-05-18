import request from 'supertest'
import { app } from '../app'
import models from '../models'

describe('Test /actionTypes route', () => {

	const actionTypeName = 'test actionType'
	const actionTypeId = 1

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		// clear the database table
		await models.ActionTypes.destroy({
			where: {}
		})
		// make sure that it has at least one row
		return models.ActionTypes.create({
			id: actionTypeId,
			name: actionTypeName
		})
	})

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/actionTypes')
		expect(response.statusCode).toBe(200)
	}),

	test('It should respond to GET with JSON', async () => {
		const response = await request(app).get('/actionTypes')
		expect(response.body[0].id).toBe(1)
	}),

	test('It should respond 200 to POST', async () => {
		const newActionTypeName = 'new actionType'
		const newActionTypeDescription = 'newActionTypeDescription'
		const response = await request(app)
			.post('/actionTypes')
			.query({
				name: newActionTypeName,
				description: newActionTypeDescription
			})
		expect(response.statusCode).toBe(200)
	})

	test('It should insert a record on POST', async () => {
		const newActionTypeName = 'new actionType 2'

		const response = await request(app)
			.post('/actionTypes')
			.query({
				name: newActionTypeName
			})
		const newQuery = await models.ActionTypes.findOne({
			where: {
				name: newActionTypeName
			}
		})
		expect(newQuery.dataValues.name).toBe(newActionTypeName)
	})

	test('It should respond 202 to PATCH', async () => {
		const newActionTypeName = 'another name'
		const response = await request(app)
			.patch('/actionTypes/' + actionTypeId)
			.query({
				name: newActionTypeName
			})

		expect(response.statusCode).toBe(202)
	})

	test('It should update a record on PATCH', async () => {
		const newActionTypeName = 'another name 2'
		const response = await request(app)
			.patch('/actionTypes/' + actionTypeId)
			.query({
				name: newActionTypeName
			})

		const data = await models.ActionTypes.findById(actionTypeId)
		expect(data.dataValues.name).toBe(newActionTypeName)
	})


	test('It should respond 202 to DELETE', async () => {
		const response = await request(app)
			.delete('/actionTypes/' + actionTypeId)
		expect(response.statusCode).toBe(202)
	})

	test('It should delete a record on DELETE', async () => {
		await models.ActionTypes.create({
			id: actionTypeId,
			name: actionTypeName
		})
		const response = await request(app)
			.delete('/ActionTypes/' + actionTypeId)
		let record = models.ActionTypes.findAll({
			where: {
				id: actionTypeId
			}
		})

		expect(record.dataValues).toBeUndefined()
	})
})
