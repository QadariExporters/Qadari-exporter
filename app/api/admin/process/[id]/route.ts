import { NextRequest, NextResponse } from 'next/server';
import { updateProcessStep, deleteProcessStep } from '@/lib/db/service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateProcessStep(params.id, body);
    if (!updated) return NextResponse.json({ error: 'Process step not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update process step' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteProcessStep(params.id);
    if (!success) return NextResponse.json({ error: 'Failed to delete process step' }, { status: 400 });
    return NextResponse.json({ success: true, message: 'Process step deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete process step' }, { status: 500 });
  }
}
