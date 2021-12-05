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
            const { error, data } = await regexpReplace(rawData, reply.text)
            if (error) {
                if (data === errors.regexpReplace.invalidSyntax) {
                    await ctx.text(texts.errors.invalidSyntax)
                } else {
                    await ctx.text(texts.errors.regexpError(data))
                }
            } else {
                await ctx.text(data)
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