import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import config from '../../drizzle.config';

const queryClient = postgres({
  host: process.env.RAILWAY_TCP_PROXY_DOMAIN,
  port: +(process.env.RAILWAY_TCP_PROXY_PORT ?? '5463'),
  db: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
export const db = drizzle(queryClient, { schema });
