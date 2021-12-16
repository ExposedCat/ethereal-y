import { databaseName } from './config/manifest.js'
import { connectToDatabase } from './config/database.js'

import { bot } from './services/bot.js'

import { User } from './entities/user.js'
import { Group } from './entities/group.js'
import { Trigger } from './entities/trigger.js'
import { Reminder } from './entities/reminder.js'


console.info('Connecting to database..')
try {
    await connectToDatabase(databaseName)
} catch (error) {
    console.error('CRITICAL: Cannot connect to database:')
    console.error(error)
    process.exit()
}
console.info('Done')

console.info('Clearing database..')
await User.deleteMany()
await Group.deleteMany()
await Trigger.deleteMany()
await Reminder.deleteMany()
console.info('Done')

console.info('Starting bot..')
bot.launch()
console.info('Done')
console.info('-----------')
console.info('App started')
console.info('-----------')