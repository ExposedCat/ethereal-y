import { User } from '../../entities/user.js'
import { Group } from '../../entities/group.js'
import { sendTextMessage } from '../../services/extensions/context.js'

async function extendContext(ctx, next) {
	ctx.text = (text, extra) =>
		sendTextMessage(
			ctx,
			text,
			Object.assign({
				parse_mode: 'HTML',
				extra
			})
		)
	await next()
}

async function processTextMessage(ctx, next) {
	const [command, ...data] = ctx.message.text.split(' ')
	ctx.data = data
	ctx.command = command
	ctx.rawData = data.join(' ')
	ctx.isGroup = ctx.chat.id !== ctx.from.id

	ctx.user = await User.getOne(ctx.from.id, ctx.from.first_name)
	ctx.group = ctx.isGroup && (await Group.getOne(ctx.chat.id, ctx.chat.title))

	await next()
}

export { extendContext, processTextMessage }
