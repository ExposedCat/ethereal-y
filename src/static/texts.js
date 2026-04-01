import { escapeHTMLChars as plain } from "../services/static-helper.js";

const SPACE = "⁠";

const texts = {
	_templates: {
		trigger: (trigger) =>
			`· <code>${plain(trigger.keyword)}</code>${
				trigger.caseSensitive ? " 🔠" : ""
			}${trigger.deleteTrigger ? " 🗑" : ""}${trigger.regexTrigger ? " ®️" : ""}`,
		triggers: (triggers) => triggers.map(texts._templates.trigger).join("\n"),
	},
	other: {
		voteBan: (name, ban) => `Vote for ${ban ? "ban" : "mute"} ${plain(name)}`,
		anonymous: (messageText) => `Someone: «${plain(messageText)}»`,
		greeting: (userId, userName) =>
			`👋 Hello, <a href="tg://user?id=${userId}">${plain(userName)}</a>!`,
		hints: {
			cron: "<code>/cron * * * * * Pet a loli</code>",
			reminder:
				"<code>/reminder 31.01 12:00 Pet a loli</code>\n<code>/reminder yesterday 12:00 Pet a loli</code>",
		},
		notification: (text) => `🕓 Reminder: «${plain(text)}»`,
		help: `👋 Hello!\n👨‍💻 Source code: <a href="https://github.com/ExposedCat/ethereal-y">OPEN</a>\n📖 Reference: <a href="https://github.com/ExposedCat/ethereal-y/blob/main/README.md">OPEN</a>\n\nCreated by @ExposedCatDev`,
	},
	success: {
		broadcastDone: (groupsNumber) =>
			`📩 Message sent to ${groupsNumber} groups`,
		executeJS: ({ stdout, stderr, critical }) => {
			const makeLine = (type, data) =>
				`<pre><code class="language-${type}">${data.trim() ? data.trim() : " "}</code></pre>`;
			return `${makeLine("stdout", stdout)}${makeLine("stderr", stderr)}${critical ? makeLine("critical", critical) : ""}${SPACE}`;
		},
		triggerList: (triggers) =>
			`🔗 Bindings:\n${texts._templates.triggers(triggers)}`,
		userMuted: (userName, minutes) =>
			`💢 ${plain(userName)} restricted for ${
				minutes ? `${minutes} minute(s)` : "forever"
			}`,
		userBanned: (userName) => `💢 ${plain(userName)} banned`,
		userRestrictionsRemoved: (userName) =>
			`😇 All ${plain(userName)} restrictions removed`,
		triggerAdded: (keyword, deleteTrigger = false) =>
			`✍️ «${keyword}» binding added ${deleteTrigger ? "(🗑)" : ""}`,
		triggerRemoved: (keyword) => `🗑 «${plain(keyword)}» binding removed`,
		reminderSet: (date, time) => `✍️ You will be notified at ${date} ${time}`,
		cronSet: (cron, next) =>
			`✍️ You will be notified by time rule: <code>${cron}</code>\nNext notification at: ${next}`,
	},
	errors: {
		noGroupsToBroadcast: `😶 No groups found or can't send messages to any`,
		cantRestrictUser: `🤨 Can't change permissions of this user`,
		notEnoughUserRights: `😤 You don't have enough rights`,
		notEnoughBotRights: `🤯 Bot doesn't have enough rights`,
		bindingNotFound: (keyword) => `🤔 «${plain(keyword)}» binding not found`,
		alreadySubscribed:
			"🤨 You are already subscribed for or unsubscribed from this reminder",
		unknownCommand: "🤔 Unknown command",
		nonExistentReminder: "🤔 Reminder does not exist",
		unknownError: " 😱 Unknown error",
		invalidArguments: (command) =>
			`🤯 Invalid arguments\n\nSyntax: ${texts.other.hints[command]}`,
		invalidSyntax: "🤯 Invalid syntax",
		invalidDate: "🤯 Invalid date\nSpecify date in future",
		invalidCron:
			"🤯 Invalid time rule\nUse crontab.guru to generate valid recurring time rule",
		noReply: "🤔 Reply message is not specified",
		regexpError: (error) => `🤬 RegExp error: ${error}`,
		messageTextIsEmpty: `🤯 RegExp error: Result message text is empty`,
		noTriggersFound: `😶 Bindings not found`,
	},
	buttons: {
		subscribeReminder: (subscribersNumber) => `➕ (${subscribersNumber})`,
		unsubscribeReminder: `➖`,
		pollYes: "Yes",
		pollNo: "No",
		captcha: "I am not a robot",
	},
};

export { texts };
