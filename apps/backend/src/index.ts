import app from '@server/app';
import { env } from './env';

const port = env.PORT;

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
