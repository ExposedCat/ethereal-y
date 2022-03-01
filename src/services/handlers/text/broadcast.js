import { Group } from '../../../entities/group.js'

async function getGroupIds() {
	const groups = await Group.getAll()
	const groupIds = groups.map(group => group.groupId)
	return groupIds
}

export { getGroupIds }
