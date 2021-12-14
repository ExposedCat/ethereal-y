import Bot from 'telegraf'

import {
    helpCommand,
    startCommand,
    actionCommand,
    extendContext,
    anyTextMessage,
    reminderCommand,
    processTextMessage,
    regexReplaceCommand
} from '../controllers/handlers/text.js'
import { handleButtonClick } from '../controllers/handlers/button.js'


function setupHandlers(bot) {
    bot.use(extendContext)
    bot.on('callback_query', handleButtonClick)
    bot.on('text', processTextMessage)
    bot.command('/do', actionCommand)
    bot.command('/help', helpCommand)
    bot.command('/start', startCommand)
    bot.command('/re', regexReplaceCommand)
    bot.command('/reminder', reminderCommand)
    bot.command('/cron', reminderCommand)
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