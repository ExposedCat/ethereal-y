import { Image } from '../../../entities/image/image.js'

const mediaPath = photo => `../../../../media/${photo}`

async function addFrame(photo, frame, magnification) {
	try {
		let image = new Image(mediaPath(photo))
		await image.round()
		await image.addBackground(mediaPath(frame), magnification)
		await image.write(mediaPath(photo))
		return { error: null }
	} catch (error) {
		return { error }
	}
}

export { addFrame }
