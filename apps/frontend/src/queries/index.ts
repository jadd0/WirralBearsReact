import { mergeQueryKeys } from '@lukemorales/query-key-factory';

// Import all queries from the queries folder
import { auth } from '@/queries/auth.queries';
import { blog } from './blog.queries';
import { image } from './image.queries';

export const queries = mergeQueryKeys(auth, blog, image);
