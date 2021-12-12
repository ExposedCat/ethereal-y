import { is } from './validator.js'
import { errors } from '../entities/errors.js'


function formDate(date, time) {
    if (!time) {
        return {
            error: false,
            data: date
        }
    }
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
                return {
                    error: true,
                    data: errors.invalidDate
                }
            }
        }
    }
    const [hours, minutes] = time.split(':')
    const year = new Date().getFullYear()
    const newDate = new Date(year, +month, day, hours, minutes)
    return {
        error: false,
        data: newDate
    }
}


export { formDate }