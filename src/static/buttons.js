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
    reminderSubscribtion: (reminderId, subscribersNumber = 1) => keyboard([
        [texts.buttons.subscribeReminder(subscribersNumber), `subscribe_${reminderId}`],
        [texts.buttons.unsubscribeReminder, `unsubscribe_${reminderId}`]
    ], 2)
}


export { buttons }
