import cron from 'node-schedule'
import { texts } from '../../../static/texts.js'
import { buttons } from '../../../static/buttons.js'
import { compare } from '../../../entities/date-words.js'

async function notify(ctx, chatId, notification) {
    // TODO: Get reminder from database
    await ctx.telegram.sendMessage(chatId, notification)
}

function formDate(date, time) {
    if (time) {
        console.log('Time')
        let [day, month] = date.split('.')
        if (!day || !month) {
            const todayDay = new Date().getDate()
            const todayMonth = new Date().getMonth()
            switch (true) {
                case compare('today', date): {
                    day = todayDay
                    month = todayMonth
                    break
                }
                case compare('tomorrow', date): {
                    day = new Date().setDate(todayDay + 1)
                    day = new Date(day).getDate()
                    month = new Date().setMonth(todayMonth + 1)
                    month = new Date(month).getMonth()
                    break
                }
                default: {
                    return null
                }
            }
        }
        const [hours, minutes] = time.split(':')
        console.log(new Date().getFullYear(), month, day, hours, minutes)
        return new Date(new Date().getFullYear(), month, day, hours, minutes)
    } else {
        console.log('Cron')
        console.log(date)
        return date
    }
}

async function createReminder(ctx, chatId, userId, date, time, notification) {
    const formedDate = formDate(date, time)
    if (formedDate) {
        console.log(formedDate)
        cron.scheduleJob(formedDate, () => notify(ctx, chatId, notification))
        return {
            date: formedDate.toLocaleDateString('RU'),
            time: formedDate.toLocaleTimeString('RU')
        }
    } else {
        return false
    }
    // TODO: Store reminder in database
}


export {
    createReminder
}