import { texts } from '../../../static/texts.js'

async function anonymousMessage(messageText) {
	return texts.other.anonymous(messageText)
}

export { anonymousMessage }
