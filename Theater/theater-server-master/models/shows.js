'use strict'

module.exports = (sequelize, DataTypes) => {
	const Shows = sequelize.define('Shows', {
		name: DataTypes.STRING,
		director: DataTypes.STRING,
		splashScreenAssetId: DataTypes.INTEGER
	}, {
		freezeTableName: true
	})

	Shows.associate = (models) => {
		Shows.hasOne(models.Assets)
	}

	return Shows
}
