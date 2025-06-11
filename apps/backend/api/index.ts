import app from '../src/server/app';
import { env } from '../src/env';

const port = env.PORT;

app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});
