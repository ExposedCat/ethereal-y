import Markup from 'telegraf/markup.js'
import { texts } from './texts.js'


function keyboard(keyboard, columns = 1) {
    const inlineKeyboard = Markup.inlineKeyboard(
        keyboard.map(key => Markup.callbackButton(...key)),
        { columns }
    )
    return {
        reply_markup: inlineKeyboard
    }
}

const buttons = {
    reminderSubscription: (reminderId, subscribersNumber = 1) => keyboard([
        [texts.buttons.subscribeReminder(subscribersNumber), `subscribe_1_${reminderId}`],
        [texts.buttons.unsubscribeReminder, `subscribe_0_${reminderId}`]
    ], 2),
    captcha: userId => keyboard([
        [texts.buttons.captcha, `captcha_${userId}`]
    ]),
    voteBan: [
        texts.buttons.pollYes,
        texts.buttons.pollNo
    ]
}


export { buttons }
