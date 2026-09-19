import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImages, createGalleryImage } from '@/lib/db/service';

export async function GET() {
  try {
    const images = await getGalleryImages(false);
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const created = await createGalleryImage({
      title: body.title || '',
      label: body.label || body.title || '',
      category: body.category || 'Products',
      image: body.image,
      alt_text: body.alt_text || body.title || '',
      display_order: Number(body.display_order) || 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 });
  }
}
