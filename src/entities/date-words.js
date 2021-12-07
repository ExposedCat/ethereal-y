const dateWords = {
    today: [Symbol('today'), Symbol('сегодня')],
    tomorrow: [Symbol('tomorrow'), Symbol('завтра')]
}

Object.values(dateWords).forEach(list => Object.freeze(list))
Object.freeze(dateWords)

function compare(key, word) {
    for (const dateWord of dateWords[key]) {
        const symbolValue = dateWord.description.toLowerCase()
        if (symbolValue === word.toLowerCase()) {
            return true
        }
    }
    return false
}

export { compare }