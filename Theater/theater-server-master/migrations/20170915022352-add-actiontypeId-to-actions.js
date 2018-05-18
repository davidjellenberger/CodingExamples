'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addConstraint('Actions', ['actionTypeId'], {
			type: 'FOREIGN KEY',
			name: 'actions_actionTypeId_FK',
			references: {
				table: 'ActionTypes',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}
		)
  },

  down: (queryInterface, Sequelize) => {
		queryInterface.removeConstraint('Actions', 'actions_actionTypeId_FK')
  }
}
