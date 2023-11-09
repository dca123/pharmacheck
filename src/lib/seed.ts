import { sql } from 'drizzle-orm';
import { db } from './db';

async function main() {
  const results = await db.execute(sql`-- Inserting mock pharmacies
INSERT INTO pharmacheck_pharmacies (name) VALUES 
('Green Cross Pharmacy'),
('Redwood Pharmacy'),
('Blue Care Pharmacy');

-- Getting the IDs of the newly inserted pharmacies
WITH inserted_pharmacies AS (
  SELECT id FROM pharmacheck_pharmacies WHERE name IN ('Green Cross Pharmacy', 'Redwood Pharmacy', 'Blue Care Pharmacy')
)

-- Inserting pharmacists for each pharmacy
INSERT INTO pharmacheck_users (email, password_hash, pharmacy_id) VALUES
-- Pharmacists for Green Cross Pharmacy
('pharmacist1@greencross.com', 'hash1', (SELECT id FROM inserted_pharmacies WHERE name = 'Green Cross Pharmacy')),
('pharmacist2@greencross.com', 'hash2', (SELECT id FROM inserted_pharmacies WHERE name = 'Green Cross Pharmacy')),
('pharmacist3@greencross.com', 'hash3', (SELECT id FROM inserted_pharmacies WHERE name = 'Green Cross Pharmacy')),
('pharmacist4@greencross.com', 'hash4', (SELECT id FROM inserted_pharmacies WHERE name = 'Green Cross Pharmacy')),
('pharmacist5@greencross.com', 'hash5', (SELECT id FROM inserted_pharmacies WHERE name = 'Green Cross Pharmacy')),
-- Pharmacists for Redwood Pharmacy
('pharmacist1@redwood.com', 'hash1', (SELECT id FROM inserted_pharmacies WHERE name = 'Redwood Pharmacy')),
('pharmacist2@redwood.com', 'hash2', (SELECT id FROM inserted_pharmacies WHERE name = 'Redwood Pharmacy')),
('pharmacist3@redwood.com', 'hash3', (SELECT id FROM inserted_pharmacies WHERE name = 'Redwood Pharmacy')),
('pharmacist4@redwood.com', 'hash4', (SELECT id FROM inserted_pharmacies WHERE name = 'Redwood Pharmacy')),
('pharmacist5@redwood.com', 'hash5', (SELECT id FROM inserted_pharmacies WHERE name = 'Redwood Pharmacy')),
-- Pharmacists for Blue Care Pharmacy
('pharmacist1@bluecare.com', 'hash1', (SELECT id FROM inserted_pharmacies WHERE name = 'Blue Care Pharmacy')),
('pharmacist2@bluecare.com', 'hash2', (SELECT id FROM inserted_pharmacies WHERE name = 'Blue Care Pharmacy')),
('pharmacist3@bluecare.com', 'hash3', (SELECT id FROM inserted_pharmacies WHERE name = 'Blue Care Pharmacy')),
('pharmacist4@bluecare.com', 'hash4', (SELECT id FROM inserted_pharmacies WHERE name = 'Blue Care Pharmacy')),
('pharmacist5@bluecare.com', 'hash5', (SELECT id FROM inserted_pharmacies WHERE name = 'Blue Care Pharmacy'));
`);
  console.log(results);
}

main();
