import actionTypes from '../../lib/actionTypes'
import models from '../../models'

export default async function insertVideoActionType() {
	const actionTypeId = actionTypes['playVideo']
	await models.ActionTypes.destroy({where:{}})
	await models.ActionTypes.create({
		id: actionTypeId,
		name: 'Video'
	})
	return actionTypeId
}
