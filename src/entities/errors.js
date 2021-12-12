const errors = {
    invalidSyntax: Symbol('invalidSyntax'),
    invalidCron: Symbol('invalidCron'),
    invalidDate: Symbol('invalidDate')
}
Object.freeze(errors)


export { errors }