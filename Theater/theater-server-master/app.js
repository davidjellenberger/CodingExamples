import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import models from './models'
import moment from 'moment'
import fileUpload from 'express-fileupload'
import { MAX_FILE_SIZE, USER_FILE_STORAGE_PATH } from './config'

import actions from './routes/actions'
import upload from './routes/upload'
import actionTypes from './routes/actionTypes'
import cues from './routes/cues'
import devices from './routes/devices'
import shows from './routes/shows'
import users from './routes/users'
import play from './routes/play'

import encodeImage from './lib/encodeImage'
let app = express()

// set up the server using Node's standard HTTP server so that Socket.io can use it too
let server = require('http').Server(app)
let io = require('socket.io')(server) // give socket.io a reference to the HTTP server

io.on('connection', (socket) => {
	// send the splash screen to the socket
	// we expect that the client will provide us the id of the show that they are watching in the query portion of the handshake
	let handshake = socket.handshake
	let socketId = socket.id
	console.log(handshake.query)
	if (handshake.query) {
		let showId = handshake.query.showId
		models.Shows.findOne({
			where: {
				id: showId
			}
		})
		.then((show) => {
			models.Assets.findOne({
				where: {
					id: show.dataValues.splashScreenAssetId
				},
				include: [
					{
						model: models.AssetTypes
					}
				]
			})
			.then((asset) => {
				// send the splash screen to the client
				io.to(socketId).emit('json emission', encodeImage(asset))
			})
		})
	} else {
		// nothing in the query, so we can't send the splash screen
		return
	}
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// setup the file upload plugin
app.use(fileUpload({
	limits: {
		fileSize: MAX_FILE_SIZE
	},
	safeFileNames: true,
	preserveExtension: true
}))

// Add headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
})

// Plural API routes
app.use('/actions', actions)
app.use('/actiontypes', actionTypes)
app.use('/cues', cues)
app.use('/devices', devices)
app.use('/shows', shows)
app.use('/users', users)
app.use('/uploads', upload)
app.use('/plays', play)

// API routes
app.use('/action', actions)
app.use('/actiontype', actionTypes)
app.use('/cue', cues)
app.use('/device', devices)
app.use('/show', shows)
app.use('/user', users)
app.use('/upload', upload)
app.use('/play', play)

// Static file serving
app.use('/public', express.static(USER_FILE_STORAGE_PATH.substring(2))) // substring so that the './' at the start of the path is removed

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
})

// attach socket.io to the global app object
app.io = io

export { app, server }
