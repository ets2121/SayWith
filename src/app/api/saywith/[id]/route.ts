
import { NextRequest, NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (typeof id !== 'string' || id.length === 0 || id.length > 9) {
    return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
  }

  try {
    const saywithRef = ref(db, `Saywith/${id}`);
    const snapshot = await get(saywithRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ error: 'The link you followed may be broken, or the page may have been removed.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
