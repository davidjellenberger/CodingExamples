'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			isAdmin: {
				type: Sequelize.BOOLEAN
			},
			deviceType: {
				type: Sequelize.STRING
			},
			seat: {
				type: Sequelize.STRING
			},
			ipAddress: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		})
  },

  down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Users')
  }
}
