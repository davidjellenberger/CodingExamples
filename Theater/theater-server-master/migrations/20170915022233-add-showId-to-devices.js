'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addConstraint('Devices', ['showId'], {
			type: 'FOREIGN KEY',
			name: 'devices_showId_FK',
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
		queryInterface.removeConstraint('Devices', 'devices_showId_FK')
  }
}
