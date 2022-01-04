const Errors = {
    noReply: Symbol('noReply'),
    invalidCron: Symbol('invalidCron'),
    invalidDate: Symbol('invalidDate'),
    invalidSyntax: Symbol('invalidSyntax'),
    bindingNotFound: Symbol('bindingNotFound'),
    cantRestrictUser: Symbol('cantRestrictUser'),
    notEnoughUserRights: Symbol('notEnoughUserRights'),
    notEnoughBotRights: Symbol('notEnoughBotRights'),
    nonExistentReminder: Symbol('nonExistentReminder')
}
Object.freeze(Errors)


export { Errors }