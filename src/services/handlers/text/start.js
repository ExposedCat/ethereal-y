import { texts } from '../../../static/texts.js'


async function start(user) {
    await user.updateData({
        state: 'free'
    })
    return texts.other.greeting(user.id, user.name)
}


export {
    start
}