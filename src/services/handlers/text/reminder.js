import { is } from '../../validator.js'
import { Errors } from '../../../entities/errors.js'

function formDate(date, time) {
	const [hours, minutes] = time.split(':')
	if (!minutes) {
		return {
			error: false,
			data: date
		}
	}
	let [day, month] = date.split('.')
	if (!day || !month) {
		const todayDay = new Date().getDate()
		const todayMonth = new Date().getMonth()
		switch (true) {
			case is('today', date): {
				day = todayDay
				month = todayMonth
				break
			}
			case is('tomorrow', date): {
				day = new Date().setDate(todayDay + 1)
				month = new Date(day).getMonth()
				day = new Date(day).getDate()
				break
			}
			default: {
				return {
					error: true,
					data: Errors.invalidDate
				}
			}
		}
	}
	const year = new Date().getFullYear()
	const newDate = new Date(year, month - 1, day, hours, minutes)
	return {
		error: false,
		data: newDate
	}
}

function parseReminderCommand(command, rawData) {
	let parser = /^((?:.+?(?= )){5}) (.+)$/
	const isDateTime = command === '/reminder'
	if (isDateTime) {
		parser = /^(.+?) (?:.+? )?(\d{1,2}:\d\d) (.+)$/
	}
	const commandData = rawData.match(parser)
	return {
		isDateTime,
		commandData
	}
}

export { formDate, parseReminderCommand }
