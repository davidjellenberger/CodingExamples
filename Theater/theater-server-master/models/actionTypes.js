'use strict'

module.exports = (sequelize, DataTypes) => {
	const ActionTypes = sequelize.define('ActionTypes', {
		name: DataTypes.STRING
	}, {
		freezeTableName: true
	})

	return ActionTypes
}
