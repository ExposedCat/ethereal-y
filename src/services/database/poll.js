async function getOnePoll(Poll, pollId) {
    return await Poll.findOne({ pollId })
}

async function applyPollAction(Poll, ctx) {
    await Poll.deleteOne({
        _id: this._id
    })
    const action = this.ban ? 'kick' : 'restrict'
    const method = `${action}ChatMember`
    try {
        await ctx.telegram.stopPoll(this.chatId, this.messageId)
        await ctx.telegram[method](this.chatId, this.targetId, {
            can_send_messages: false
        })
        return true
    } catch ({ message }) {
        console.info(`Can't apply poll action: ${message}`)
        // Never mind if can't apply action
        return false
    }
}

function updatePollData(Poll, updates) {
    return Poll.updateOne({
        _id: this._id
    }, updates)
}


export {
    getOnePoll,
    updatePollData,
    applyPollAction
}