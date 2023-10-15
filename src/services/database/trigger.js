import { bot } from '../bot.js'
import { firstMatch } from 'super-regex'

function createNew(
	Trigger,
	groupId,
	keyword,
	originalMessageId,
	caseSensitive,
	regexTrigger
) {
	return Trigger.findOneAndUpdate(
		{
			groupId,
			keyword
		},
		{
			originalMessageId,
			deleteTrigger: originalMessageId === null,
			caseSensitive,
			regexTrigger
		},
		{
			upsert: true,
			new: true,
			setDefaultsOnInsert: true
		}
	)
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
		let triggered = false
		if (!trigger.regexTrigger) {
			let finalText = text
			let finalKeyword = trigger.keyword
			if (!trigger.caseSensitive) {
				finalText = finalText.toLowerCase()
				finalKeyword = finalKeyword.toLowerCase()
			}
			triggered = finalText.includes(finalKeyword)
		} else {
			const flags = trigger.caseSensitive ? 'i' : ''
			const regex = new RegExp(trigger.keyword, flags)
			const match = firstMatch(regex, text, {
				timeout: 5_000
			})
			triggered = match !== undefined
		}
		if (triggered) {
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
			this.groupId,
			this.groupId,
			this.originalMessageId,
			{
				reply_to_message_id: replyMessageId,
				allow_sending_without_reply: true
			}
		)
		return false
	} catch (error) {
		if (error.message.includes('message to copy not found')) {
			return true
		}
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
