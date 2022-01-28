const token = process.env.TOKEN
const creatorId = 849670500
const databaseName = `ethereal-db`

// TODO: Move captcha delay to group settings
const captchaDelay = 30 * 1000


export {
    token,
    creatorId,
    databaseName,
    captchaDelay
}