import {
    scheduleCaptchaInvalidation
} from '../services/handlers/new-members/captcha.js'
import { texts } from '../static/texts.js'
import { Group } from '../entities/group.js'
import { buttons } from '../static/buttons.js'
import { restrictParticipant } from '../services/restrict.js'


async function handleNewMembers(ctx) {
    const group = await Group.getOne(ctx.chat.id, ctx.chat.title)
    const newMembers = ctx.message.new_chat_members
    const isInvited = newMembers[0].id !== ctx.from.id
    // TODO: Make captcha validation optional with group settings
    // TODO: Move captcha texts to group settings
    // TODO: Add group setting to mute user-bots instead of ban 
    // TODO: Make greeting optional with group settings
    // TODO: Move greeting content to group settings
    const keyboard = (id, registered) => {
        if (isInvited || registered) {
            return {}
        } else {
            return buttons.captcha(id)
        }
    }
    for (const newMember of newMembers) {
        if (newMember.id === ctx.self?.id) {
            continue
        }
        const userRegistered = await Group.exists({
            groupId: ctx.chat.id,
            users: ctx.from.id
        })
        const greeting = await ctx.text(
            texts.other.greeting(newMember.id, newMember.first_name),
            keyboard(newMember.id, userRegistered)
        )
        if (isInvited || userRegistered) {
            await group.updateData({
                $addToSet: {
                    users: newMember.id
                }
            })
            return
        }
        const { error } = await restrictParticipant('mute', {
            api: ctx.telegram,
            chatId: ctx.chat.id,
            userId: newMember.id
        })
        if (error) {
            return
        }
        await scheduleCaptchaInvalidation({
            api: ctx.telegram,
            chatId: ctx.chat.id,
            greetingId: greeting.message_id,
            userId: newMembers[0].id
        })
    }
}


export { handleNewMembers }