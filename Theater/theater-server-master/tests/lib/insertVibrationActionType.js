import actionTypes from '../../lib/actionTypes'
import models from '../../models'

export default async function insertVibrationActionType() {
	const actionTypeId = actionTypes['vibratePhone']
	await models.ActionTypes.destroy({where:{}})
	await models.ActionTypes.create({
		id: actionTypeId,
		name: 'Vibration'
	})
	return actionTypeId
}
