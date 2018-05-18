import request from 'supertest'
import { app } from '../app'
import models from '../models'
import insertShow from './lib/insertShow'
import insertAssetType from './lib/insertAssetType'
import fs from 'fs'
import { USER_FILE_STORAGE_PATH } from '../config'

describe('Test /upload route', () => {
	let showId = -1
	let assetType = -1 // created by the seeder

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		showId = await insertShow()
		assetType = await insertAssetType()
	})

	test('It should respond 200 to POST with a file', async () => {
		const response = await request(app)
		.post('/upload/' + showId)
		.attach('assetFile', './tests/testFiles/test_image_1.jpg')

		expect(response.statusCode).toBe(200)
	})

	test('it should respond 400 to POST with no file', async () => {
		const response = await request(app)
		.post('/upload/' + showId)

		expect(response.statusCode).toBe(400)
	})

	test('it should place the file in a folder', async () => {
		const response = await request(app)
		.post('/upload/' + showId)
		.attach('assetFile', './tests/testFiles/test_image_2.jpg')

		expect(fs.existsSync(`./${USER_FILE_STORAGE_PATH}/${showId}/${assetType}/test_image_2.jpg`)).toBe(true)
	})

	afterAll(async () => {
		fs.rmdirSync(`./${USER_FILE_STORAGE_PATH}`)
	})
})
