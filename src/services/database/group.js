function getOneGroup(Group, groupId, title) {
    let update = {}
    if (title) {
        update.title = title
    }
    try {
        return Group.findOneAndUpdate({
            groupId
        }, update, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        })
    } catch {
        return getOneGroup(Group, groupId, title)
    }
}

function updateGroupData(Group, updates) {
    return Group.updateOne({
        groupId: this.groupId
    }, updates)
}


export {
    getOneGroup,
    updateGroupData
}