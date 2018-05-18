'use strict'

module.exports = (sequelize, DataTypes) => {
	const Devices = sequelize.define('Devices', {
		address: DataTypes.STRING,
		name: DataTypes.STRING,
		description: DataTypes.TEXT
	}, {
		freezeTableName: true
	})

	Devices.associate = (models) => {
		Devices.belongsTo(models.Shows, { as: 'show' })
	}

	return Devices
}
