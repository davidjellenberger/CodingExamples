import encodeAudio from '../lib/encodeAudio' // import the function to be tested
import { SERVER_ADDRESS } from '../config'

describe('Test encoding of audio', () => {

	const mime = 'audio/mp3'
	const filePath = 'tests/testFiles/test_audio_1.mp3'
	const action = {
		Asset: {
			dataValues: {
				path: filePath,
				AssetType: {
					dataValues: {
						mime: mime
					}
				}
			}
		}
	}

	test('It should encode encode JSON with the right data', () => {
		let json = JSON.parse(encodeAudio(action))

		expect(json.sound).toBe(`http://${SERVER_ADDRESS}/public/${filePath}`)
		expect(json.mime).toBe(mime)
		expect(json.action).toBe('audio')
		expect(json.sound_bool).toBe(true)
		expect(json.vibrate_bool).toBe(false)
		expect(json.vibrate_length).toBe(0)
	})

})
