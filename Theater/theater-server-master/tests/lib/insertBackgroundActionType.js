import actionTypes from '../../lib/actionTypes'
import models from '../../models'

export default async function insertBackgroundActionType() {
	const actionTypeId = actionTypes['changeBackground']
	await models.ActionTypes.destroy({where:{}})
	await models.ActionTypes.create({
		id: actionTypeId,
		name: 'background'
	})
	return actionTypeId
}
