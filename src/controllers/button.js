import { texts } from '../static/texts.js'
import { buttons } from '../static/buttons.js'

import { Errors } from '../entities/errors.js'
import { showPopup } from '../services/extensions/context.js'
import { subscribe } from '../services/handlers/buttons/reminder.js'


async function extendContext(ctx, next) {
    ctx.popup = text => showPopup(ctx, text)
    await next()
}

async function captchaClick(ctx) {
    await ctx.answerCbQuery()
    const userId = ctx.match[1]
    if (userId == ctx.from.id) {
        // FIXME: Move logic to service
        await ctx.telegram.restrictChatMember(ctx.chat.id, ctx.from.id, {
            can_send_messages: true,
            can_invite_users: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true
        })
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