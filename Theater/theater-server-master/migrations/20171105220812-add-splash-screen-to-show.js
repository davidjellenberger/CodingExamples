'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addColumn('Shows', 'splashScreenAssetId', Sequelize.INTEGER)
		queryInterface.addConstraint('Shows', ['splashScreenAssetId'], {
			type: 'FOREIGN KEY',
			name: 'shows_splashScreenAssetId_FK',
			references: {
				table: 'Assets',
				field: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
  },

  down: (queryInterface, Sequelize) => {
		queryInterface.removeColumn('Shows', 'splashScreenAssetId')
		queryInterface.removeConstraint('Shows', 'shows_splashScreenAssetId_FK')
  }
};
