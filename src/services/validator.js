import { dateWords } from '../entities/date-words.js'


function is(key, word) {
    for (const dateWord of dateWords[key]) {
        const symbolValue = dateWord.description.toLowerCase()
        if (symbolValue === word.toLowerCase()) {
            return true
        }
    }
    return false
}


export { is }