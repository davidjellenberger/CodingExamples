'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Cues', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			sequenceNum: {
				type: Sequelize.INTEGER
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
		return queryInterface.dropTable('Cues')
  }
}
