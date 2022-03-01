import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

function mediaPath(savePath) {
	const thisUrl = fileURLToPath(import.meta.url)
	const relativeMediaFolder = '../../../media'
	return path.resolve(thisUrl, relativeMediaFolder, savePath)
}

async function downloadFile(url, savePath) {
	const response = await axios({
		url,
		responseType: 'stream'
	})

	try {
		await new Promise((resolve, reject) => {
			response.data
				.pipe(fs.createWriteStream(mediaPath(savePath)))
				.on('finish', resolve)
				.on('error', reject)
		})

		return { error: null }
	} catch (error) {
		return { error }
	}
}

export { downloadFile }
