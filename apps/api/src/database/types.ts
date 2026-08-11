import { QueryResult, Pool } from 'pg';

export type Db = Pick<Pool, 'query'>;

export function mapQuery<T>(result: Pick<QueryResult, 'rows'>): T[] {
  return result.rows as T[];
}
