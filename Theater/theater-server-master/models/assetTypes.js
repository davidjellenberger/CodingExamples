'use strict'

module.exports = (sequelize, DataTypes) => {
	const AssetTypes = sequelize.define('AssetTypes', {
		name: DataTypes.STRING,
		mime: DataTypes.STRING
	}, {
		freezeTableName: true,
		timestamps: true
	})

	return AssetTypes
}
