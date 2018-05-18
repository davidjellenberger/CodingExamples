'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('ActionTypes', [{
			id: 1,
			name: 'Show Image',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 2,
			name: 'Change Background Color',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 3,
			name: 'Play Video',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 4,
			name: 'Play Sound',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 5,
			name: 'Vibrate Phone',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 6,
			name: 'Open Link',
			createdAt: new Date(),
			updatedAt: new Date()
		}])
	},

  down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('ActionTypes', null, {});
  }
};
