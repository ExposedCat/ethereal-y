import sharp from 'sharp'
import { Circle } from '../entities/image/circle.js'

async function addImageBackground(backgroundPath, magnification) {
	try {
		const imageSize = await this.getSize()
		const backgroundSize = (imageSize * magnification) | 0
		const background = sharp(backgroundPath).resize(
			backgroundSize,
			backgroundSize
		)
		const imageBuffer = await this.image.toBuffer()
		this.image = background
			.composite([
				{
					input: imageBuffer
				}
			])
			.png()
	} catch (error) {
		console.error(`Can't add background for Image: ${error}`)
	}
}

async function roundImage() {
	const imageSize = await this.getSize()
	try {
		const sourceImage = sharp(this.path).resize(imageSize, imageSize)

		const circle = await Circle(imageSize).toBuffer()
		this.image = sourceImage
			.composite([
				{
					input: circle,
					blend: 'dest-in'
				}
			])
			.png()

		return this.image
	} catch (error) {
		console.error(`Can't round Image: ${error}`)
	}
}

async function getImageSize() {
	if (this.size === null) {
		const { width, height } = await this.image.metadata()
		this.size = Math.min(width, height) | 0
	}
	return this.size
}

async function writeImage(path) {
	try {
		await this.image.toFile(path)
	} catch (error) {
		console.error(`Can't write Image to file: ${error}`)
	}
}

export { writeImage, getImageSize, roundImage, addImageBackground }
