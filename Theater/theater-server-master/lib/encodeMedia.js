import sizeOf from 'image-size'

export default function encodeMedia(media, type) {
	const buffer = Buffer.from(media, 'base64')
	const size = sizeOf(media)

	return {size: size, data: buffer, type: type}
}
