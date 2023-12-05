'use server';
import { db } from '@/lib/db';
import { Schema } from './components';
import { expirationRecord, drugs } from '@/lib/schema';
import { auth } from './api/auth/[...nextauth]/route';
import { ilike } from 'drizzle-orm';

export async function createExpirationRecord(data: Schema) {
  const session = await auth();
  if (session === null) {
    return;
  }
  const record = await db.insert(expirationRecord).values({
    drugId: +data.name,
    expiringOn: data.date,
    pharmacyId: session.user.pharmacyId,
    userId: session.user.id,
  });
  console.log(record);
}

export async function findDrugs(str: string) {
  console.log(str);
  const drugList = await db.query.drugs.findMany({
    where: ilike(drugs.name, `%${str}%`),
  });
  const drugsAsOptions = drugList.map((drug) => ({
    value: String(drug.id),
    label: drug.name,
  }));
  console.log(drugsAsOptions);
  return drugsAsOptions;
}
