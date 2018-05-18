import models from './models'
import fs from 'fs'
import encodeMedia from './lib/encodeMedia'
import sendImage from './lib/sendImage'

exports = module.exports = (io) => {
	io.sockets.on('connection', (socket) => {
		// send the splash screen to the socket
		// we expect that the client will provide us the id of the show that they are watching in the query portion of the handshake
		let handshake = socket.handshake
		let socketId = socket.id
		console.log(handshake.query)
		if (handshake.query) {
			let showId = handshake.query.showId
			models.Show.findOne({
				where: {
					showId: showId
				},
				include: [
					{
						model: models.Assets,
						include: [
							{
								model: models.AssetTypes
							}
						]
					}
				]
			})
			.then((show) => {
				// send the splash screen to the client
				sendImage(show, socketId)
			})
		} else {
			// nothing in the query, so we can't send the splash screen
			return
		}

	})
}
