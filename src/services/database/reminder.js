import cron from 'node-schedule'

import { User } from '../../entities/user.js'

import { bot } from '../bot.js'
import { formDate } from '../reminder.js'
import { texts } from '../../static/texts.js'
import { errors } from '../../entities/errors.js'


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
    if (!this.users.length) {
        await Reminder.deleteOne({
            reminderId: this.reminderId
        })
        return true
    }
    try {
        await bot.telegram.sendMessage(
            this.chatId,
            texts.other.notification(this.notification)
        )
        const users = await User.getNames(this.users)
        const template = ({ userId, name }) => `<a href="tg://user?id=${userId}">@${name}</a>`
        for (let number = 0; number < this.users.length; number += 10) {
            const usernames = users
                .slice(number, number + 10)
                .map(template)
                .join(', ')

            await bot.telegram.sendMessage(
                this.chatId,
                usernames,
                { parse_mode: 'HTML' }
            )
        }
        return true
    } catch (error) {
        console.error(error)
        await Reminder.deleteOne({
            reminderId: this.reminderId
        })
        return false
    }
}

async function scheduleReminder(Reminder, isDateTime) {
    let date = isDateTime ? new Date(this.date) : this.date
    const jobFunction = async () => {
        const reminder = await Reminder.getOne(this.reminderId)
        await reminder.send()
    }
    const job = cron.scheduleJob(date, jobFunction)
    return { job }
}

async function createReminder({
    Reminder,
    chatId, userId, messageId,
    date, time,
    notification
}, isDateTime) {
    const { error, data: formedDate } = formDate(date, time)
    if (error) {
        return { error, data: formedDate }
    }
    const stringDate = isDateTime ? formedDate.toISOString() : formedDate
    const newReminder = await Reminder.create({
        chatId,
        notification,
        users: [userId],
        date: stringDate,
        reminderId: chatId + messageId
    })
    const { job } = await newReminder.schedule(isDateTime)
    if (!job) {
        await Reminder.deleteOne({
            reminderId: newReminder.reminderId
        })
        return {
            error: true,
            data: isDateTime ? errors.invalidDate : errors.invalidCron
        }
    }
    let reminderData = {
        date: null,
        time: void 0,
        nextInvocation: void 0,
        reminderId: newReminder.reminderId
    }
    if (typeof formedDate === 'string') {
        reminderData.date = formedDate
        reminderData.nextInvocation = job.nextInvocation().toDate()
    } else {
        reminderData.date = formedDate.toLocaleDateString('RU')
        reminderData.time = formedDate.toLocaleTimeString('RU')
    }
    return {
        error: false,
        data: reminderData
    }
}


export {
    sendReminder,
    createReminder,
    getOneReminder,
    scheduleReminder,
    updateReminderData
}