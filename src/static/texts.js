import { escapeHTMLChars as plain } from '../services/static-helper.js'

const texts = {
	_templates: {
		trigger: trigger =>
			`ยท <code>${plain(trigger.keyword)}</code>${
				trigger.caseSensitive ? ' ๐ ' : ''
			}${trigger.deleteTrigger ? ' ๐' : ''}${
				trigger.regexTrigger ? ' ยฎ๏ธ' : ''
			}`,
		triggers: triggers => triggers.map(texts._templates.trigger).join('\n')
	},
	other: {
		voteBan: (name, ban) =>
			`Vote for ${ban ? 'ban' : 'mute'} ${plain(name)}`,
		anonymous: messageText => `Someone: ยซ${plain(messageText)}ยป`,
		greeting: (userId, userName) =>
			`๐ Hello, <a href="tg://user?id=${userId}">${plain(
				userName
			)}</a>!`,
		hints: {
			cron: '<code>/cron * * * * * Pet a loli</code>',
			reminder:
				'<code>/reminder 31.01 12:00 Pet a loli</code>\n<code>/reminder yesterday 12:00 Pet a loli</code>'
		},
		notification: text => `๐ Reminder: ยซ${plain(text)}ยป`,
		help: `๐ Hello!\n๐จโ๐ป Source code: <a href="https://github.com/ExposedCat/ethereal-y">OPEN</a>\n๐ Reference: <a href="https://github.com/ExposedCat/ethereal-y/blob/main/README.md">OPEN</a>\n\nCreated by @ExposedCatDev`
	},
	success: {
		broadcastDone: groupsNumber =>
			`๐ฉ Message sent to ${groupsNumber} groups`,
		triggerList: triggers =>
			`๐ Bindings:\n${texts._templates.triggers(triggers)}`,
		userMuted: (userName, minutes) =>
			`๐ข ${plain(userName)} restricted for ${
				minutes ? `${minutes} minute(s)` : 'forever'
			}`,
		userBanned: userName => `๐ข ${plain(userName)} banned`,
		userRestrictionsRemoved: userName =>
			`๐ All ${plain(userName)} restrictions removed`,
		triggerAdded: (keyword, deleteTrigger = false) =>
			`โ๏ธ ยซ${keyword}ยป binding added ${deleteTrigger ? '(๐)' : ''}`,
		triggerRemoved: keyword => `๐ ยซ${plain(keyword)}ยป binding removed`,
		reminderSet: (date, time) =>
			`โ๏ธ You will be notified at ${date} ${time}`,
		cronSet: (cron, next) =>
			`โ๏ธ You will be notified by time rule: <code>${cron}</code>\nNext notification at: ${next}`
	},
	errors: {
		noGroupsToBroadcast: `๐ถ No groups found or can't send messages to any`,
		cantRestrictUser: `๐คจ Can't change permissions of this user`,
		notEnoughUserRights: `๐ค You don't have enough rights`,
		notEnoughBotRights: `๐คฏ Bot doesn't have enough rights`,
		bindingNotFound: keyword => `๐ค ยซ${plain(keyword)}ยป binding not found`,
		alreadySubscribed:
			'๐คจ You are already subscribed for or unsubscribed from this reminder',
		unknownCommand: '๐ค Unknown command',
		nonExistentReminder: '๐ค Reminder does not exist',
		unknownError: ' ๐ฑ Unknown error',
		invalidArguments: command =>
			`๐คฏ Invalid arguments\n\nSyntax: ${texts.other.hints[command]}`,
		invalidSyntax: '๐คฏ Invalid syntax',
		invalidDate: '๐คฏ Invalid date\nSpecify date in future',
		invalidCron:
			'๐คฏ Invalid time rule\nUse crontab.guru to generate valid recurring time rule',
		noReply: '๐ค Reply message is not specified',
		regexpError: error => `๐คฌ RegExp error: ${error}`,
		messageTextIsEmpty: `๐คฏ RegExp error: Result message text is empty`,
		noTriggersFound: `๐ถ Bindings not found`
	},
	buttons: {
		subscribeReminder: subscribersNumber => `โ (${subscribersNumber})`,
		unsubscribeReminder: `โ`,
		pollYes: 'Yes',
		pollNo: 'No',
		captcha: 'I am not a robot'
	}
}

export { texts }
