const texts = {
    other: {
        greeting: '👋 Hello!',
        hints: {
            cron: '<code>/cron * * * * * Pet a loli</code>',
            reminder: '<code>/reminder 31.01 12:00 Pet a loli</code>\n<code>/reminder yesterday 12:00 Pet a loli</code>'
        },
        notification: text => `🕓 Reminder: «${text}»`,
        help: `👋 Hello!\nCreated by @ExposedCatDev\nSource code: <a href="https://github.com/ExposedCat/ethereal-y">OPEN</a>\nReference: <a href="https://github.com/ExposedCat/ethereal-y/blob/main/README.md">OPEN</a>`
    },
    success: {
        reminderSet: (date, time) => `✍️ You will be notified at ${date} ${time}`,
        cronSet: (cron, next) => `✍️ You will be notified by time rule: <code>${cron}</code>\nNext notification at: ${next}`
    },
    errors: {
        alreadySubscribed: '🤨 You are already subscribed for or unsubscribed from this reminder',
        unknownCommand: '🤔 Unknown command',
        nonExistentReminder: '🤔 Reminder does not exist',
        unknownError: ' 😱 Unknown error',
        invalidArguments: command => `🤯 Invalid arguments\n\nSyntax: ${texts.other.hints[command]}`,
        invalidSyntax: '🤯 Invalid syntax',
        invalidDate: '🤯 Invalid date\nSpecify date in future',
        invalidCron: '🤯 Invalid time rule\nUse crontab.guru to generate valid recurring time rule',
        noReply: '🤔 Reply message is not specified',
        regexpError: error => `🤬 RegExp error: ${error}`,
        messageTextIsEmpty: `😶 RegExp error: Result message text is empty`
    },
    buttons: {
        subscribeReminder: subscribersNumber => `➕ (${subscribersNumber})`,
        unsubscribeReminder: `➖`
    }
}


export { texts }