import { Poll } from '../../../entities/poll.js'


async function processPollVote(api, id, yesVotes) {
    const poll = await Poll.getOne(id)
    if (poll) {
        const membersNumber = await api.getChatMembersCount(poll.chatId)
        const votesToApply = membersNumber * 0.3 | 0 || 1
        if (yesVotes >= votesToApply) {
            return {
                poll,
                shouldApply: true
            }
        }
    }

    return {
        shouldApply: false
    }
}


export {
    processPollVote
}