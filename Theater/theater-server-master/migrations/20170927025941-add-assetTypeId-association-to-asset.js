'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addConstraint('Assets', ['assetTypeId'], {
			type: 'FOREIGN KEY',
			name: 'assets_assetTypeId_FK',
			references: {
				table: 'AssetTypes',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
  },

  down: (queryInterface, Sequelize) => {
		queryInterface.removeConstraint('Assets', 'assets_assetTypeId_FK')
  }
};
