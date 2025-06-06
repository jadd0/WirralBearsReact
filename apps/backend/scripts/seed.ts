import { dbInsertSessionDays } from './weekdays.db.setup';

async function dbSetup() {
	await Promise.all([dbInsertSessionDays()]);
}

dbSetup()
	.then(() => {
		console.log('Database setup complete.');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Database setup failed:', err);
		process.exit(1);
	});
