import Bot from 'telegraf'

import * as text from '../controllers/text.js'
import * as button from '../controllers/button.js'
import { handleNewMembers } from '../controllers/new-members.js'


function setupHandlers(bot) {
    bot.use(text.extendContext)
    bot.on('text', text.processTextMessage)
    bot.command('/mute',
        async ctx => await text.restrictCommand(ctx, 'mute')
    )
    bot.command('/ban',
        async ctx => await text.restrictCommand(ctx, 'ban')
    )
    bot.command('/unmute',
        async ctx => await text.restrictCommand(ctx, 'removeRestrictions')
    )
    bot.command('/broadcast', text.broadcastCommand)
    bot.command('/bind', text.addTriggerCommand)
    bot.command('/unbind', text.removeTriggerCommand)
    bot.command('/bindings', text.getTriggersCommand)
    bot.command('/do', text.actionCommand)
    bot.command('/help', text.helpCommand)
    bot.command('/start', text.startCommand)
    bot.command('/re', text.regexReplaceCommand)
    bot.command('/reminder', text.reminderCommand)
    bot.command('/cron', text.reminderCommand)
    bot.command(['/voteban', '/votemute'], text.voteForBanCommand)
    bot.hears(/\/anon ((?:.|\s)+)/, text.anonymousMessageCommand)
    bot.on('text', text.anyTextMessage)

    bot.use(button.extendContext)
    bot.action(/captcha_(\d+)/, button.captchaClick)
    bot.action(/subscribe_(\d)_(.+)/, button.subscribeClick)
    
    bot.on('new_chat_members', handleNewMembers)
    bot.on('poll', text.handleVote)
}

function setupBot(token) {
    console.info(`Setting up bot..`)

    const bot = new Bot(token)
    bot.catch(console.trace)
    setupHandlers(bot)

    console.info(`Done`)
    return bot
}


export { setupBot }