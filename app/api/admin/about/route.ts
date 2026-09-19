import { NextRequest, NextResponse } from 'next/server';
import { getAboutSection, updateAboutSection } from '@/lib/db/service';

export async function GET() {
  try {
    const about = await getAboutSection();
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about section' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateAboutSection(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateAboutSection(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
  }
}
