import {
    scheduleCaptchaInvalidation
} from '../services/handlers/new-members/captcha.js'
import { texts } from '../static/texts.js'
import { buttons } from '../static/buttons.js'
import { restrictParticipant } from '../services/handlers/restrict.js'


async function handleNewMembers(ctx) {
    const newMembers = ctx.message.new_chat_members
    const isInvited = newMembers[0].id !== ctx.from.id
    // FIXME: Send greeting if user was invited too
    // TODO: Make captcha validation optional with group settings
    // TODO: Move captcha texts to group settings
    // TODO: Add group setting to mute user-bots instead of ban 
    // TODO: Make greeting optional with group settings
    // TODO: Move greeting content to group settings
    if (isInvited) {
        return
    }
    const { error } = await restrictParticipant('mute', {
        api: ctx.telegram,
        chatId: ctx.chat.id,
        userId: ctx.from.id
    })
    if (error) {
        return
    }
    const greeting = await ctx.text(
        texts.other.greeting(ctx.from.id, ctx.from.first_name),
        buttons.captcha(ctx.from.id)
    )
    await scheduleCaptchaInvalidation({
        api: ctx.telegram,
        chatId: ctx.chat.id,
        greetingId: greeting.message_id,
        userId: newMembers[0].id
    })
}


export { handleNewMembers }