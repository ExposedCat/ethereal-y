import cron from 'node-schedule'

import { User } from '../../entities/user.js'

import { bot } from '../bot.js'
import { texts } from '../../static/texts.js'
import { buttons } from '../../static/buttons.js'
import { Errors } from '../../entities/errors.js'
import { formDate } from '../handlers/text/reminder.js'

function getOneReminder(Reminder, reminderId) {
	return Reminder.findOne({
		reminderId
	})
}

function updateReminderData(Reminder, updates) {
	return Reminder.updateOne(
		{
			reminderId: this.reminderId
		},
		updates
	)
}

async function sendReminder(Reminder) {
	if (!this.subscribers.length) {
		await Reminder.deleteOne({
			reminderId: this.reminderId
		})
		return true
	}
	let success = true
	try {
		const keyboard = buttons.reminderSubscription(
			this.reminderId,
			this.subscribers.length
		)
		await bot.telegram.sendMessage(
			this.chatId,
			texts.other.notification(this.notification),
			keyboard
		)
		const subscribers = await User.getNames(this.subscribers)
		const template = ({ userId, name }) =>
			`<a href="tg://user?id=${userId}">@${name}</a>`

		const { length } = this.subscribers
		for (let number = 0; number < length; number += 10) {
			const usernames = subscribers
				.slice(number, number + 10)
				.map(template)
				.join(', ')

			await bot.telegram.sendMessage(this.chatId, usernames, {
				parse_mode: 'HTML'
			})
		}
	} catch {
		success = false
	}

	if (!success || Number(this.date)) {
		await Reminder.deleteOne({
			reminderId: this.reminderId
		})
	}

	return success
}

async function scheduleReminder(Reminder, isDateTime) {
	let date = isDateTime ? new Date(this.date) : this.date
	const jobFunction = async () => {
		const reminder = await Reminder.getOne(this.reminderId)
		if (reminder) {
			await reminder.send()
		} else {
			cron.cancelJob(this.reminderId).toString()
		}
	}
	const job = cron.scheduleJob(this.reminderId.toString(), date, jobFunction)
	return { job }
}

async function createReminder(
	{ Reminder, chatId, userId, messageId, date, time, notification },
	isDateTime
) {
	let stringDate
	if (isDateTime) {
		stringDate = date.toISOString()
	} else {
		const { error, data: formedDate } = formDate(date, time)
		if (error) {
			return { error, data: formedDate }
		}
		stringDate = isDateTime ? formedDate.toISOString() : formedDate
	}
	const newReminder = await Reminder.create({
		chatId,
		notification,
		subscribers: [userId],
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
			data: isDateTime ? Errors.invalidDate : Errors.invalidCron
		}
	}
	let reminderData = {
		date: null,
		time: void 0,
		nextInvocation: void 0,
		reminderId: newReminder.reminderId
	}
	if (isDateTime) {
		reminderData.date = new Date(stringDate).toLocaleDateString('RU')
		reminderData.time = new Date(stringDate).toLocaleTimeString('RU')
	} else {
		reminderData.date = stringDate
		reminderData.nextInvocation = job.nextInvocation().toDate()
	}
	return {
		error: false,
		data: reminderData
	}
}

async function updateSubscriber(Reminder, userId, state) {
	const method = state ? '$addToSet' : '$pull'
	await Reminder.updateOne(
		{
			reminderId: this.reminderId
		},
		{
			[method]: {
				subscribers: userId
			}
		}
	)
	const filter = {
		$match: {
			reminderId: this.reminderId
		}
	}
	const calculation = {
		$project: {
			number: {
				$size: '$subscribers'
			}
		}
	}
	const [stats] = await Reminder.aggregate([filter, calculation])
	return {
		error: false,
		data: stats.number
	}
}

async function scheduleAllReminders(Reminder) {
	const reminders = await Reminder.find()
	for (const reminder of reminders) {
		const isDateTime = reminder.date[10] === 'T'
		const { job } = await reminder.schedule(isDateTime)
		if (!job) {
			await Reminder.deleteOne({
				reminderId: reminder.reminderId
			})
		}
	}
}

export {
	sendReminder,
	createReminder,
	getOneReminder,
	updateSubscriber,
	scheduleReminder,
	updateReminderData,
	scheduleAllReminders
}
