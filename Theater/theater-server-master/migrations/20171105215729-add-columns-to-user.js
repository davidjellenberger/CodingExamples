'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		queryInterface.addColumn('Users', 'firstName', Sequelize.STRING)
		queryInterface.addColumn('Users', 'lastName', Sequelize.STRING)
		queryInterface.addColumn('Users', 'email', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
		queryInterface.removeColumn('Users', 'firstName')
		queryInterface.removeColumn('Users', 'lastName')
		queryInterface.removeColumn('Users', 'email')
  }
};
