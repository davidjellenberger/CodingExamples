'use strict'

module.exports = (sequelize, DataTypes) => {
	const Actions = sequelize.define('Actions', {
		address: DataTypes.STRING,
		duration: DataTypes.DECIMAL,
		name: DataTypes.STRING,
		description: DataTypes.TEXT,
		cueId: DataTypes.INTEGER,
		actionTypeId: DataTypes.INTEGER,
		assetId: DataTypes.INTEGER,
		deviceId: DataTypes.INTEGER
	}, {
		freezeTableName: true,
		timestamps: true
	})

	Actions.associate = (models) => {
		Actions.belongsTo(models.Cues)
		Actions.belongsTo(models.ActionTypes)
		Actions.belongsTo(models.Devices)
		Actions.belongsTo(models.Assets)
	}

	return Actions
}
