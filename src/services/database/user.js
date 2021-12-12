function getOneUser(User, userId, name) {
    return User.findOneAndUpdate({
        userId
    }, { name }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
    })
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