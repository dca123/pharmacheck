import { pgTableCreator, serial, varchar } from 'drizzle-orm/pg-core';

const pgTable = pgTableCreator((name) => `pharmacheck_${name}`);

export const pharmacies = pgTable('pharmacies', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
});
