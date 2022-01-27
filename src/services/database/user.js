import { creatorId } from '../../config/manifest.js'


async function getOneUser(User, userId, name) {
    try {
        return await User.findOneAndUpdate({
            userId
        }, {
            name,
            // FIXME: Remove after creator stored in db
            fullRights: userId === creatorId
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        })
    } catch {
        return getOneUser(User, userId, name)
    }
}

function updateUserData(User, updates) {
    return User.updateOne({
        userId: this.userId
    }, updates)
}

function getUserNames(User, userIds) {
    return User.find({
        userId: {
            $in: userIds
        }
    }, {
        userId: true,
        name: true
    })
}


export {
    getOneUser,
    getUserNames,
    updateUserData
}