import NextAuth, {
  DefaultUser,
  DefaultSession,
  JWT as DefaultJWT,
} from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      pharmacyId: number;
    } & Omit<DefaultSession['user'], 'id'>;
  }
  interface User extends DefaultUser {
    id: number;
    pharmacyId: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    pharmacyId: number;
  }
}
