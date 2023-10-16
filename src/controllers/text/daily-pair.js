import { Group } from '../../entities/group.js'
import { User } from '../../entities/user.js'

const random = array => array[Math.floor(Math.random() * array.length)]

async function pairOfTheDayCommand(ctx) {
	if (ctx.chat.id === ctx.from.id) {
		return
	}
	const group = await Group.getOne(ctx.chat.id, ctx.chat.title)
	if (group && group.users.length >= 2) {
		const emoji = random(['❤️', '💚', '💙', '💛'])
		if (group.lastPair.date.toDateString() !== new Date().toDateString()) {
			let user1 = null
			let user2 = null
			do {
				user1 = random(group.users)
				user2 = random(group.users)
			} while(user1 === null || user2 === null || user1 === user2)
			const users = await User.getNames([user1, user2])
			if (users.length === 2) {
				const userLine = user => `<a href="tg://user?id=${user.userId}">${user.name}</a>`
				await ctx.text(`Pair of the day is...\n\n${userLine(users[0])} + ${userLine(users[1])} ${emoji}`)
				await group.updateData({
					lastPair: {
						date: new Date(),
						firstUserId: users[0].userId,
						secondUserId: users[1].userId
					}
				})
			}
		} else {
			const users = await User.getNames([group.lastPair.firstUserId, group.lastPair.secondUserId])
			if (users.length === 2) {
				await ctx.text(`Pair of the day was already declared!\n\n${users[0].name} + ${users[1].name} ${emoji}`)
			}
		}
	}
}

export { pairOfTheDayCommand }
