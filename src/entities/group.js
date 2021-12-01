import {
    getOneGroup,
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
    }
})

class GroupClass {
    static getOne(groupId, title) {
        return getOneGroup(Group, groupId, title)
    }
    updateData(updates) {
        return updateGroupData.bind(this)(Group, updates)
    }
}

GroupSchema.loadClass(GroupClass)
const Group = model('Group', GroupSchema)


export { Group }