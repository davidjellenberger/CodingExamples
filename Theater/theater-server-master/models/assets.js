'use strict'

module.exports = (sequelize, DataTypes) => {
	const Assets = sequelize.define('Assets', {
		name: DataTypes.STRING,
		path: DataTypes.STRING,
		assetTypeId: DataTypes.STRING,
		showId: DataTypes.INTEGER
	}, {
		freezeTableName: true,
		timestamps: true
	})

	Assets.associate = (models) => {
		Assets.belongsTo(models.Shows, { as: 'show' })
		Assets.belongsTo(models.AssetTypes)
		Assets.hasMany(models.Actions)
	}

	return Assets
}
