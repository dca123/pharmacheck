import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTableCreator,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

const pgTable = pgTableCreator((name) => `pharmacheck_${name}`);

export const pharmacies = pgTable('pharmacies', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
});
export const pharmaciesRelations = relations(pharmacies, ({ many }) => ({
  pharmacists: many(users),
}));

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull(),
  passwordHash: varchar('password_hash').notNull(),
  pharmacyId: integer('pharmacy_id').notNull(),
});
export const usersRelations = relations(users, ({ one }) => ({
  pharmarcy: one(pharmacies, {
    fields: [users.pharmacyId],
    references: [pharmacies.id],
  }),
}));

export const drugs = pgTable('drugs', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
});
export const drugsRelations = relations(drugs, ({ many }) => ({
  expirationRecords: many(expirationRecord),
}));

export const expirationRecord = pgTable('expiration_record', {
  id: serial('id').primaryKey(),
  drugId: integer('drug_id').notNull(),
  pharmacyId: integer('pharmacy_id').notNull(),
  userId: integer('user_id').notNull(),
  expiringOn: date('expiring_on').notNull(),
});
export const expirationRecordRelations = relations(
  expirationRecord,
  ({ one }) => ({
    drug: one(drugs, {
      fields: [expirationRecord.drugId],
      references: [drugs.id],
    }),
    pharmacy: one(pharmacies, {
      fields: [expirationRecord.pharmacyId],
      references: [pharmacies.id],
    }),
    user: one(users, {
      fields: [expirationRecord.userId],
      references: [users.id],
    }),
  }),
);
