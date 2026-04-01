import sharp from "sharp";
import {
	addImageBackground,
	getImageSize,
	roundImage,
	writeImage,
} from "../../services/image.js";

class Image {
	constructor(path) {
		this.path = path;
		this.size = null;
		try {
			this.image = sharp(path).png();
		} catch (error) {
			console.error(`Can't create Image instance: ${error}`);
		}
	}

	getSize = getImageSize.bind(this);
	write = writeImage.bind(this);
	round = roundImage.bind(this);
	addBackground = addImageBackground.bind(this);
}

export { Image };
