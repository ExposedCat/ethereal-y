import { texts } from '../../../static/texts.js'
import { buttons } from '../../../static/buttons.js'
import { errors } from '../../../entities/errors.js'


async function regexpReplace(ctx, text) {
    const parser = /(?:([gim]{0,3}))?\/(.+?)\/((?:.|\n)+?)\/$/
    const data = text.match(parser)
    if (!data) {
        return errors.regexpReplace.invalidSyntax
    }
    return data
}


export {
    regexpReplace
}