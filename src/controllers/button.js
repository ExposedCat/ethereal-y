import { texts } from '../static/texts.js'
import { buttons } from '../static/buttons.js'

import { Errors } from '../entities/errors.js'
import { showPopup } from '../services/extensions/context.js'
import { subscribe } from '../services/handlers/buttons/reminder.js'

async function extendContext(ctx, next) {
    ctx.popup = text => showPopup(ctx, text)
    await next()
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
        await ctx.editMessageReplyMarkup(
            buttons
                .reminderSubscription(reminderId, data)
                .reply_markup
        )
    } catch {
        await ctx.popup(texts.errors.alreadySubscribed)
    }
}


export {
    extendContext,
    subscribeClick
}