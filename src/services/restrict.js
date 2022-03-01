import { Errors } from '../entities/errors.js'

async function mute({ api, chatId, userId, minutes }) {
	const restrictedUntil = Date.now() + minutes * 60 * 1000
	await api.restrictChatMember(chatId, userId, {
		can_send_messages: false,
		until_date: Math.round(restrictedUntil / 1000)
	})
}

async function ban({ api, chatId, userId }) {
	await api.kickChatMember(chatId, userId)
}

async function removeRestrictions({ api, chatId, userId }) {
	await api.restrictChatMember(chatId, userId, {
		can_send_messages: true,
		can_invite_users: true,
		can_send_media_messages: true,
		can_send_polls: true,
		can_send_other_messages: true,
		can_add_web_page_previews: true
	})
}

const methods = { ban, mute, removeRestrictions }

async function restrictParticipant(method, parameters) {
	try {
		const chatMember = await parameters.api.getChatMember(
			parameters.chatId,
			parameters.userId
		)
		if (
			chatMember.status === 'member' ||
			chatMember.status === 'restricted'
		) {
			try {
				await methods[method](parameters)
				return {
					error: false,
					data: chatMember.user.first_name
				}
			} catch (error) {
				console.error(error)
				return {
					error: true,
					data: Errors.notEnoughBotRights
				}
			}
		} else {
			return {
				error: true,
				data: Errors.cantRestrictUser
			}
		}
	} catch (error) {
		console.error(error)
		return {
			error: true,
			data: Errors.notEnoughBotRights
		}
	}
}

export { restrictParticipant, removeRestrictions }
