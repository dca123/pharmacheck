import { db } from '@/lib/db';
import { Schema } from './components';
import { expirationRecord } from '@/lib/schema';
import { auth } from './api/auth/[...nextauth]/route';

export async function createExpirationRecord(data: Schema) {
  const session = await auth();
  if (session === null) {
    return;
  }
  const record = await db.insert(expirationRecord).values({
    drugId: 1,
    expiringOn: new Date(),
    pharmacyId: 1,
    userId: session.user.id,
  });
}
