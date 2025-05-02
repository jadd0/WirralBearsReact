import { mergeQueryKeys } from "@lukemorales/query-key-factory";

// Import all queries from the queries folder
import { auth } from "@/queries/auth.queries";


export const queries = mergeQueryKeys(auth);
