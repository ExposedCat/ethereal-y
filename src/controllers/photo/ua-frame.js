import { texts } from '../../static/texts.js'
import { downloadPhoto } from '../../services/handlers/photo/download-photo.js'
import { addFrame } from '../../services/handlers/photo/add-frame.js'

async function handleUaFrameCommand(ctx) {
	const { file_id: fileId } = ctx.message.photo[0]
	const { error } = await downloadPhoto(fileId)
	if (error !== null) {
		const { error } = await addFrame(`${fileId}.png`, 'ukraine.jpg', 1.1)
        if (error !== null) {
            await ctx.replyWithDocument({
                source: `../../../media/${fileId}.png`
            })
        } else {
            await ctx.text(texts.errors.unknownError)
        }
	} else {
		await ctx.text(texts.errors.unknownError)
	}
}

export { handleUaFrameCommand }
