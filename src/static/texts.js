const texts = {
    other: {
        greeting: 'Hello!',
    },
    input: {

    },
    success: {
        groupAuthorized: title => `Group "${title}" authorized`
    },
    errors: {
        unknownCommand: 'Unknown command',
        invalidSyntax: 'Invalid syntax',
        noReply: 'Reply message is not specified',
        regexpError: error => `RegExp error: ${error}`
    },
    buttons: {
        settings: 'Settings'
    }
}


export { texts }