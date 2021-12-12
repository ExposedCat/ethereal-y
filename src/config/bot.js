import { Telegraf } from 'telegraf'

async function setupBot(token) {
    console.info(`Setting up bot..`)
    const bot = new Telegraf(token)
    // bot.catch(error => console.error(error.message))
    bot.use(async (ctx, next) => {
        ctx.text = async (text, extra = {}) => {
            await bot.telegram.sendMessage(
                ctx.chat.id,
                text,
                Object.assign(extra, {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            )
        }
        ctx.popup = text => ctx.answerCbQuery(text, true)
        await next()
    })
    console.info(`Done`)
    return bot
}

export { setupBot }