const replacements = new Map([
    ['<', '&lt;'],
    ['>', '&gt;']
])

function escapeHTMLChars(text) {
    let escaped = text
    for (const [symbol, replacement] of replacements) {
        escaped = escaped.replaceAll(symbol, replacement)
    }
    return escaped
}

export { escapeHTMLChars }