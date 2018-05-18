import models from '../../models'

export default async function insertAssetType() {
	const assetTypeId = 100
	await models.AssetTypes.destroy({where:{}})
	await models.AssetTypes.create({
		id: assetTypeId,
		name: 'test asset type',
		mime: 'image/jpeg'
	})
	return assetTypeId
}
