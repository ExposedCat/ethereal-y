import path from "node:path";
import { fileURLToPath } from "node:url";
import { Image } from "../../../entities/image/image.js";

function mediaPath(filePath) {
	const thisUrl = fileURLToPath(import.meta.url);
	const relativeMediaFolder = "../../../../../media";
	return path.resolve(thisUrl, relativeMediaFolder, filePath);
}

async function addFrame(photo, frame, magnification) {
	try {
		const absolutePhotoPath = mediaPath(photo);
		const image = new Image(absolutePhotoPath);
		await image.round();
		await image.addBackground(mediaPath(frame), magnification);
		await image.write(absolutePhotoPath);
		return {
			error: null,
			data: absolutePhotoPath,
		};
	} catch (error) {
		return { error };
	}
}

export { addFrame };
