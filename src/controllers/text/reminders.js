import { texts } from '../../static/texts.js'
import { buttons } from '../../static/buttons.js'

import { Errors } from '../../entities/errors.js'
import { Reminder } from '../../entities/reminder.js'

import { parseReminderCommand } from '../../services/handlers/text/reminder.js'

async function createNotification(ctx, commandData, isDateTime) {
	const [_, date, time, notification] = commandData
	const reminderData = {
		date,
		time,
		Reminder,
		notification: notification || time,
		userId: ctx.from.id,
		chatId: ctx.chat.id,
		messageId: ctx.message.message_id
	}
	const { data } = await Reminder.createNew(reminderData, isDateTime)
	if (data === Errors.invalidDate) {
		await ctx.text(texts.errors.invalidDate)
		return
	}
	if (data === Errors.invalidCron) {
		await ctx.text(texts.errors.invalidCron)
		return
	}
	if (isDateTime) {
		await ctx.text(
			texts.success.reminderSet(data.date, data.time),
			buttons.reminderSubscription(data.reminderId)
		)
	} else {
		const nextInvocation = data.nextInvocation.toLocaleString('RU')
		await ctx.text(
			texts.success.cronSet(data.date, nextInvocation),
			buttons.reminderSubscription(data.reminderId)
		)
	}
}

async function reminderCommand(ctx) {
	const data = parseReminderCommand(ctx.command, ctx.rawData)
	const { commandData, isDateTime } = data
	if (!commandData) {
		await ctx.text(texts.errors.invalidArguments(ctx.command.slice(1)))
	} else {
		await createNotification(ctx, commandData, isDateTime)
	}
}

export { reminderCommand }
