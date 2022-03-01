import sharp from 'sharp'

const Circle = size =>
	sharp(
		Buffer.from(
			`<svg viewBox="0 0 ${size} ${size}">
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${size / 2}"
                />
            </svg>`,
			'utf-8'
		)
	)

export { Circle }
