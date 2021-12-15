import { texts } from '../../static/texts.js'
import { buttons } from '../../static/buttons.js'

import { errors } from '../../entities/errors.js'

import { User } from '../../entities/user.js'
import { Group } from '../../entities/group.js'
import { Reminder } from '../../entities/reminder.js'

import { help } from '../../services/handlers/text/help.js'
import { start } from '../../services/handlers/text/start.js'
import { parseReminderCommand } from '../../services/reminder.js'
import { action } from '../../services/handlers/text/action.js'
import { regexpReplace } from '../../services/handlers/text/regexp-replace.js'
import { sendTextMessage, showPopup } from '../../services/extensions/context.js'

async function extendContext(ctx, next) {
    ctx.popup = showPopup
    ctx.text = (text, extra) => sendTextMessage(ctx, text, extra)
    await next()
}

async function startCommand(ctx) {
    const response = await start(ctx.user)
    await ctx.text(response)
}

async function helpCommand(ctx) {
    const response = await help()
    await ctx.text(response)
}

async function actionCommand(ctx) {
    const actionMessage = await action(ctx.rawData)
    const name = ctx.from.first_name
    const message = `${name}: *${actionMessage}*`
    await ctx.text(message, {
        reply_to_message_id: ctx.message.message_id
    })
    try {
        await ctx.deleteMessage()
    } catch {
        // Never mind if I can't delete it
    }
}

async function regexReplaceCommand(ctx) {
    const reply = ctx.message.reply_to_message
    if (!reply) {
        await ctx.text(texts.errors.noReply)
        return
    }
    const { error, data } = await regexpReplace(
        ctx.rawData, reply.text
    )
    if (error) {
        if (data === errors.invalidSyntax) {
            await ctx.text(texts.errors.invalidSyntax)
        } else {
            await ctx.text(texts.errors.regexpError(data))
        }
    } else {
        if (data) {
            await ctx.text(data)
        } else {
            await ctx.text(texts.errors.messageTextIsEmpty)
        }
    }
}

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
        ), buttons.reminderSubscription(data.reminderId))
    } else {
        const nextInvocation = data.nextInvocation.toLocaleString('RU')
        await ctx.text(texts.success.cronSet(
            data.date, nextInvocation
        ), buttons.reminderSubscription(data.reminderId))
    }
}

async function reminderCommand(ctx) {
    const data = parseReminderCommand(ctx.command, ctx.rawData)
    const { commandData, isDateTime } = data
    if (!commandData) {
        await ctx.text(texts.errors.invalidArguments(
            ctx.command.slice(1)
        ))
    } else {
        await createNotification(ctx, commandData, isDateTime)
    }
}

async function anyTextMessage(ctx) {
    const isGroup = ctx.from.id !== ctx.chat.id
    if (!isGroup) {
        await ctx.text(texts.errors.unknownCommand)
    }
}

async function processTextMessage(ctx, next) {
    const [command, ...data] = ctx.message.text.split(' ')
    ctx.data = data
    ctx.command = command
    ctx.rawData = data.join(' ')

    ctx.user = await User.getOne(ctx.from.id, ctx.from.first_name)
    ctx.group = ctx.isGroup && await Group.getOne(
        ctx.chat.id, ctx.chat.title
    )

    await next()
}


export {
    helpCommand,
    startCommand,
    actionCommand,
    extendContext,
    anyTextMessage,
    reminderCommand,
    processTextMessage,
    regexReplaceCommand
}