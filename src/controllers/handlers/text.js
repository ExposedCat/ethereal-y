import { texts } from '../../static/texts.js'

import { errors } from '../../entities/errors.js'

import { User } from '../../entities/user.js'
import { Group } from '../../entities/group.js'
import { Reminder } from '../../entities/reminder.js'

import { start } from '../../services/handlers/text/start.js'
import { action } from '../../services/handlers/text/action.js'
import { regexpReplace } from '../../services/handlers/text/regexp-replace.js'



async function handleTextMessage(ctx) {
    const userId = ctx.from.id
    const chatId = ctx.chat.id
    const isGroup = userId !== chatId

    const { text } = ctx.message
    const reply = ctx.message.reply_to_message
    const [command, ...data] = text.split(' ')
    const rawData = data.join(' ')

    const user = await User.getOne(userId, ctx.from.first_name)
    const group = isGroup && await Group.getOne(chatId, ctx.chat.title)

    switch (command) {
        case '/start': {
            const response = await start(user)
            await ctx.text(response)
            break
        }
        case '/do': {
            const response = await action(rawData)
            const prefix = `${user.name}: `
            await ctx.text(prefix + response)
            try {
                await ctx.deleteMessage()
            } catch (error) {
                // Never mind if I can't delete it
            }
            break
        }
        case '/re': {
            if (!reply) {
                await ctx.text(texts.errors.noReply)
                return
            }
            const { error, data } = await regexpReplace(rawData, reply.text)
            if (error) {
                if (data === errors.regexpReplace.invalidSyntax) {
                    await ctx.text(texts.errors.invalidSyntax)
                } else {
                    await ctx.text(texts.errors.regexpError(data))
                }
            } else {
                await ctx.text(data)
            }
            break
        }
        case '/reminder':
        case '/cron': {
            let parser = /^((?:.+?(?= )){5}) (.+)$/
            if (command === '/reminder') {
                parser = /^(.+?) (?:.+? )?(\d{1,2}:\d\d) (.+)$/
            }
            const data = rawData.match(parser)
            if (!data) {
                await ctx.text(texts.errors.invalidArguments(command.slice(1)))
            } else {
                const [_, date, time, notification] = data
                const reminderData = {
                    date,
                    userId,
                    chatId,
                    Reminder,
                    messageId: ctx.message.message_id
                }
                if (notification) {
                    reminderData.time = time
                    reminderData.notification = notification
                } else {
                    reminderData.notification = time
                }
                const reminder = await Reminder.createNew(reminderData)
                if (reminder) {
                    if (command === '/reminder') {
                        await ctx.text(texts.success.reminderSet(reminder.date, reminder.time))
                    } else {
                        const nextInvocation = reminder.nextInvocation.toDate().toLocaleString('RU')
                        console.log(nextInvocation)
                        await ctx.text(texts.success.cronSet(reminder.date, nextInvocation))
                    }
                } else {
                    await ctx.text(texts.errors.invalidArguments(command.slice(1)))
                }
            }
        }
        default: {
            if (!isGroup) {
                await ctx.text(texts.errors.unknownCommand)
            }
        }
    }
}


export { handleTextMessage }