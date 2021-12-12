const dateWords = {
    today: [Symbol('today'), Symbol('сегодня')],
    tomorrow: [Symbol('tomorrow'), Symbol('завтра')]
}

Object.values(dateWords).forEach(list => Object.freeze(list))
Object.freeze(dateWords)


export { dateWords }