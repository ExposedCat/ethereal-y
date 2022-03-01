function sendTextMessage(ctx, text, extra = {}) {
	return ctx.telegram.sendMessage(
		ctx.chat.id,
		text,
		Object.assign(extra, {
			parse_mode: 'HTML',
			disable_web_page_preview: true
		})
	)
}

const showPopup = (ctx, text) => ctx.answerCbQuery(text, true)

export { showPopup, sendTextMessage }
