import { firstMatch, matches } from 'super-regex'

async function regexpReplace(text, targetText) {
	const parser = new RegExp(/(?:([gim]{0,3}))?\/(.+)\/((?:.|)+?)\/$/gm)
	const parsed = matches(parser, text, {
		timeout: 3_000
	})
	let replaced = targetText
	for (const { groups } of parsed) {
		const [flags, regexp, replacement] = groups;
		try {
			const replacer = new RegExp(regexp, flags)
			const match = firstMatch(replacer, replaced, {
				timeout: 5_000
			})
			if (match !== undefined) {
				replaced = replaced.replace(replacer, replacement)
			}
		} catch (error) {
			return {
				error: true,
				data: error
			}
		}
	}
	return {
		error: false,
		data: replaced
	}
}

export { regexpReplace }
