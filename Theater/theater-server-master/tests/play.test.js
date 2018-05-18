import request from 'supertest'
import { app } from '../app'
import models from '../models'
import insertCue from './lib/insertCue'
import insertActionType from './lib/insertActionType'
import insertShow from './lib/insertShow'
import insertVibrationActionType from './lib/insertVibrationActionType'
import insertDevice from './lib/insertDevice'
import insertAsset from './lib/insertAsset'
import insertAssetType from './lib/insertAssetType'

describe('Test /play route', () => {

	const actionName = 'test action'
	const actionDescription = 'test description'
	const actionDuration = 1.0
	const actionAddress = 'test address'
	const actionId = 1
	let cueId = -1
	let actionTypeId = -1
	let deviceId = -1
	let assetId = -1
	let assetTypeId = -1

	// run once, before any test in this test block is run.
	// use this to set up the testing environment
	beforeAll(async () => {
		// clear the database table
		await models.Actions.destroy({
			where: {}
		})
		const showId = await insertShow()
		cueId = await insertCue(showId)
		actionTypeId = await insertVibrationActionType(showId)
		deviceId = await insertDevice(showId)
		assetTypeId = await insertAssetType()
		assetId = await insertAsset(assetTypeId, showId)
		await models.Actions.create({
			id: actionId,
			cueId: cueId,
			name: actionName,
			description: actionDescription,
			duration: actionDuration,
			address: actionAddress,
			deviceId: deviceId,
			actionTypeId: actionTypeId,
			assetId: assetId
		})
	})

	test('It should respond 200 to GET', async () => {
		const response = await request(app).get('/play/' + cueId)
		expect(response.statusCode).toBe(200)
	})

})
