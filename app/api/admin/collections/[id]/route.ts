import { NextRequest, NextResponse } from 'next/server';
import { updateCollection, deleteCollection } from '@/lib/db/service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateCollection(params.id, body);
    if (!updated) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteCollection(params.id);
    if (!success) return NextResponse.json({ error: 'Failed to delete collection' }, { status: 400 });
    return NextResponse.json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
