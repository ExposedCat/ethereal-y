import Bot from 'telegraf'

import {
    helpCommand,
    startCommand,
    actionCommand,
    anyTextMessage,
    restrictCommand,
    reminderCommand,
    broadcastCommand,
    addTriggerCommand,
    processTextMessage,
    getTriggersCommand,
    regexReplaceCommand,
    removeTriggerCommand,
    anonymousMessageCommand,
    extendContext as extendTextContext
} from '../controllers/handlers/text.js'
import {
    subscribeClick,
    extendContext as extendButtonContext
} from '../controllers/handlers/button.js'


function setupHandlers(bot) {
    bot.use(extendTextContext)
    bot.on('text', processTextMessage)
    bot.command('/mute',
        async ctx => await restrictCommand(ctx, 'mute')
    )
    bot.command('/ban',
        async ctx => await restrictCommand(ctx, 'ban')
    )
    bot.command('/unmute',
        async ctx => await restrictCommand(ctx, 'removeRestrictions')
    )
    bot.command('/broadcast', broadcastCommand)
    bot.command('/bind', addTriggerCommand)
    bot.command('/unbind', removeTriggerCommand)
    bot.command('/bindings', getTriggersCommand)
    bot.command('/do', actionCommand)
    bot.command('/help', helpCommand)
    bot.command('/start', startCommand)
    bot.command('/re', regexReplaceCommand)
    bot.command('/reminder', reminderCommand)
    bot.command('/cron', reminderCommand)
    bot.hears(/\/anon ((?:.|\s)+)/, anonymousMessageCommand)
    bot.on('text', anyTextMessage)

    bot.use(extendButtonContext)
    bot.action(/subscribe_(\d)_(.+)/, subscribeClick)
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