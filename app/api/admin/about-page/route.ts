import { NextRequest, NextResponse } from 'next/server';
import { getAboutPageData, updateAboutPageData } from '@/lib/db/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getAboutPageData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch about page' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateAboutPageData(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update about page' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateAboutPageData(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update about page' }, { status: 500 });
  }
}
