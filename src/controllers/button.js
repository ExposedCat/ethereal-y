import { texts } from '../static/texts.js'
import { buttons } from '../static/buttons.js'

import { Errors } from '../entities/errors.js'
import { showPopup } from '../services/extensions/context.js'
import { subscribe } from '../services/handlers/buttons/reminder.js'
import { removeRestrictions } from '../services/restrict.js'

import { Group } from '../entities/group.js'


async function extendContext(ctx, next) {
    ctx.popup = text => showPopup(ctx, text)
    await next()
}

async function captchaClick(ctx) {
    await ctx.answerCbQuery()
    const userId = ctx.match[1]
    if (userId == ctx.from.id) {
        try {
            await removeRestrictions({
                api: ctx.telegram,
                chatId: ctx.chat.id,
                userId: ctx.from.id
            })
            await Group.findOneAndUpdate({
                groupId: ctx.chat.id,
                $addToSet: {
                    users: userId
                }
            })
        } catch {
            // Unrestrict unrestricted (owner, unrestricted by admins)
        }
        await ctx.editMessageReplyMarkup()
    }
}

async function subscribeClick(ctx) {
    const [_, stringState, reminderId] = ctx.match
    const state = Boolean(Number(stringState))
    const { error, data } = await subscribe(ctx.from.id, reminderId, state)
    if (error) {
        switch (data) {
            case Errors.nonExistentReminder: {
                await ctx.editMessageReplyMarkup({})
                return await ctx.popup(texts.errors.nonExistentReminder)
            }
            default: {
                return await ctx.popup(texts.errors.unknownError)
            }
        }
    }
    try {
        const { reply_markup } = buttons.reminderSubscription(reminderId, data)
        await ctx.editMessageReplyMarkup(reply_markup)
    } catch {
        await ctx.popup(texts.errors.alreadySubscribed)
    }
}


export {
    captchaClick,
    extendContext,
    subscribeClick
}