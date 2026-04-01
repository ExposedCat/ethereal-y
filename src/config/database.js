import mongoose from "mongoose";

async function connectToDatabase(name) {
	mongoose.Promise = global.Promise;
	const connectionString =
		process.env.DB_CONNECTION_STRING ?? `mongodb://127.0.0.1:27017/${name}`;
	const db = await mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	return db;
}

export { connectToDatabase };
