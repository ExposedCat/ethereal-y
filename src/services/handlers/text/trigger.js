import { errors } from '../../../entities/errors.js'
import { Trigger } from '../../../entities/trigger.js'


async function addTrigger(groupId, keyword, originalMessageId) {
    await Trigger.createNew(groupId, keyword, originalMessageId)
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
        data: deletedCount ? null : errors.bindingNotFound
    }
}

function triggerResponse(groupId, text) {
    return Trigger.triggerResponse(groupId, text)
}


export {
    addTrigger,
    getTriggers,
    triggerResponse,
    removeOneTrigger
}