import Bot from 'telegraf'

import * as text from '../controllers/text.js'
import * as button from '../controllers/button.js'
import { handleNewMembers } from '../controllers/new-members.js'
import { handlePhoto } from '../controllers/photo/photo.js'

async function extendContextWithSelf(bot) {
	const self = await bot.telegram.getMe()
	bot.context.self = self
}

function setupHandlers(bot) {
	bot.use(text.extendContext)
	bot.on('text', text.processTextMessage)
	bot.command('/mute', async ctx => await text.restrictCommand(ctx, 'mute'))
	bot.command('/ban', async ctx => await text.restrictCommand(ctx, 'ban'))
	bot.command(
		'/unmute',
		async ctx => await text.restrictCommand(ctx, 'removeRestrictions')
	)
	bot.command('/broadcast', text.broadcastCommand)
	bot.hears(/\/bind ((?:-. )*)((?:.|\s)+)/, text.addTriggerCommand)
	bot.hears(/\/bind_delete (-s )?((?:.|\s)+)/, text.addDeleteTriggerCommand)
	bot.command('/unbind', text.removeTriggerCommand)
	bot.command('/bindings', text.getTriggersCommand)
	bot.command('/do', text.actionCommand)
	bot.command('/help', text.helpCommand)
	bot.command('/start', text.startCommand)
	bot.command('/re', text.regexReplaceCommand)
	bot.command('/cron', text.reminderCommand)
	bot.command('/pair', text.pairOfTheDayCommand)
	bot.command(['/voteban', '/votemute'], text.voteForBanCommand)
	bot.hears(/^\+(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)? (.+)$/, text.reminderCommand)
	bot.hears(/\/anon ((?:.|\s)+)/, text.anonymousMessageCommand)
	bot.hears('@all', text.mentionEveryoneCommand)
	bot.on('text', text.anyTextMessage)

	bot.use(button.extendContext)
	bot.action(/captcha_(\d+)/, button.captchaClick)
	bot.action(/subscribe_(\d)_(.+)/, button.subscribeClick)

	bot.on('new_chat_members', handleNewMembers)
	bot.on('poll', text.handleVote)

	bot.on('photo', handlePhoto)
}

function setupBot(token) {
	console.info(`Setting up bot..`)

	const bot = new Bot(token)
	bot.catch(console.trace)
	setupHandlers(bot)

	console.info(`Done`)
	return bot
}

export { setupBot, extendContextWithSelf }
