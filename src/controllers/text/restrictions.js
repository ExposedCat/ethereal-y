import { Poll } from '../../entities/poll.js'
import { texts } from '../../static/texts.js'
import { Errors } from '../../entities/errors.js'
import { buttons } from '../../static/buttons.js'
import { restrictParticipant } from '../../services/restrict.js'
import { processPollVote } from '../../services/handlers/polls/process-vote.js'

async function voteForBanCommand(ctx) {
	if (!ctx.message.reply_to_message) {
		await ctx.text(texts.errors.noReply)
		return
	}
	const ban = ctx.message.text.split('/vote')[1] === 'ban'
	const target = ctx.message.reply_to_message.from
	try {
		const text = texts.other.voteBan(target.first_name, ban)
		const { poll, message_id } = await ctx.telegram.sendPoll(
			ctx.chat.id,
			text,
			buttons.voteBan,
			{ is_anonymous: false }
		)
		await Poll.create({
			ban,
			pollId: poll.id,
			targetId: target.id,
			chatId: ctx.chat.id,
			messageId: message_id
		})
	} catch ({ message }) {
		console.info(`Can't vote for user ban: ${message}`)
	}
}

async function handleVote(ctx) {
	const pollData = ctx.poll
	if (!pollData) {
		return
	}
	const { id } = pollData
	const yesVotes = pollData.options[0].voter_count
	const { shouldApply, poll } = await processPollVote(
		ctx.telegram,
		id,
		yesVotes
	)
	if (shouldApply) {
		await poll.apply(ctx)
	}
}

async function restrictCommand(ctx, method) {
	const targetUserId = ctx.message.reply_to_message?.from?.id
	if (!targetUserId) {
		return await ctx.text(texts.errors.noReply)
	}
	const minutes = Number(ctx.rawData)
	const { error, data } = await restrictParticipant(method, {
		minutes,
		api: ctx.telegram,
		chatId: ctx.chat.id,
		userId: targetUserId
	})
	if (error) {
		switch (data) {
			case Errors.notEnoughBotRights: {
				return await ctx.text(texts.errors.notEnoughBotRights)
			}
			case Errors.notEnoughUserRights: {
				return await ctx.text(texts.errors.notEnoughUserRights)
			}
			case Errors.cantRestrictUser: {
				return await ctx.text(texts.errors.cantRestrictUser)
			}
			default: {
				return await ctx.text(texts.errors.unknownError)
			}
		}
	} else {
		const responses = {
			mute: 'userMuted',
			ban: 'userBanned',
			removeRestrictions: 'userRestrictionsRemoved'
		}
		const response = responses[method]
		const visualMinutes = minutes >= 527040 ? null : minutes
		await ctx.text(texts.success[response](data, visualMinutes))
	}
}

export { handleVote, restrictCommand, voteForBanCommand }
