import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/db/supabase';
import {
  defaultHeroSlides,
  defaultAboutSection,
  defaultCollections,
  defaultProducts,
  defaultProcessSteps,
  defaultGalleryImages,
} from '@/lib/db/default-data';
import { hashPassword } from '@/lib/auth/password';

export async function POST() {
  try {
    const results: Record<string, string> = {};

    // 1. Seed admin
    const defaultPasswordHash = await hashPassword('admin123');
    const { error: adminError } = await supabaseServer.from('admins').upsert(
      [
        {
          name: 'Super Admin',
          email: 'admin@qadriexporters.com',
          password_hash: defaultPasswordHash,
          role: 'superadmin',
        },
      ],
      { onConflict: 'email' }
    );
    results.admins = adminError ? `Error: ${adminError.message}` : 'Ready';

    // 2. Seed Hero
    const { data: currentHero } = await supabaseServer.from('hero_sections').select('image');
    const existingHeroImages = new Set((currentHero || []).map((h: any) => h.image));
    const newHeroSlides = defaultHeroSlides
      .filter((h) => !existingHeroImages.has(h.image))
      .map(({ id, ...rest }) => rest);
    if (newHeroSlides.length > 0) {
      const { error: heroErr } = await supabaseServer.from('hero_sections').insert(newHeroSlides);
      results.hero = heroErr ? `Error: ${heroErr.message}` : `Seeded ${newHeroSlides.length} items`;
    } else {
      results.hero = 'Already up to date';
    }

    // 3. Seed About
    const { data: existingAbout } = await supabaseServer.from('about_sections').select('id').limit(1);
    if (!existingAbout || existingAbout.length === 0) {
      const { id, ...aboutRest } = defaultAboutSection;
      const { error: aboutErr } = await supabaseServer.from('about_sections').insert([aboutRest]);
      results.about = aboutErr ? `Error: ${aboutErr.message}` : 'Seeded';
    } else {
      results.about = 'Already present';
    }

    // 4. Seed Collections
    const { data: currentCol } = await supabaseServer.from('collections').select('name');
    const existingColNames = new Set((currentCol || []).map((c: any) => c.name));
    const newCollections = defaultCollections
      .filter((c) => !existingColNames.has(c.name))
      .map(({ id, ...rest }) => rest);
    if (newCollections.length > 0) {
      const { error: colErr } = await supabaseServer.from('collections').insert(newCollections);
      results.collections = colErr ? `Error: ${colErr.message}` : `Seeded ${newCollections.length} items`;
    } else {
      results.collections = 'Already up to date';
    }

    // 5. Seed Products
    const { data: currentProd } = await supabaseServer.from('products').select('slug');
    const existingProdSlugs = new Set((currentProd || []).map((p: any) => p.slug));
    const newProducts = defaultProducts
      .filter((p) => !existingProdSlugs.has(p.slug))
      .map(({ id, ...rest }) => rest);
    if (newProducts.length > 0) {
      const { error: prodErr } = await supabaseServer.from('products').insert(newProducts);
      results.products = prodErr ? `Error: ${prodErr.message}` : `Seeded ${newProducts.length} items`;
    } else {
      results.products = 'Already up to date';
    }

    // 6. Seed Process
    const { data: currentProc } = await supabaseServer.from('process_steps').select('step_number');
    const existingProcNumbers = new Set((currentProc || []).map((p: any) => p.step_number));
    const newProcess = defaultProcessSteps
      .filter((p) => !existingProcNumbers.has(p.step_number))
      .map(({ id, ...rest }) => rest);
    if (newProcess.length > 0) {
      const { error: procErr } = await supabaseServer.from('process_steps').insert(newProcess);
      results.process = procErr ? `Error: ${procErr.message}` : `Seeded ${newProcess.length} items`;
    } else {
      results.process = 'Already up to date';
    }

    // 7. Seed Gallery
    const { data: currentGal } = await supabaseServer.from('gallery_images').select('image');
    const existingGalImages = new Set((currentGal || []).map((g: any) => g.image));
    const newGallery = defaultGalleryImages
      .filter((g) => !existingGalImages.has(g.image))
      .map(({ id, ...rest }) => rest);
    if (newGallery.length > 0) {
      const { error: galErr } = await supabaseServer.from('gallery_images').insert(newGallery);
      results.gallery = galErr ? `Error: ${galErr.message}` : `Seeded ${newGallery.length} items`;
    } else {
      results.gallery = 'Already up to date';
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Database setup failed' }, { status: 500 });
  }
}
