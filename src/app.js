import { extendContextWithSelf } from "./config/bot.js";
import { connectToDatabase } from "./config/database.js";
import { databaseName } from "./config/manifest.js";
import { Reminder } from "./entities/reminder.js";
import { bot } from "./services/bot.js";

console.info("Connecting to database..");
try {
	await connectToDatabase(databaseName);
} catch (error) {
	console.error("CRITICAL: Cannot connect to database:");
	console.error(error);
	process.exit();
}
console.info("Done");

console.info("Scheduling reminders..");
await Reminder.scheduleAll();
console.info("Done");

// console.info('Clearing database..')
// await Poll.deleteMany()
// await User.deleteMany()
// await Group.deleteMany()
// await Trigger.deleteMany()
// await Reminder.deleteMany()
// console.info('Done')

console.info("Starting bot..");
bot.launch();
await extendContextWithSelf(bot);
console.info("Done");
console.info("-----------");
console.info("App started");
console.info("-----------");
