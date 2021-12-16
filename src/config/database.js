import mongoose from 'mongoose'


async function connectToDatabase(name) {
    mongoose.Promise = global.Promise
    const db = await mongoose.connect(`mongodb://127.0.0.1:27017/${name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return db
}


export { connectToDatabase }