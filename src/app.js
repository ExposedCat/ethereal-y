import { databaseName } from './config/manifest.js'
import { connectToDatabase } from './config/database.js'

import { handleTextMessage } from './controllers/handlers/text.js'
import { handleButtonClick } from './controllers/handlers/button.js'

import { bot } from './services/bot.js'
import { User } from './entities/user.js'
import { Group } from './entities/group.js'
import { Reminder } from './entities/reminder.js'


await connectToDatabase(databaseName)

bot.on('text', handleTextMessage)
bot.on('callback_query', handleButtonClick)
bot.launch()

console.info('__________')
console.info('App started')

console.info('Clearing database..')
await User.deleteMany()
await Group.deleteMany()
await Reminder.deleteMany()

console.info('Done')
console.info('__________')