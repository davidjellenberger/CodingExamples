import actionTypes from '../../lib/actionTypes'
import models from '../../models'

export default async function insertSoundActionType() {
	const actionTypeId = actionTypes['playSound']
	await models.ActionTypes.destroy({where:{}})
	await models.ActionTypes.create({
		id: actionTypeId,
		name: 'Sound'
	})
	return actionTypeId
}
