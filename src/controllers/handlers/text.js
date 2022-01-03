import { texts } from '../../static/texts.js'
import { buttons } from '../../static/buttons.js'

import { errors } from '../../entities/errors.js'

import { Poll } from '../../entities/poll.js'
import { User } from '../../entities/user.js'
import { Group } from '../../entities/group.js'
import { Reminder } from '../../entities/reminder.js'

import {
    addTrigger,
    getTriggers,
    triggerResponse,
    removeOneTrigger
} from '../../services/handlers/text/trigger.js'
import { help } from '../../services/handlers/text/help.js'
import { start } from '../../services/handlers/text/start.js'
import { action } from '../../services/handlers/text/action.js'
import { sendTextMessage } from '../../services/extensions/context.js'
import { getGroupIds } from '../../services/handlers/text/broadcast.js'
import { restrictParticipant } from '../../services/handlers/text/restrict.js'
import { regexpReplace } from '../../services/handlers/text/regexp-replace.js'
import { parseReminderCommand } from '../../services/handlers/text/reminder.js'
import { anonymousMessage } from '../../services/handlers/text/anonymous-message.js'

// FIXME: Split functions into files

async function extendContext(ctx, next) {
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
    await ctx.text(message)
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
    let sent = false
    const isGroup = ctx.from.id !== ctx.chat.id

    sent = isGroup && await processTrigger(
        ctx.chat.id, ctx.message.text,
        ctx.message.message_id
    )
    if (sent) return

    if (!isGroup) {
        await ctx.text(texts.errors.unknownCommand)
    }
}

async function processTextMessage(ctx, next) {
    const [command, ...data] = ctx.message.text.split(' ')
    ctx.data = data
    ctx.command = command
    ctx.rawData = data.join(' ')
    ctx.isGroup = ctx.chat.id !== ctx.from.id

    ctx.user = await User.getOne(ctx.from.id, ctx.from.first_name)
    ctx.group = ctx.isGroup && await Group.getOne(
        ctx.chat.id, ctx.chat.title
    )

    await next()
}

async function addTriggerCommand(ctx) {
    const originalMessageId = ctx.message.reply_to_message?.message_id
    if (!originalMessageId) {
        return await ctx.text(texts.errors.noReply)
    }
    const keyword = ctx.rawData
    const { error, data } = await addTrigger(ctx.chat.id, keyword, originalMessageId)
    if (error) {
        switch (data) {
            default: {
                return await ctx.text(texts.errors.unknownError)
            }
        }
    } else {
        await ctx.text(texts.success.triggerAdded(keyword))
    }
}

async function removeTriggerCommand(ctx) {
    const keyword = ctx.rawData
    const { error, data } = await removeOneTrigger(ctx.chat.id, keyword)
    if (error) {
        switch (data) {
            case errors.bindingNotFound: {
                return await ctx.text(
                    texts.errors.bindingNotFound(keyword)
                )
            }
            default: {
                return await ctx.text(texts.errors.unknownError)
            }
        }
    } else {
        await ctx.text(texts.success.triggerRemoved(keyword))
    }
}

async function getTriggersCommand(ctx) {
    const { error, data } = await getTriggers(ctx.chat.id)
    if (error) {
        switch (data) {
            default: {
                return await ctx.text(texts.errors.unknownError)
            }
        }
    } else {
        if (data.length) {
            await ctx.text(texts.success.triggerList(
                data.map(trigger => trigger.keyword)
            ))
        } else {
            await ctx.text(texts.errors.noTriggersFound)
        }
    }
}

async function processTrigger(chatId, text, replyMessageId) {
    const { error, data: trigger } = await triggerResponse(chatId, text)
    if (!error) {
        return await trigger.send(replyMessageId)
    }
    return false
}

async function restrictCommand(ctx, method) {
    const targetUserId = ctx.message.reply_to_message?.from?.id
    if (!targetUserId) {
        return await ctx.text(texts.errors.noReply)
    }
    const minutes = Number(ctx.rawData)
    const { error, data } = await restrictParticipant(method, {
        minutes,
        api: ctx.telegram,
        chatId: ctx.chat.id,
        userId: targetUserId,
    })
    if (error) {
        switch (data) {
            case errors.notEnoughBotRights: {
                return await ctx.text(texts.errors.notEnoughBotRights)
            }
            case errors.notEnoughUserRights: {
                return await ctx.text(texts.errors.notEnoughUserRights)
            }
            case errors.cantRestrictUser: {
                return await ctx.text(texts.errors.cantRestrictUser)
            }
            default: {
                return await ctx.text(texts.errors.unknownError)
            }
        }
    } else {
        const responses = {
            mute: 'userMuted',
            ban: 'userBanned',
            removeRestrictions: 'userRestrictionsRemoved',
        }
        const response = responses[method]
        const visualMinutes = minutes >= 527040 ? null : minutes
        await ctx.text(
            texts.success[response](data, visualMinutes)
        )
    }
}

async function broadcastCommand(ctx) {
    if (!ctx.user.fullRights) {
        return await ctx.text(texts.errors.notEnoughUserRights)
    }
    const originalMessageId = ctx.message.reply_to_message?.message_id
    if (!originalMessageId) {
        return await ctx.text(texts.errors.noReply)
    }
    const groupIds = await getGroupIds()
    let sent = 0
    for (const groupId of groupIds) {
        try {
            await ctx.telegram.copyMessage(
                groupId, ctx.chat.id, originalMessageId
            )
            sent++
        } catch ({ message }) {
            console.info(`Can't broadcast message: ${message}`)
            // Never mind if I can't send it
        }
    }
    if (sent) {
        await ctx.text(texts.success.broadcastDone(sent))
    } else {
        await ctx.text(texts.errors.noGroupsToBroadcast)
    }
}

async function anonymousMessageCommand(ctx) {
    const messageText = await anonymousMessage(ctx.match[1])
    try {
        await ctx.deleteMessage()
        await ctx.text(messageText)
    } catch ({ message }) {
        console.info(`Can't send anonymous message: ${message}`)
    }
}

async function voteForBanCommand(ctx) {
    if (!ctx.message.reply_to_message) {
        await ctx.text(texts.errors.noReply)
        return
    }
    const ban = ctx.message.text.split('/vote')[1] === 'ban'
    const target = ctx.message.reply_to_message.from
    try {
        const text = texts.other.voteBan(target.first_name, ban)
        const { poll, message_id } = await ctx.telegram.sendPoll(
            ctx.chat.id, text, buttons.voteBan,
            { is_anonymous: false }
        )
        await Poll.create({
            ban,
            pollId: poll.id,
            targetId: target.id,
            chatId: ctx.chat.id,
            messageId: message_id
        })
    } catch ({ message }) {
        console.info(`Can't vote for user ban: ${message}`)
    }
}

async function handleVote(ctx) {
    const pollData = ctx.poll
    const poll = await Poll.getOne(pollData.id)
    if (poll) {
        const yesVotes = pollData.options[0].voter_count
        const membersNumber = await ctx.telegram.getChatMembersCount(poll.chatId)
        const votesToApply = membersNumber * 0.3 | 0 || 1
        if (yesVotes >= votesToApply) {
            await poll.apply(ctx)
        }
    }
}


export {
    handleVote,
    helpCommand,
    startCommand,
    actionCommand,
    extendContext,
    anyTextMessage,
    restrictCommand,
    reminderCommand,
    broadcastCommand,
    addTriggerCommand,
    voteForBanCommand,
    processTextMessage,
    getTriggersCommand,
    regexReplaceCommand,
    removeTriggerCommand,
    anonymousMessageCommand
}