import { texts } from '../static/texts.js'

import { Errors } from '../entities/errors.js'

import { help } from '../services/handlers/text/help.js'
import { start } from '../services/handlers/text/start.js'
import { action } from '../services/handlers/text/action.js'
import { getGroupIds } from '../services/handlers/text/broadcast.js'
import { regexpReplace } from '../services/handlers/text/regexp-replace.js'
import { anonymousMessage } from '../services/handlers/text/anonymous-message.js'
import { executeInUnsafeVM } from '../services/vm-eval.js'
import { Group } from '../entities/group.js'
import { User } from '../entities/user.js'
import { creatorId } from '../config/manifest.js'

async function startCommand(ctx) {
	const response = await start(ctx.user)
	await ctx.text(response)
}

async function helpCommand(ctx) {
	const response = await help()
	await ctx.text(response)
}

async function actionCommand(ctx) {
	const actionMessage = await action(ctx.rawData, ctx.from.first_name)
	await ctx.text(actionMessage)
	try {
		await ctx.deleteMessage()
	} catch {
		// Never mind if I can't delete it
	}
}

async function regexReplaceCommand(ctx) {
	const reply = ctx.message.reply_to_message
	if (!reply) {
		await ctx.text(texts.errors.noReply)
		return
	}
	const { error, data } = await regexpReplace(ctx.rawData, reply.text)
	if (error) {
		if (data === Errors.invalidSyntax) {
			await ctx.text(texts.errors.invalidSyntax)
		} else {
			await ctx.text(texts.errors.regexpError(data))
		}
	} else {
		if (data) {
			await ctx.text(data, {
				reply_to_message_id: reply.message_id
			})
		} else {
			await ctx.text(texts.errors.messageTextIsEmpty)
		}
	}
}

async function broadcastCommand(ctx) {
	if (!ctx.user.fullRights) {
		return await ctx.text(texts.errors.notEnoughUserRights)
	}
	const originalMessageId = ctx.message.reply_to_message?.message_id
	if (!originalMessageId) {
		return await ctx.text(texts.errors.noReply)
	}
	const groupIds = await getGroupIds()
	let sent = 0
	for (const groupId of groupIds) {
		try {
			await ctx.telegram.copyMessage(
				groupId,
				ctx.chat.id,
				originalMessageId
			)
			sent++
		} catch ({ message }) {
			console.info(`Can't broadcast message: ${message}`)
			// Never mind if I can't send it
		}
	}
	if (sent) {
		await ctx.text(texts.success.broadcastDone(sent))
	} else {
		await ctx.text(texts.errors.noGroupsToBroadcast)
	}
}

async function evalMessageCommand(ctx) {
	if (ctx.from.id !== creatorId) {
		// Do not allow regular users to execute code (unsafe)
		// Never remove this
		return
	}
	const code = ctx.message.text.replace('!js', '')
	const result = executeInUnsafeVM(code, ctx)
	await ctx.text(texts.success.executeJS(result))
}

async function anonymousMessageCommand(ctx) {
	const messageText = await anonymousMessage(ctx.match[1])
	await ctx.text(messageText)
	try {
		await ctx.deleteMessage()
	} catch {
		// Ignore
	}
}

async function mentionEveryoneCommand(ctx) {
	const group = await Group.getOne(ctx.chat.id, ctx.chat.title)
	const userIds = group?.users ?? []
	const users = await User.getNames(userIds)

	const sendPack = userPack => ctx.reply(
		userPack
			.map(user => `<a href="tg://user?id=${user.userId}">@${user.name}</a>`)
			.join(' '),
		{
			reply_to_message_id: ctx.message.message_id,
			parse_mode: 'HTML'
		}
	)

	try {
		let pack = []
		for (const user of users) {
			pack.push(user)
			if (pack.length === 10) {
					await sendPack(pack)
					pack = []
			}
		}
		if (pack.length) {
			await sendPack(pack)
		}
	} catch {
		// NOTE: Message was deleted
		return
	}
}

export {
	handleVote,
	restrictCommand,
	voteForBanCommand
} from './text/restrictions.js'

export { extendContext, processTextMessage } from './text/extends.js'

export { pairOfTheDayCommand } from './text/daily-pair.js'

export {
	removeOneTrigger,
	addTriggerCommand,
	addDeleteTriggerCommand,
	getTriggersCommand,
	removeTriggerCommand
} from './text/triggers.js'

export { anyTextMessage } from './text/any-message.js'

export { reminderCommand } from './text/reminders.js'

export {
	helpCommand,
	startCommand,
	actionCommand,
	broadcastCommand,
	regexReplaceCommand,
	anonymousMessageCommand,
	mentionEveryoneCommand,
	evalMessageCommand
}
