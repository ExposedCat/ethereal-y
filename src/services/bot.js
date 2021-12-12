import { setupBot } from '../config/bot.js'
import { token } from '../config/manifest.js'


const bot = await setupBot(token)


export {
    bot
}