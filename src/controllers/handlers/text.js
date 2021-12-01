import { texts } from '../../static/texts.js'

import { errors } from '../../entities/errors.js'

import { User } from '../../entities/user.js'
import { Group } from '../../entities/group.js'

import { start } from '../../services/handlers/text/start.js'
import { action } from '../../services/handlers/text/action.js'
import { regexpReplace } from '../../services/handlers/text/regexp-replace.js'



async function handleTextMessage(ctx) {
    const userId = ctx.from.id
    const groupId = ctx.chat.id
    const isGroup = userId !== groupId

    const { text } = ctx.message
    const reply = ctx.message.reply_to_message
    const [command, ...data] = text.split(' ')
    const rawData = data.join(' ')

    const user = await User.getOne(userId, ctx.from.first_name)
    const group = isGroup && await Group.getOne(groupId, ctx.chat.title)

    switch (command) {
        case '/start': {
            const response = await start(ctx, user)
            await ctx.text(response)
            break
        }
        case '/do': {
            const response = await action(ctx, rawData)
            await ctx.text(response)
            break
        }
        case '/re': {
            if (!reply) {
                await ctx.text(texts.errors.noReply)
                return
            }
            const response = await regexpReplace(ctx, text)
            switch (response) {
                case errors.regexpReplace.invalidSyntax: {
                    await ctx.text(texts.errors.invalidSyntax)
                    break
                }
                default: {
                    await ctx.text(response)
                }
            }
            break
        }
        default: {
            if (!isGroup) {
                await ctx.text(texts.errors.unknownCommand)
            }
        }
    }
}


export { handleTextMessage }