import { texts } from '../../../static/texts.js'
import { buttons } from '../../../static/buttons.js'


async function action(text) {
    let result = text
    const replacements = [
        ['йти', 'шел(-ла)'],
        ['еть', 'л(-а)'],
        ['ться', 'лся(-ась)'],
        ['ть', 'л(-а)'],
    ]
    const ending = `(?=[^А-ЯЁа-яё]|$)`
    for (const [from, to] of replacements) {
        const regexp = new RegExp(from + ending, 'gi')
        result = result.replace(regexp, to)
    }
    return result
}


export {
    action
}