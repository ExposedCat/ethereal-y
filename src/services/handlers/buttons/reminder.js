import { Errors } from '../../../entities/errors.js'
import { Reminder } from '../../../entities/reminder.js'


async function subscribe(userId, reminderId, state) {
    const reminder = await Reminder.getOne(reminderId)
    if (reminder) {
        return reminder.updateSubscriber(userId, state)
    } else {
        return {
            error: true,
            data: Errors.nonExistentReminder
        }
    }
}


export { subscribe }