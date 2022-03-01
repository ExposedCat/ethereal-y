import {
	getOnePoll,
	updatePollData,
	applyPollAction
} from '../services/database/poll.js'
import mongoose from 'mongoose'
const { Schema, model } = mongoose

const PollSchema = new Schema({
	pollId: {
		type: String,
		unique: true,
		required: true
	},
	chatId: {
		type: Number,
		required: true
	},
	targetId: {
		type: Number,
		required: true
	},
	messageId: {
		type: Number,
		required: true
	},
	ban: {
		type: Boolean,
		required: true
	}
})

class PollClass {
	static getOne(pollId) {
		return getOnePoll(Poll, pollId)
	}
	updateData(updates) {
		return updatePollData.bind(this)(Poll, updates)
	}
	apply(ctx) {
		return applyPollAction.bind(this)(Poll, ctx)
	}
}

PollSchema.loadClass(PollClass)
const Poll = model('Poll', PollSchema)

export { Poll }
