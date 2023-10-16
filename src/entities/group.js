import {
	getOneGroup,
	getAllGroups,
	updateGroupData
} from '../services/database/group.js'
import mongoose from 'mongoose'
const { Schema, model } = mongoose

const GroupSchema = new Schema({
	groupId: {
		type: Number,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	users: {
		type: [Number],
		required: true
	},
	lastPair: {
		type: new Schema({
			date: Date,
			firstUserId: String,
			secondUserId: String
		}),
		default: () => ({
			date: new Date(2004),
			firstUserId: 0,
			secondUserId: 0
		})
	}
})

class GroupClass {
	static getOne(groupId, title) {
		return getOneGroup(Group, groupId, title)
	}
	static getAll() {
		return getAllGroups(Group)
	}
	updateData(updates) {
		return updateGroupData.bind(this)(Group, updates)
	}
}

GroupSchema.loadClass(GroupClass)
const Group = model('Group', GroupSchema)

export { Group }
