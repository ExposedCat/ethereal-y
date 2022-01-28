import { captchaDelay } from '../../../config/manifest.js'


async function scheduleCaptchaInvalidation({ api, chatId, userId, greetingId }) {
    setTimeout(async () => {
        try {
            await api.deleteMessage(chatId, greetingId)
            await api.kickChatMember(chatId, userId)
        } catch {
            // Never mind if I can't delete it
        }
    }, captchaDelay)
}


export {
    scheduleCaptchaInvalidation
}