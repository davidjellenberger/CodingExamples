'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addConstraint('Assets', ['showId'], {
			type: 'FOREIGN KEY',
			name: 'assets_showId_FK',
			references: {
				table: 'Shows',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
  },

  down: (queryInterface, Sequelize) => {
		queryInterface.removeConstraint('Assets', 'assets_showId_FK')
  }
};
