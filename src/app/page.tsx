import { auth } from './api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { expirationRecord, users } from '@/lib/schema';
import { ExpirationRecordSheet } from './components';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default async function Home() {
  return (
    <div className="w-full space-y-4">
      <div className="border rounded p-4 flex flex-col">
        <ExpirationRecordSheet />
        <ExpirationRecordsTable />
      </div>
    </div>
  );
}

async function ExpirationRecordsTable() {
  const session = await auth();
  if (session === null) {
    throw new Error('no session');
  }

  const records = await db.query.expirationRecord.findMany({
    where: eq(expirationRecord.pharmacyId, session.user.pharmacyId),
    with: {
      drug: true,
      user: true,
    },
  });
  return (
    <Table>
      <TableCaption>A list of all expiring drugs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Drug</TableHead>
          <TableHead>Expires On</TableHead>
          <TableHead>Logged By</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.drug.name}</TableCell>
            <TableCell>{format(r.expiringOn, 'dd MMM yy')}</TableCell>
            <TableCell>{r.user.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
