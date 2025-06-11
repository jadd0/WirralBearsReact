import { dbInsertSessionDays } from './weekdays.db.setup';
import { dbInsertSeasons } from './seasons.db.setup';

async function dbSetup() {
	await Promise.all([dbInsertSessionDays(), dbInsertSeasons()]);
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
