import { texts } from './texts.js'


function basicKeyboard(keys) {
    return {
        reply_markup: {
            keyboard: keys,
            resize: true
        },
        parse_mode: 'HTML'
    }
}

function keyboard(keys) {
    const inlineKeys = keys.map(row => [
        row.map(key => ({
            text: key[0],
            callback_data: key[1]
        }))
    ])
    return {
        reply_markup: {
            inline_keyboard: inlineKeys
        },
        parse_mode: 'HTML'
    }
}

const buttons = {
    mainMenu: basicKeyboard([
        ['/start']
    ])
}


export { buttons }
