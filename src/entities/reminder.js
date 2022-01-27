import mongoose from 'mongoose'
const { Schema, model } = mongoose

import {
    sendReminder,
    createReminder,
    getOneReminder,
    updateSubscriber,
    scheduleReminder,
    updateReminderData
} from '../services/database/reminder.js'


const ReminderSchema = new Schema({
    reminderId: {
        type: Number,
        required: true,
        unique: true
    },
    notification: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    subscribers: {
        type: [Number],
        required: true,
        default: []
    },
    chatId: {
        type: Number,
        required: true
    }
})

class ReminderClass {
    static getOne(reminderId) {
        return getOneReminder(Reminder, reminderId)
    }
    static createNew(data, isDateTime) {
        return createReminder(data, isDateTime)
    }
    updateSubscriber(userId, state) {
        return updateSubscriber.bind(this)(Reminder, userId, state)
    }
    updateData(updates) {
        return updateReminderData.bind(this)(Reminder, updates)
    }
    schedule(isDateTime) {
        return scheduleReminder.bind(this)(Reminder, isDateTime)
    }
    send() {
        return sendReminder.bind(this)(Reminder)
    }
}

ReminderSchema.loadClass(ReminderClass)
const Reminder = model('Reminder', ReminderSchema)


export { Reminder }