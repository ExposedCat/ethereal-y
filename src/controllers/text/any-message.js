import { processTrigger } from './triggers.js'


function doProcessTrigger(ctx, isGroup) {
    return isGroup && processTrigger(
        ctx.chat.id, ctx.message.text,
        ctx.message.message_id,
        ctx.telegram
    )
}

const functions = [
    doProcessTrigger
]

async function anyTextMessage(ctx) {
    const isGroup = ctx.from.id !== ctx.chat.id
    for (const func of functions) {
        const responseSent = await func(ctx, isGroup)
        if (responseSent) {
            return
        }
    }
    if (!isGroup) {
        await ctx.text(texts.errors.unknownCommand)
    }
}


export {
    anyTextMessage
}