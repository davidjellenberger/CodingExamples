'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		queryInterface.addConstraint('Actions', ['cueId'], {
			type: 'FOREIGN KEY',
			name: 'actions_cueId_FK',
			references: {
				table: 'Cues',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}
		)
	},

	down: (queryInterface, Sequelize) => {
		queryInterface.removeConstraint('Actions', 'actions_cueId_FK')
	}
}
