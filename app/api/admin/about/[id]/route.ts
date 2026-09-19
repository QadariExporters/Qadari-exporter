import { NextRequest, NextResponse } from 'next/server';
import { updateAboutSection } from '@/lib/db/service';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateAboutSection(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
  }
}
