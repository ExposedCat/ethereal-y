import { token, databaseName } from './config/manifest.js'
import { connectToDatabase } from './config/database.js'
import { setupBot } from './config/bot.js'

import { handleTextMessage } from './controllers/handlers/text.js'
import { handleButtonClick } from './controllers/handlers/button.js'

import { User } from '../src/entities/user.js'
import { Group } from '../src/entities/group.js'


await connectToDatabase(databaseName)
const bot = await setupBot(token)

bot.on('text', handleTextMessage)
bot.on('callback_query', handleButtonClick)
bot.launch()

console.info('__________')
console.info('App started')

console.info('Clearing database..')
await User.deleteMany()
await Group.deleteMany()

console.info('Done')
console.info('__________')