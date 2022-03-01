import { downloadFile } from '../../download.js'

async function downloadPhoto(api, fileId) {
	const url = await api.getFileLink(fileId)
	const response = await downloadFile(url, `${fileId}.png`)
	return response
}

export { downloadPhoto }
