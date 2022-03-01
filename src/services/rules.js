async function getRights(api, chatId, userId) {
	try {
		const member = await api.getChatMember(chatId, userId)
		if (member.status === 'creator') {
			return {
				isAdmin: true,
				canDelete: true,
				canRestrict: true
			}
		} else if (member.status === 'administrator') {
			return {
				isAdmin: true,
				canDelete: member.can_delete_messages,
				canRestrict: member.can_restrict_members
			}
		}
		throw Error()
	} catch {
		return {
			isAdmin: false
		}
	}
}

export { getRights }
