import { setupBot } from '../config/bot.js'
import { token } from '../config/manifest.js'

const bot = setupBot(token)

export { bot }
