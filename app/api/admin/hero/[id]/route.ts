import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlideById, updateHeroSlide, deleteHeroSlide } from '@/lib/db/service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const slide = await getHeroSlideById(params.id);
    if (!slide) return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
    return NextResponse.json(slide);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero slide' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateHeroSlide(params.id, body);
    if (!updated) return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteHeroSlide(params.id);
    if (!success) return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 400 });
    return NextResponse.json({ success: true, message: 'Hero slide deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}
