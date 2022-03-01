import { Errors } from '../../../entities/errors.js'
import { Trigger } from '../../../entities/trigger.js'


async function isValidRegexTrigger(trigger) {
    try {
        new RegExp(regexTrigger)
        return {
            error: null
        }
    } catch (error) {
        return {
            error
        }
    }
}

async function addTrigger(groupId, keyword, originalMessageId, caseSensitive, regexTrigger) {
    await Trigger.createNew(
        groupId,
        keyword, originalMessageId,
        caseSensitive, regexTrigger
    )
    return {
        error: false,
        data: null
    }
}

async function getTriggers(groupId) {
    const triggers = await Trigger.getForGroup(groupId)
    return {
        error: false,
        data: triggers
    }
}

async function removeOneTrigger(groupId, keyword) {
    const { deletedCount } = await Trigger.removeOne(groupId, keyword)
    return {
        error: !deletedCount,
        data: deletedCount ? null : Errors.bindingNotFound
    }
}

function triggerResponse(groupId, text) {
    return Trigger.triggerResponse(groupId, text)
}


export {
    addTrigger,
    getTriggers,
    triggerResponse,
    removeOneTrigger,
    isValidRegexTrigger
}