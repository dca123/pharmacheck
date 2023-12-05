import { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  driver: 'pg',
  dbCredentials: {
    host: process.env.RAILWAY_TCP_PROXY_DOMAIN ?? '',
    port: +(process.env.RAILWAY_TCP_PROXY_PORT ?? '0'),
    database: process.env.POSTGRES_DB ?? '',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: false,
  },
  tablesFilter: ['pharmacheck_*'],
} satisfies Config;
