import models from '../../models'

export default async function insertShow() {
	const showId = 100
	await models.Shows.destroy({where:{}})
	await models.Shows.create({
		id: showId,
		name: 'test show',
		director: 'test director'
	})
	return showId
}
