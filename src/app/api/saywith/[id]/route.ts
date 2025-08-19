
import { NextRequest, NextResponse } from 'next/server';
import { ref, get, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { getSignedUrl } from '@/lib/r2';

async function refreshUrlIfNeeded(data: any, type: 'media' | 'audio', dbRef: any): Promise<boolean> {
    const now = new Date();
    const expKey = `R2${type}EXP`;
    const pathKey = `R2${type}Path`;
    const urlKey = `${type}Url`;

    if (data[expKey] && new Date(data[expKey]) < now) {
        console.log(`Refreshing ${type} URL for ${dbRef.key}`);
        try {
            const newSignedUrl = await getSignedUrl(data[pathKey]);
            const newExp = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

            const updates = {
                [urlKey]: newSignedUrl,
                [expKey]: newExp.toISOString(),
            };

            await update(dbRef, updates);
            
            data[urlKey] = newSignedUrl;
            data[expKey] = newExp.toISOString();
            
            return true;
        } catch (error) {
            console.error(`Failed to refresh ${type} URL:`, error);
            // Decide if you want to fail silently or throw
        }
    }
    return false;
}


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
      let data = snapshot.val();
      
      if (data.storageProvider === 'r2') {
          const mediaRefreshed = await refreshUrlIfNeeded(data, 'media', saywithRef);
          const audioRefreshed = await refreshUrlIfNeeded(data, 'audio', saywithRef);
      }

      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ error: 'The link you followed may be broken, or the page may have been removed.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
