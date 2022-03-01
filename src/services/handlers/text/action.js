import { replacements } from '../../../static/replacements.js'

async function action(text, name) {
	let result = text
	const ending = `(?=[^А-ЯЁа-яё*]|$)`
	for (const [from, to] of replacements) {
		const regexp = new RegExp(from + ending, 'gi')
		result = result.replace(regexp, to)
	}
	result = result.replace(/(?<=[А-ЯЁа-яё])\*(?=\s|\n|$)/g, '')
	return `${name}: *${result}*`
}

export { action }
