import { mergeQueryKeys } from '@lukemorales/query-key-factory';

// Import all queries from the queries folder
import { blog } from './blog.queries';
import { image } from './image.queries';
import { coach } from './coach.queries';
import { session } from './session.queries';
import { games } from './games.queries';

export const queries = mergeQueryKeys(blog, image, coach, session, games);
