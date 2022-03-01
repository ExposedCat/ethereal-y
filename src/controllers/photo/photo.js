import { handleUaFrameCommand } from './ua-frame.js'

async function handlePhoto(ctx) {
	const command = ctx.message.caption || ''
	switch (command.split('@')[0]) {
		case '/ua_frame': {
			await handleUaFrameCommand(ctx)
			break
		}
	}
}

export { handlePhoto }
