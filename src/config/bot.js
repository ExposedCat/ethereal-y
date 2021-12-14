import Bot from 'telegraf'

import {
    helpCommand,
    startCommand,
    actionCommand,
    anyTextMessage,
    reminderCommand,
    processTextMessage,
    regexReplaceCommand
} from '../controllers/handlers/text.js'
import { handleButtonClick } from '../controllers/handlers/button.js'


// FIXME: Move business logic to service
async function extendContext(ctx, next) {
    ctx.text = async (text, extra = {}) =>
        ctx.telegram.sendMessage(
            ctx.chat.id,
            text,
            Object.assign(extra, {
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        )
    ctx.popup = text => ctx.answerCbQuery(text, true)
    await next()
}

function setupHandlers(bot) {
    bot.use(extendContext)
    bot.on('callback_query', handleButtonClick)
    bot.on('text', processTextMessage)
    bot.command('/do', actionCommand)
    bot.command('/help', helpCommand)
    bot.command('/start', startCommand)
    bot.command('/re', regexReplaceCommand)
    bot.command('/reminder', reminderCommand)
    bot.on('text', anyTextMessage)
}

function setupBot(token) {
    console.info(`Setting up bot..`)
    const bot = new Bot(token)
    bot.catch(error => { throw error })
    setupHandlers(bot)
    console.info(`Done`)
    return bot
}


export { setupBot }