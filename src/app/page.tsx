import { auth } from './api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/schema';
import { ExpirationRecordSheet } from './components';

export default function Home() {
  return (
    <div className="w-full space-y-4">
      <PharmacyName />
      <div className="border rounded p-4">
        <ExpirationRecordSheet />
      </div>
    </div>
  );
}

async function PharmacyName() {
  const session = await auth();
  if (session === null) {
    throw new Error('Not Authorized');
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      pharmarcy: true,
    },
  });

  if (user === undefined) {
    throw new Error('User not found');
  }

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-center">{user.pharmarcy.name}</h1>
      <h2 className="tracking-wide text-center">{user.email}</h2>
    </div>
  );
}
