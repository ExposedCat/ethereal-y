import { texts } from '../static/texts.js'

import { Errors } from '../entities/errors.js'

import { help } from '../services/handlers/text/help.js'
import { start } from '../services/handlers/text/start.js'
import { action } from '../services/handlers/text/action.js'
import { getGroupIds } from '../services/handlers/text/broadcast.js'
import { regexpReplace } from '../services/handlers/text/regexp-replace.js'
import { anonymousMessage } from '../services/handlers/text/anonymous-message.js'


async function startCommand(ctx) {
    const response = await start(ctx.user)
    await ctx.text(response)
}

async function helpCommand(ctx) {
    const response = await help()
    await ctx.text(response)
}

async function actionCommand(ctx) {
    // FIXME: Move logic to service
    // Service should return final string
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
        if (data === Errors.invalidSyntax) {
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
            // FIXME: Move error message to some storage
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
        // FIXME: Move error message to some storage
        console.info(`Can't send anonymous message: ${message}`)
    }
}


export {
    handleVote,
    restrictCommand,
    voteForBanCommand
} from './text/restrictions.js'

export {
    extendContext,
    processTextMessage
} from './text/extends.js'

export {
    removeOneTrigger,
    addTriggerCommand,
    addDeleteTriggerCommand,
    getTriggersCommand,
    removeTriggerCommand
} from './text/triggers.js'

export { anyTextMessage } from './text/any-message.js'

export { reminderCommand } from './text/reminders.js'

export {
    helpCommand,
    startCommand,
    actionCommand,
    broadcastCommand,
    regexReplaceCommand,
    anonymousMessageCommand
}