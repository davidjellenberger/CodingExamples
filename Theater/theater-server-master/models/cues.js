'use strict'

module.exports = (sequelize, DataTypes) => {
	const Cues = sequelize.define('Cues', {
		name: DataTypes.STRING,
		sequenceNum: DataTypes.INTEGER,
		description: DataTypes.TEXT,
	}, {
		freezeTableName: true
	})

	Cues.associate = (models) => {
		Cues.belongsTo(models.Shows, { as: 'show' })
	}

	return Cues
}
