'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Devices', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			address: {
				type: Sequelize.STRING
			},
			name: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			showId: {
				allowNull: false,
				type: Sequelize.INTEGER
			}
		})
  },

  down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Devices')
  }
}
