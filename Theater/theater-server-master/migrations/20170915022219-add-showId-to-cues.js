'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		queryInterface.addConstraint('Cues', ['showId'], {
			type: 'FOREIGN KEY',
			name: 'cues_showId_FK',
			references: {
				table: 'Shows',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}
		)
	},

	down: (queryInterface, Sequelize) => {
		queryInterface.removeConstraint('Cues', 'cues_showId_FK')
	}
}

