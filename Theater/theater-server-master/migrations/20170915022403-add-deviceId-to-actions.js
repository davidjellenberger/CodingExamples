'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		queryInterface.addConstraint('Actions', ['deviceId'], {
			type: 'FOREIGN KEY',
			name: 'actions_deviceId_FK',
			references: {
				table: 'Devices',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}
		)
	},

	down: (queryInterface, Sequelize) => {
		queryInterface.removeConstraint('Actions', 'actions_deviceId_FK')
	}
}

