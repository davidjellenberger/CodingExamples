import models from '../../models'

export default async function insertDevice(showId) {
	const deviceId = 100
	await models.Devices.destroy({where:{}})
	await models.Devices.create({
		id: deviceId,
		showId: showId
	})
	return showId
}
