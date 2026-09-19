import { NextRequest, NextResponse } from 'next/server';
import { getCollections, createCollection } from '@/lib/db/service';

export async function GET() {
  try {
    const collections = await getCollections(false);
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, image } = body;

    if (!name || !title || !image) {
      return NextResponse.json({ error: 'Name, title, and image are required' }, { status: 400 });
    }

    const created = await createCollection({
      name: body.name,
      title: body.title,
      label: body.label || '',
      description: body.description || '',
      image: body.image,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      link: body.link || '/products',
      display_order: Number(body.display_order) || 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
