import cron from 'node-schedule'

import { bot } from '../bot.js'
import { texts } from '../../static/texts.js'
import { formDate } from '../reminder.js'


function getOneReminder(Reminder, reminderId) {
    return Reminder.findOne({
        reminderId
    })
}

function updateReminderData(Reminder, updates) {
    return Reminder.updateOne({
        reminderId: this.reminderId
    }, updates)
}

async function sendReminder(Reminder) {
    console.log('+')
    console.log(this.users.length)
    if (!this.users.length) {
        console.log(`No subscribed users: deleting ${this.reminderId}`)
        await Reminder.deleteOne({
            reminderId: this.reminderId
        })
        return true
    }
    try {
        console.log(`Sending notification ${this.reminderId}`)
        await bot.telegram.sendMessage(
            this.chatId,
            texts.other.notification(this.notification)
        )
        // TODO: Add users tagging
        // for (let number = 0; number < this.users.length; number += 10) {
        //     await bot.telegram.sendMessage(
        //         this.chatId,
        //         // UserName
        //     )
        // }
        return true
    } catch (error) {
        console.error(error)
        await Reminder.deleteOne({
            reminderId: this.reminderId
        })
        return false
    }
}

async function scheduleReminder(Reminder) {
    const sourceDate = JSON.parse(this.date)
    const date = sourceDate instanceof Date ? new Date(sourceDate) : sourceDate
    const job = cron.scheduleJob(date, async () => {
        const reminder = await Reminder.getOne(this.reminderId)
        await reminder.send()
    })
    return job
}

async function createReminder({
    Reminder,
    chatId, userId, messageId,
    date, time,
    notification = time
}) {
    const formedDate = formDate(date, time)
    if (formedDate) {
        const newReminder = await Reminder.create({
            chatId,
            notification,
            users: [userId],
            date: JSON.stringify(formedDate),
            reminderId: chatId + messageId
        })
        const job = await newReminder.schedule()
        let remainderData = {
            reminderId: newReminder.reminderId
        }
        if (typeof formedDate === 'string') {
            remainderData.date = formedDate
            remainderData.nextInvocation = job.nextInvocation()
            if (!remainderData.nextInvocation) {
                await Reminder.deleteOne({
                    reminderId: newReminder.reminderId
                })
                return false
            }
        } else {
            remainderData.date = formedDate.toLocaleDateString('RU')
            remainderData.time = formedDate.toLocaleTimeString('RU')
        }
        return remainderData
    } else {
        return false
    }
}


export {
    sendReminder,
    createReminder,
    getOneReminder,
    scheduleReminder,
    updateReminderData
}