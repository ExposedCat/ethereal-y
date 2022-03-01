import {
	addTrigger,
	getTriggers,
	triggerResponse,
	removeOneTrigger,
	isValidRegexTrigger
} from '../../services/handlers/text/trigger.js'
import { texts } from '../../static/texts.js'
import { Errors } from '../../entities/errors.js'
import { getRights } from '../../services/rules.js'

// TODO: Add ability to restrict triggers to be managed only
// by group admins and make it configurable via group settings

async function addDeleteTriggerCommand(ctx) {
	const { isAdmin } = await getRights(ctx.telegram, ctx.chat.id, ctx.from.id)
	if (!isAdmin) {
		await ctx.text(texts.errors.notEnoughUserRights)
		return
	}
	const caseSensitive = ctx.match[1] === '-s '
	const keyword = ctx.match[2]
	const { error, data } = await addTrigger(
		ctx.chat.id,
		keyword,
		null,
		caseSensitive
	)
	if (error) {
		switch (data) {
			default: {
				return await ctx.text(texts.errors.unknownError)
			}
		}
	} else {
		await ctx.text(texts.success.triggerAdded(keyword, true))
	}
}

async function addTriggerCommand(ctx) {
	const { isAdmin } = await getRights(ctx.telegram, ctx.chat.id, ctx.from.id)
	if (!isAdmin) {
		await ctx.text(texts.errors.notEnoughUserRights)
		return
	}
	const originalMessageId = ctx.message.reply_to_message?.message_id
	if (!originalMessageId) {
		return await ctx.text(texts.errors.noReply)
	}
	const flag = icon => ctx.match[1].includes(`-${icon} `)
	const regexTrigger = flag('r')
	if (regexTrigger) {
		const { error } = isValidRegexTrigger(regexTrigger)
		if (error !== null) {
			return await ctx.text(texts.errors.regexpError(error))
		}
	}
	const caseSensitive = flag('s')
	const keyword = ctx.match[2]
	const { error, data } = await addTrigger(
		ctx.chat.id,
		keyword,
		originalMessageId,
		caseSensitive,
		regexTrigger
	)
	if (error) {
		switch (data) {
			default: {
				return await ctx.text(texts.errors.unknownError)
			}
		}
	} else {
		await ctx.text(texts.success.triggerAdded(keyword))
	}
}

async function removeTriggerCommand(ctx) {
	const { isAdmin } = await getRights(ctx.telegram, ctx.chat.id, ctx.from.id)
	if (!isAdmin) {
		await ctx.text(texts.errors.notEnoughUserRights)
		return
	}
	const keyword = ctx.rawData
	const { error, data } = await removeOneTrigger(ctx.chat.id, keyword)
	if (error) {
		switch (data) {
			case Errors.bindingNotFound: {
				return await ctx.text(texts.errors.bindingNotFound(keyword))
			}
			default: {
				return await ctx.text(texts.errors.unknownError)
			}
		}
	} else {
		await ctx.text(texts.success.triggerRemoved(keyword))
	}
}

async function getTriggersCommand(ctx) {
	const { error, data } = await getTriggers(ctx.chat.id)
	if (error) {
		switch (data) {
			default: {
				return await ctx.text(texts.errors.unknownError)
			}
		}
	} else {
		if (data.length) {
			await ctx.text(texts.success.triggerList(data))
		} else {
			await ctx.text(texts.errors.noTriggersFound)
		}
	}
}

async function processTrigger(chatId, text, replyMessageId, api) {
	const { error, data: trigger } = await triggerResponse(chatId, text)
	if (error) {
		return false
	}
	if (trigger.deleteTrigger) {
		return await api.deleteMessage(chatId, replyMessageId)
	} else {
		return await trigger.send(replyMessageId)
	}
}

export {
	processTrigger,
	removeOneTrigger,
	addTriggerCommand,
	addDeleteTriggerCommand,
	getTriggersCommand,
	removeTriggerCommand
}
