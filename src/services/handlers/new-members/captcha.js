import { Group } from '../../../entities/group.js'
import { captchaDelay } from '../../../config/manifest.js'


async function scheduleCaptchaInvalidation({ api, chatId, userId, greetingId }) {
    return setTimeout(async () => {
        try {
            const userRegistered = await Group.exists({
                groupId: chatId,
                users: userId
            })
            if (!userRegistered) {
                await api.deleteMessage(chatId, greetingId)
                await api.kickChatMember(chatId, userId)
            }
        } catch {
            // Never mind if I can't delete it
        }
    }, captchaDelay)
}


export {
    scheduleCaptchaInvalidation
}