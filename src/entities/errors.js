const errors = {
    invalidSyntax: Symbol('invalidSyntax'),
    invalidCron: Symbol('invalidCron'),
    invalidDate: Symbol('invalidDate'),
    nonExistentReminder: Symbol('nonExistentReminder')
}
Object.freeze(errors)


export { errors }