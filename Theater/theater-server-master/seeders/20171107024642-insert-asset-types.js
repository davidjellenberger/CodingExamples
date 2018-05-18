'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('AssetTypes', [{
			id: 1,
			name: 'JPEG Image',
			mime: 'image/jpeg',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 2,
			name: 'PNG Image',
			mime: 'image/png',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 3,
			name: 'Background Color',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 4,
			name: 'MP3 Sound',
			mime: 'audio/mpeg3',
			createdAt: new Date(),
			updatedAt: new Date()
		}, {
			id: 5,
			name: 'MP4 Video',
			mime: 'video/mp4',
			createdAt: new Date(),
			updatedAt: new Date()
		}])
  },

  down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('AssetTypes', null, {});
  }
};
