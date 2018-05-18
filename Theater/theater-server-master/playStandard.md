# CSCI 390
## Theater Mobile Client 
### Proposed Messaging Schema

In order to facilitate the our communication, we need to define a standard for how we're going to be sending data over the network. We have already settled on the Socket.io implementation of web sockets. This does not change that agreement. We have yet to define, however, the data schema that we will use over the socket. Here I present the basic actions that we have settled on implementing first, and the information that the server will send to the client over the socket, encoded as JSON data, for the mobile clients to consume and display to the user.

I also propose that we use different `emit()` types for each different action that the phone can take, which should make it more clear what the action being requested is. One partial example of a socket reception implementation would be:
```
socket.on('backgroundColor', (json) => {
	// operate on the JSON data, changing the backgroud 
	// color according to parameters in the JSON
})

socket.on('vibrate', (json) => {
	// vibrate the phone
})

```
Here are the different JSON objects with their parameters that I'm thinking we need to send:

Vibrate:
```
{
	"type": 5,
	"duration": <an integer, in milliseconds, telling the phone how long to vibrate for>
}
```
Background Color:
```
{
	"type": 2,
	"data": {
		"red": <an integer, 0-255, representing red saturation>
		"green": <an integer, 0-255, representing green saturation>
		"blue": <an integer, 0-255, representing blue saturation>
	},
}
```

Image:
```
{
	"type": 1,
	"data": <data for actions that need it (video, image, sound), encoded in base 64>,
	"encoding": <the original file format of the image>,
}
```

Audio:
```
{
	"type": 4,
	"data": <data for actions that need it (video, image, sound), encoded in base 64>,
	"encoding": <the original file format of the audio>,
}
```

Video:
```
{
	"type": 3,
	"data": <data for actions that need it (video, image, sound), encoded in base 64>,
	"encoding": <the original file format of the video>,
}
```
