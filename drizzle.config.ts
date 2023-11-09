import { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  driver: 'pg',
  dbCredentials: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: true,
  },
  tablesFilter: ['pharmacheck_*'],
} satisfies Config;
