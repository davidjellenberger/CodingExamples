import models from '../../models'

export default async function insertAsset(assetTypeId, showId) {
	const assetId = 100
	await models.Assets.destroy({where:{}})
	await models.Assets.create({
		id: assetId,
		name: 'test asset',
		path: null,
		assetTypeId: assetTypeId,
		showId: showId,
		redValue: 100,
		greenValue: 100,
		blueValue: 100,
	})
	return assetId
}
