import request from 'supertest'
import { app } from '../app'
import models from '../models'

describe('Test /shows route', () => {

	const testShowName = 'test_show'
	const testShowDirector = 'test_director'
	const testShowId = 1

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		// clear the database table
		await models.Shows.destroy({
			where: {}
		})
		// make sure that it has at least one row
		return models.Shows.create({
			id: testShowId,
			name: testShowName,
			director: testShowDirector
		})
	})

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/shows')
		expect(response.statusCode).toBe(200)
	}),

	test('It should respond to GET with JSON', async () => {
		const response = await request(app).get('/shows')
		expect(response.body[0].id).toBe(1)
		expect(response.body[0].name).toBe(testShowName)
		expect(response.body[0].director).toBe(testShowDirector)
	}),

	test('It should respond 200 to POST', async () => {
		const response = await request(app)
			.post('/shows')
			.query({
				name: 'Test show',
				director: 'Elijah'
			})
		expect(response.statusCode).toBe(200)
	})

	test('It should insert a record on POST', async () => {
		const director = 'POST_TEST'
		const name = 'Test show 2'
		const response = await request(app)
			.post('/shows')
			.query({
				name: name,
				director: director
			})
		const newQuery = await models.Shows.findOne({
			where: {
				director: director
			}
		})
		expect(newQuery.dataValues.director).toBe(director)
		expect(newQuery.dataValues.name).toBe(name)
	})

	test('It should respond 202 to PATCH', async () => {
		const newShowName = 'new test name'
		const newShowDirector = 'new director'
		const response = await request(app)
			.patch('/shows/' + testShowId)
			.query({
				name: newShowName,
				director: newShowDirector
			})
		expect(response.statusCode).toBe(202)
	})

	test('It should update a record on PATCH', async () => {
		const nsn = 'another name 2'
		const response = await request(app)
			.patch('/shows/' + testShowId)
			.query({
				name: nsn
			})

		const data = await models.Shows.findById(testShowId)
		expect(data.dataValues.name).toBe(nsn)
	})

	test('It should respond 202 to DELETE', async () => {
		const response = await request(app)
			.delete('/shows/' + testShowId)
		expect(response.statusCode).toBe(202)
	})

	test('It should delete a record on DELETE', async () => {
		await models.Shows.create({
			id: testShowId,
			name: testShowName,
			director: testShowDirector
		})
		const response = await request(app)
			.delete('/shows/' + testShowId)
		let record = models.Shows.findAll({
			where: {
				id: testShowId
			}
		})

		expect(record.dataValues).toBeUndefined()
	})

})
