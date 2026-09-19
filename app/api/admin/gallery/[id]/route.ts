import { NextRequest, NextResponse } from 'next/server';
import { updateGalleryImage, deleteGalleryImage } from '@/lib/db/service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateGalleryImage(params.id, body);
    if (!updated) return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteGalleryImage(params.id);
    if (!success) return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 400 });
    return NextResponse.json({ success: true, message: 'Gallery image deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
