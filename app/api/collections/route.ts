import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/db/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collections = await getCollections(true);
    return NextResponse.json(collections);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch collections' }, { status: 500 });
  }
}
