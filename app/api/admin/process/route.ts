import { NextRequest, NextResponse } from 'next/server';
import { getProcessSteps, createProcessStep } from '@/lib/db/service';

export async function GET() {
  try {
    const steps = await getProcessSteps(false);
    return NextResponse.json(steps);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch process steps' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step_number, title, description, image } = body;

    if (!step_number || !title || !description || !image) {
      return NextResponse.json({ error: 'Step number, title, description, and image are required' }, { status: 400 });
    }

    const created = await createProcessStep({
      step_number,
      title,
      description,
      image,
      display_order: Number(body.display_order) || 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create process step' }, { status: 500 });
  }
}
