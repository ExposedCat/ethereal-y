import { texts } from '../static/texts.js'
import { buttons } from '../static/buttons.js'


async function handleNewMembers(ctx) {
    const newMembers = ctx.message.new_chat_members
    const isInvited = newMembers[0].id !== ctx.from.id
    if (isInvited) {
        return
    }
    try {
        await ctx.telegram.restrictChatMember(
            ctx.chat.id, ctx.from.id,
            { can_send_messages: false }
        )
    } catch {
        return
    }
    const greeting = await ctx.text(
        texts.other.greeting(ctx.from.id, ctx.from.first_name),
        buttons.captcha(ctx.from.id)
    )
    setTimeout(async () => {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id, greeting.message_id)
            await ctx.telegram.kickChatMember(ctx.chat.id, newMembers[0].id)
        } catch {
            // Never mind if I can't delete it
        }
    }, 30 * 1000)
}


export { handleNewMembers }