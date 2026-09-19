import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlides, createHeroSlide } from '@/lib/db/service';

export async function GET() {
  try {
    const slides = await getHeroSlides(false);
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image } = body;

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const created = await createHeroSlide({
      eyebrow: body.eyebrow || '',
      title: body.title,
      description: body.description || '',
      image: body.image,
      button_1_text: body.button_1_text || 'Explore collection',
      button_1_link: body.button_1_link || '/products',
      button_2_text: body.button_2_text || 'Enquire on WhatsApp',
      button_2_link: body.button_2_link || '',
      display_order: Number(body.display_order) || 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}
