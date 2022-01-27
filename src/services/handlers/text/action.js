// FIXME: Move replacements to some storage
const replacements = [
    ['йти', 'шел(-ла)'],
    ['реть', 'р(-ла)'],
    ['ться', 'лся(-ась)'],
    ['хнуть', 'х(-ла)'],
    ['ть', 'л(-а)'],
]

async function action(text) {
    let result = text
    const ending = `(?=[^А-ЯЁа-яё*]|$)`
    for (const [from, to] of replacements) {
        const regexp = new RegExp(from + ending, 'gi')
        result = result.replace(regexp, to)
    }
    result = result.replace(/(?<=[А-ЯЁа-яё])\*(?=\s|\n|$)/g, '')
    return result
}


export {
    action
}