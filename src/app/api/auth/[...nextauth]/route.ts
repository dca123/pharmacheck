import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import NextAuth, { AuthOptions, User, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials === undefined) {
          console.log('no credentials');
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (user === undefined) {
          console.log('no user');
          return null;
        }

        if (user.passwordHash !== credentials.password) {
          console.log('wrong password');
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          pharmacyId: user.pharmacyId,
        } satisfies User;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account, session }) => {
      if (account) {
        token.id = +user.id;
        token.pharmacyId = user.pharmacyId;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.pharmacyId = token.pharmacyId;
      }
      return session;
    },
  },
} satisfies AuthOptions;

export async function auth() {
  return getServerSession(authConfig);
}

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
