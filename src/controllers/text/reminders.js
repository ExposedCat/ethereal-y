import { texts } from '../../static/texts.js'
import { buttons } from '../../static/buttons.js'

import { Errors } from '../../entities/errors.js'
import { Reminder } from '../../entities/reminder.js'

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
	if (ctx.match) {
		const isReminder = ctx.match.slice(1, 4).some(Boolean)
		if (!isReminder) {
			return
		}

		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth()
		const days = now.getDate() + Number(ctx.match[1] ?? 0) || 0
		const hours = now.getHours() + Number(ctx.match[2] ?? 0) || 0
		const minutes = now.getMinutes() + Number(ctx.match[3] ?? 0) || 0
		const date = new Date(year, month, days, hours, minutes)

		await createNotification(ctx, [null, date, null, ctx.match[4]], true)
	}
}

export { reminderCommand }
