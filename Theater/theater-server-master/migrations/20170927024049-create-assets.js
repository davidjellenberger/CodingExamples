'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.createTable('Assets', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			path: {
				type: Sequelize.STRING
			},
			assetTypeId: {
				type: Sequelize.INTEGER
			},
			showId: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			}
		})
  },

  down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Assets')
  }
};
