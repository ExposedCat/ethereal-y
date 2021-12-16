const errors = {
    noReply: Symbol('noReply'),
    invalidCron: Symbol('invalidCron'),
    invalidDate: Symbol('invalidDate'),
    invalidSyntax: Symbol('invalidSyntax'),
    bindingNotFound: Symbol('bindingNotFound'),
    nonExistentReminder: Symbol('nonExistentReminder')
}
Object.freeze(errors)


export { errors }