import { databaseName } from './config/manifest.js'
import { connectToDatabase } from './config/database.js'

import { bot } from './services/bot.js'

import { User } from './entities/user.js'
import { Group } from './entities/group.js'
import { Reminder } from './entities/reminder.js'


await connectToDatabase(databaseName)
bot.launch()

console.info('__________')
console.info('App started')

console.info('Clearing database..')
await User.deleteMany()
await Group.deleteMany()
await Reminder.deleteMany()

console.info('Done')
console.info('__________')