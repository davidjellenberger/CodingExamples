import models from '../../models'

export default async function insertActionType() {
	const actionTypeId = 100
	await models.ActionTypes.destroy({where:{}})
	await models.ActionTypes.create({
		id: actionTypeId,
		name: 'test actiontype'
	})
	return actionTypeId
}
