import {
    createNew,
    removeOne,
    getForGroup,
    triggerResponse,
    sendTriggerMessage
} from '../services/database/trigger.js'
import mongoose from 'mongoose'
const { Schema, model } = mongoose


const TriggerSchema = new Schema({
    groupId: {
        type: Number,
        required: true
    },
    originalMessageId: {
        type: Number
    },
    keyword: {
        type: String,
        required: true
    },
    deleteTrigger: {
        type: Boolean,
        required: true,
        default: false
    },
    caseSensitive: {
        type: Boolean,
        required: true
    }
})

class TriggerClass {
    static createNew(groupId, keyword, originalMessageId, caseSensitive) {
        return createNew(Trigger, groupId, keyword, originalMessageId, caseSensitive)
    }
    static removeOne(groupId, keyword) {
        return removeOne(Trigger, groupId, keyword)
    }
    static getForGroup(groupId) {
        return getForGroup(Trigger, groupId)
    }
    static triggerResponse(groupId, text) {
        return triggerResponse(Trigger, groupId, text)
    }
    send(replyMessageId) {
        return sendTriggerMessage.bind(this)(replyMessageId)
    }
}

TriggerSchema.loadClass(TriggerClass)
const Trigger = model('Trigger', TriggerSchema)


export { Trigger }