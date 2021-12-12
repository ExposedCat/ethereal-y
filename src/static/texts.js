const texts = {
    other: {
        greeting: '👋 Hello!',
        hints: {
            cron: '<code>/cron * * * * * Pet a loli</code>',
            reminder: '<code>/reminder 31.01 12:00 Pet a loli</code>\n<code>/reminder yesterday 12:00 Pet a loli</code>'
        },
        notification: text => `🕓 Remainder: «${text}»`
    },
    input: {

    },
    success: {
        reminderSet: (date, time) => `✍️ You will be notified at ${date} ${time}`,
        cronSet: (cron, next) => `✍️ You will be notified by time rule: <code>${cron}</code>\nNext notification at: ${next}`
    },
    errors: {
        unknownCommand: '🤔 Unknown command',
        invalidArguments: command => `🤯 Invalid arguments\n\nSyntax: ${texts.other.hints[command]}`,
        invalidSyntax: '🤯 Invalid syntax',
        noReply: '🤔 Reply message is not specified',
        regexpError: error => `🤬 RegExp error: ${error}`
    }
}


export { texts }