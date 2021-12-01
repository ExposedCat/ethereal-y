import mongoose from 'mongoose'


async function connectToDatabase(name) {
    try {
        console.info('Connecting to database..')
        mongoose.Promise = global.Promise
        const db = await mongoose.connect(`mongodb://127.0.0.1:27017/${name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.info('Done')
        return db
    } catch (error) {
        console.error('CRITICAL: Cannot connect to database:')
        console.error(error)
        process.exit()
    }
}


export { connectToDatabase }