import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db/service';

export async function GET() {
  try {
    const products = await getProducts(false);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, image } = body;

    if (!name || !image) {
      return NextResponse.json({ error: 'Name and image are required' }, { status: 400 });
    }

    const slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const created = await createProduct({
      name: body.name,
      title: body.title || body.name,
      slug: slug,
      category: (category && category !== 'None' && category !== 'none') ? category.trim() : '',
      short_description: body.short_description || '',
      description: body.description || '',
      image: body.image,
      material: body.material || '',
      finish: body.finish || '',
      size: body.size || '',
      color: body.color || '',
      customization: body.customization || '',
      moq: body.moq || '',
      price: body.price !== undefined && body.price !== null && body.price !== '' ? Number(body.price) : null,
      featured: body.featured !== undefined ? Boolean(body.featured) : true,
      gallery_images: Array.isArray(body.gallery_images) ? body.gallery_images : [],
      display_order: Number(body.display_order) || 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
