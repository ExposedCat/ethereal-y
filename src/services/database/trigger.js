import { bot } from '../bot.js'


function createNew(Trigger, groupId, keyword, originalMessageId, caseSensitive) {
    return Trigger.findOneAndUpdate({
        groupId,
        keyword
    }, {
        originalMessageId,
        deleteTrigger: originalMessageId === null,
        caseSensitive
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    })
}

function removeOne(Trigger, groupId, keyword) {
    return Trigger.deleteOne({
        groupId,
        keyword
    })
}

function getForGroup(Trigger, groupId) {
    return Trigger.find({ groupId })
}

async function triggerResponse(Trigger, groupId, text) {
    const triggers = await Trigger.find({ groupId })
    for (const trigger of triggers) {
        let finalText = text
        let finalKeyword = trigger.keyword
        if (!trigger.caseSensitive) {
            finalText = finalText.toLowerCase()
            finalKeyword = finalKeyword.toLowerCase()
        }
        if (finalText.includes(finalKeyword)) {
            return {
                error: false,
                data: trigger
            }
        }
    }
    return {
        error: true,
        data: null
    }
}

async function sendTriggerMessage(replyMessageId) {
    try {
        await bot.telegram.copyMessage(
            this.groupId, this.groupId, this.originalMessageId,
            {
                reply_to_message_id: replyMessageId,
                allow_sending_without_reply: true
            }
        )
    } catch (error) {
        console.error(`Can't send binded message: `)
        console.trace(error)
    }
}


export {
    createNew,
    removeOne,
    getForGroup,
    triggerResponse,
    sendTriggerMessage
}