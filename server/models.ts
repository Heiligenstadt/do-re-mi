import { Pool } from 'pg';
import type { QueryResult } from 'pg';

const PG_URI =
  'postgresql://postgres.xshwfhkrwrzcrkayynqu:gb2Sw.bH*_YE$rV@aws-1-us-east-1.pooler.supabase.com:6543/postgres';
const pool = new Pool({
  connectionString: PG_URI,
});

export default {
  query: (text: string, params?: any[]): Promise<QueryResult<any>> => {
    console.log('executed query', text);
    return pool.query(text, params);
  },
};
