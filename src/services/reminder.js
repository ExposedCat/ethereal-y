import { is } from './validator.js'


function formDate(date, time) {
    if (time) {
        let [day, month] = date.split('.')
        if (!day || !month) {
            const todayDay = new Date().getDate()
            const todayMonth = new Date().getMonth()
            switch (true) {
                case is('today', date): {
                    day = todayDay
                    month = todayMonth
                    break
                }
                case is('tomorrow', date): {
                    day = new Date().setDate(todayDay + 1)
                    month = new Date(day).getMonth()
                    day = new Date(day).getDate()
                    break
                }
                default: {
                    return null
                }
            }
        }
        const [hours, minutes] = time.split(':')
        return new Date(new Date().getFullYear(), +month, day, hours, minutes)
    } else {
        return date
    }
}


export { formDate }