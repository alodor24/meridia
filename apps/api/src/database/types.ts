import { QueryResult, Pool } from 'pg';

export type Db = Pick<Pool, 'query'>;

export const mapQuery = <T>(result: Pick<QueryResult, 'rows'>): T[] => result.rows as T[];