'use strict'

module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('Users', {
		isAdmin: DataTypes.BOOLEAN,
		deviceType: DataTypes.STRING,
		seat: DataTypes.STRING,
		ipAddress: DataTypes.STRING,
		firstName: DataTypes.STRING,
		lastName: DataTypes.STRING,
		email: DataTypes.STRING
	}, {
		freezeTableName: true
	})

	return Users
}
