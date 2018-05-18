import models from '../../models'
import insertShow from './insertShow'
export default async function insertCue(showId) {
	const cueId = 100
	await models.Cues.destroy({where:{}})
	await models.Cues.create({
		id: cueId,
		name: 'test cue',
		description: 'test description',
		sequenceNum: 1,
		showId: showId
	})
	return cueId
}
