import { PropsWithChildren } from 'react';
import { auth } from './api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/schema';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-2">
      <h1 className="text-xl font-semibold">Pharma Check</h1>
      <AuthWrapper>
        <PharmacyName />
      </AuthWrapper>
    </main>
  );
}

async function PharmacyName() {
  const session = await auth();
  if (session === null) {
    throw new Error('Not Authorized');
  }
  console.log(session.user);
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

async function AuthWrapper(props: PropsWithChildren) {
  const session = await auth();
  if (session !== null) {
    return <>{props.children}</>;
  }
  return <h1 className="tracking-wide">Not Authorized</h1>;
}
