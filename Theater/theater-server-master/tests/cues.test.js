import request from 'supertest'
import { app } from '../app'
import models from '../models'
import insertShow from './lib/insertShow'

describe('Test /cues route', () => {

	const cueName = 'test cue'
	const cueDescription = 'test description'
	const cueSequenceNum = 1
	const cueId = 1
	let showId = -1

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		// clear the database table
		await models.Cues.destroy({
			where: {}
		})
		showId = await insertShow()
		// make sure that it has at least one row
		return models.Cues.create({
			id: cueId,
			name: cueName,
			description: cueDescription,
			sequenceNum: cueSequenceNum,
			showId: showId
		})
	})

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/cues')
		expect(response.statusCode).toBe(200)
	}),

	test('It should respond to GET with JSON', async () => {
		const response = await request(app).get('/cues')
		expect(response.body[0].id).toBe(1)
	}),

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/cues/show/' + showId)
		expect(response.statusCode).toBe(200)
	}),

	test('It should respond 400 to GET with no params', async () => {
		const response = await request(app).get('/cues/show/')
		expect(response.statusCode).toBe(400)
	}),

	test('It should respond to GET with JSON', async () => {
		const response = await request(app).get('/cues/show/' + showId)
		expect(response.body[0].id).toBe(1)
	}),

	test('It should respond 200 to POST', async () => {
		const newCueName = 'new cue'
		const newCueDescription = 'newCueDescription'
		const response = await request(app)
			.post('/cues')
			.query({
				name: newCueName,
				description: newCueDescription,
				sequenceNum: cueSequenceNum,
				showId: showId
			})
		expect(response.statusCode).toBe(200)
	})

	test('It should insert a record on POST', async () => {
		const newCueName = 'new cue 2'
		const newCueDescription = 'newCueDescription'

		const response = await request(app)
			.post('/cues')
			.query({
				name: newCueName,
				description: newCueDescription,
				sequenceNum: cueSequenceNum,
				showId: showId
			})
		const newQuery = await models.Cues.findOne({
			where: {
				name: newCueName
			}
		})
		expect(newQuery.dataValues.name).toBe(newCueName)
		expect(newQuery.dataValues.description).toBe(newCueDescription)
		expect(newQuery.dataValues.sequenceNum).toBe(cueSequenceNum)
		expect(newQuery.dataValues.showId).toBe(showId)
	})

	test('It should respond 202 to PATCH', async () => {
		const newCueName = 'another name'
		const response = await request(app)
			.patch('/cues/' + cueId)
			.query({
				name: newCueName
			})

		expect(response.statusCode).toBe(202)
	})

	test('It should update a record on PATCH', async () => {
		const newCueName = 'another name 2'
		const response = await request(app)
			.patch('/cues/' + cueId)
			.query({
				name: newCueName
			})

		const data = await models.Cues.findById(cueId)
		expect(data.dataValues.name).toBe(newCueName)
	})

	test('It should respond 202 to DELETE', async () => {
		const response = await request(app)
			.delete('/cues/' + cueId)
		expect(response.statusCode).toBe(202)
	})

	test('It should delete a record on DELETE', async () => {
		await models.Cues.create({
			id: cueId,
			name: cueName,
			description: cueDescription,
			sequenceNum: cueSequenceNum,
			showId: showId
		})
		const response = await request(app)
			.delete('/Cues/' + cueId)
		let record = models.Cues.findAll({
			where: {
				id: cueId
			}
		})

		expect(record.dataValues).toBeUndefined()
	})
})
