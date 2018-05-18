'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addColumn('Actions', 'assetId', Sequelize.INTEGER)
		queryInterface.addConstraint('Actions', ['assetId'], {
			type: 'FOREIGN KEY',
			name: 'action_assetId_FK',
			references: {
				table: 'Assets',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
  },

  down: (queryInterface, Sequelize) => {
		queryInterface.removeColumn('Actions', 'assetId')
		queryInterface.removeConstraint('Actions', 'action_assetId_FK')
  }
};
