import {
    getOneUser,
    getUserNames,
    updateUserData
} from '../services/database/user.js'
import mongoose from 'mongoose'
const { Schema, model } = mongoose


const UserSchema = new Schema({
    userId: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

class UserClass {
    static getOne(userId, name) {
        return getOneUser(User, userId, name)
    }
    static getNames(userIds) {
        return getUserNames(User, userIds)
    }
    updateData(updates) {
        return updateUserData.bind(this)(User, updates)
    }
}

UserSchema.loadClass(UserClass)
const User = model('User', UserSchema)


export { User }