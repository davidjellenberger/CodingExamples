'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addColumn('Assets', 'redValue', Sequelize.INTEGER)
		queryInterface.addColumn('Assets', 'greenValue', Sequelize.INTEGER)
		queryInterface.addColumn('Assets', 'blueValue', Sequelize.INTEGER)
  },

  down: (queryInterface, Sequelize) => {
		queryInterface.removeColumn('Assets', 'redValue')
		queryInterface.removeColumn('Assets', 'greenValue')
		queryInterface.removeColumn('Assets', 'blueValue')
  }
};
