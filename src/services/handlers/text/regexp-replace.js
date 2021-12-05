import { texts } from '../../../static/texts.js'
import { buttons } from '../../../static/buttons.js'
import { errors } from '../../../entities/errors.js'


async function regexpReplace(text, targetText) {
    const parser = /(?:([gim]{0,3}))?\/(.+?)\/((?:.|\n)+?)\/$/gm
    const replacementGroups = text.matchAll(parser)
    if (!replacementGroups) {
        return {
            error: true,
            data: errors.regexpReplace.invalidSyntax
        }
    }
    let replaced = targetText
    for (const [_, flags, regexp, replacement] of replacementGroups) {
        try {
            const replacer = new RegExp(regexp, flags)
            replaced = replaced.replace(replacer, replacement)
        } catch (error) {
            return {
                error: true,
                data: error
            }
        }
    }
    return {
        error: false,
        data: replaced
    }
}


export {
    regexpReplace
}