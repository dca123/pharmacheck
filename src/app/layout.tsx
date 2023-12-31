import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PropsWithChildren } from 'react';
import { auth } from './api/auth/[...nextauth]/route';
import Link from 'next/link';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { QueryClientWrapper } from './QueryClientWrapper';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pharma Check',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center p-24 space-y-4 h-screen">
          <h1 className="text-sm">Pharma Check</h1>
          <Menu />
          <AuthWrapper>
            <QueryClientWrapper>{children}</QueryClientWrapper>
          </AuthWrapper>
        </main>
      </body>
    </html>
  );
}

async function AuthWrapper(props: PropsWithChildren) {
  const session = await auth();
  if (session !== null) {
    return <>{props.children}</>;
  }
  return <h1 className="tracking-wide">Not Authorized</h1>;
}

async function Menu() {
  const session = await auth();
  if (session !== null) {
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
      <div className="flex flex-row space-x-3 w-full justify-center">
        <h2 className="tracking-wide text-center">
          {user.email} in {user.pharmarcy.name}
        </h2>
        <Link
          href="/api/auth/signout"
          className="underline text-right justify-self-start"
        >
          Sign Out
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Link href="/api/auth/signin" className="underline">
        Sign In
      </Link>
    </div>
  );
}
