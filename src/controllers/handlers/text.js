import { texts } from '../../static/texts.js'

import { errors } from '../../entities/errors.js'

import { User } from '../../entities/user.js'
import { Group } from '../../entities/group.js'
import { Reminder } from '../../entities/reminder.js'

import { help } from '../../services/handlers/text/help.js'
import { start } from '../../services/handlers/text/start.js'
import { action } from '../../services/handlers/text/action.js'
import { regexpReplace } from '../../services/handlers/text/regexp-replace.js'
import { buttons } from '../../static/buttons.js'


// FIXME: Split commands into separate middlewares
async function handleTextMessage(ctx) {
    const userId = ctx.from.id
    const chatId = ctx.chat.id
    const isGroup = userId !== chatId

    const { text } = ctx.message
    const reply = ctx.message.reply_to_message
    const [command, ...data] = text.split(' ')
    const rawData = data.join(' ')

    const user = await User.getOne(userId, ctx.from.first_name)
    const group = isGroup && await Group.getOne(
        chatId, ctx.chat.title
    )

    switch (command) {
        case '/start': {
            const response = await start(user)
            await ctx.text(response)
            break
        }
        case '/help': {
            const response = await help()
            await ctx.text(response)
            break
        }
        case '/do': {
            const response = await action(rawData)
            const prefix = `${user.name}: `
            await ctx.text(prefix + response, {
                reply_to_message_id: ctx.message.message_id
            })
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
            const { error, data } = await regexpReplace(
                rawData, reply.text
            )
            if (error) {
                if (data === errors.invalidSyntax) {
                    await ctx.text(texts.errors.invalidSyntax)
                } else {
                    await ctx.text(texts.errors.regexpError(data))
                }
            } else {
                await ctx.text(data)
            }
            break
        }
        // FIXME: Move logic to service
        case '/reminder':
        case '/cron': {
            let parser = /^((?:.+?(?= )){5}) (.+)$/
            const isDateTime = command === '/reminder'
            if (isDateTime) {
                parser = /^(.+?) (?:.+? )?(\d{1,2}:\d\d) (.+)$/
            }
            const commandData = rawData.match(parser)
            if (!commandData) {
                await ctx.text(texts.errors.invalidArguments(
                    command.slice(1)
                ))
            } else {
                const [_, date, time, notification] = commandData
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
                const { data } = await Reminder.createNew(reminderData, isDateTime)
                if (data === errors.invalidDate) {
                    await ctx.text(texts.errors.invalidDate)
                    return
                }
                if (data === errors.invalidCron) {
                    await ctx.text(texts.errors.invalidCron)
                    return
                }
                if (isDateTime) {
                    await ctx.text(texts.success.reminderSet(
                        data.date, data.time
                    ), buttons.reminderSubscribtion(data.reminderId))
                } else {
                    const nextInvocation = data
                        .nextInvocation
                        .toDate()
                        .toLocaleString('RU')

                    await ctx.text(texts.success.cronSet(
                        data.date, nextInvocation
                    ))
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