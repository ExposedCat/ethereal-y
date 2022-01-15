import {
    addTrigger,
    getTriggers,
    triggerResponse,
    removeOneTrigger
} from '../../services/handlers/text/trigger.js'
import { texts } from '../../static/texts.js'
import { Errors } from '../../entities/errors.js'


async function addDeleteTriggerCommand(ctx) {
    const keyword = ctx.rawData
    const { error, data } = await addTrigger(ctx.chat.id, keyword, null)
    if (error) {
        switch (data) {
            default: {
                return await ctx.text(texts.errors.unknownError)
            }
        }
    } else {
        await ctx.text(texts.success.triggerAdded(keyword, true))
    }
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
            case Errors.bindingNotFound: {
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

async function processTrigger(chatId, text, replyMessageId, api) {
    const { error, data: trigger } = await triggerResponse(chatId, text)
    if (error) {
        return false
    }
    if (trigger.deleteTrigger) {
        return await api.deleteMessage(chatId, replyMessageId)
    } else {
        return await trigger.send(replyMessageId)
    }
}


export {
    processTrigger,
    removeOneTrigger,
    addTriggerCommand,
    addDeleteTriggerCommand,
    getTriggersCommand,
    removeTriggerCommand
}