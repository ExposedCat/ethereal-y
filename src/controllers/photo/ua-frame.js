import fs from 'fs/promises'
import { texts } from '../../static/texts.js'
import { downloadPhoto } from '../../services/handlers/photo/download-photo.js'
import { addFrame } from '../../services/handlers/photo/add-frame.js'

async function handleUaFrameCommand(ctx) {
    const { file_id: fileId } = ctx.message.photo[ctx.message.photo.length - 1]
	const { error } = await downloadPhoto(ctx.telegram, fileId)
	if (error === null) {
		const { error, data } = await addFrame(`${fileId}.png`, 'ukraine.jpg', 1.1)
        if (error === null) {
            await ctx.replyWithDocument({
                source: data
            })
            await fs.unlink(data)
        } else {
            console.trace(`Frame adding error: ${error}`)
            await ctx.text(texts.errors.unknownError)
        }
	} else {
        console.trace(`Download error: ${error}`)
		await ctx.text(texts.errors.unknownError)
	}
}

export { handleUaFrameCommand }
