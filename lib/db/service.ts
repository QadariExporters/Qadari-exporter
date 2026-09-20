import { supabaseServer } from './supabase';
import {
  Admin,
  HeroSlide,
  AboutSection,
  CollectionItem,
  ProductItem,
  ProcessStepItem,
  GalleryImageItem,
  AboutPageData,
} from './schema';
import {
  defaultHeroSlides,
  defaultAboutSection,
  defaultCollections,
  defaultProducts,
  defaultProcessSteps,
  defaultGalleryImages,
  defaultAboutPageData,
} from './default-data';

// In-memory runtime cache/fallback store
const runtimeStore = {
  hero: [...defaultHeroSlides],
  about: { ...defaultAboutSection },
  aboutPage: { ...defaultAboutPageData },
  collections: [...defaultCollections],
  products: [...defaultProducts],
  process: [...defaultProcessSteps],
  gallery: [...defaultGalleryImages],
  admins: [
    {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'admin@qadriexporters.com',
      // bcrypt hash for 'admin123'
      password_hash: '$2b$10$qpOzkHdiJF8hOd3TKcMtkuxSMJRHf.PcWBsMZ44yB9G4a8WPEK.6e',
      role: 'superadmin' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

// ==========================================
// ADMINS
// ==========================================
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    const { data, error } = await supabaseServer
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!error && data) {
      return data as Admin;
    }
  } catch (err) {
    console.warn('Supabase admins query error, checking runtime store:', err);
  }

  // Fallback to runtime store
  const found = runtimeStore.admins.find(
    (a) => a.email.toLowerCase() === email.toLowerCase().trim()
  );
  return found || null;
}

export async function getAdminById(id: string): Promise<Admin | null> {
  try {
    const { data, error } = await supabaseServer
      .from('admins')
      .select('id, name, email, role, created_at, updated_at')
      .eq('id', id)
      .single();

    if (!error && data) {
      return data as Admin;
    }
  } catch (err) {
    console.warn('Supabase admins query error, checking runtime store:', err);
  }

  const found = runtimeStore.admins.find((a) => a.id === id);
  if (found) {
    const { password_hash, ...rest } = found;
    return rest as Admin;
  }
  return null;
}

export async function updateAdminProfile(id: string, updates: { name?: string; password_hash?: string }) {
  try {
    const { data, error } = await supabaseServer
      .from('admins')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) return data;
  } catch (err) {
    console.warn('Supabase update admin error, updating runtime store:', err);
  }

  const idx = runtimeStore.admins.findIndex((a) => a.id === id);
  if (idx !== -1) {
    runtimeStore.admins[idx] = {
      ...runtimeStore.admins[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return runtimeStore.admins[idx];
  }
  return null;
}

// ==========================================
// HERO SECTION
// ==========================================
export async function getHeroSlides(onlyActive = false): Promise<HeroSlide[]> {
  try {
    let query = supabaseServer.from('hero_sections').select('*').order('display_order', { ascending: true });
    if (onlyActive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (!error && data) {
      return data as HeroSlide[];
    }
  } catch (err) {
    console.warn('Supabase hero query error, returning fallback:', err);
  }

  return onlyActive ? runtimeStore.hero.filter((h) => h.is_active) : runtimeStore.hero;
}

export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
  try {
    const { data, error } = await supabaseServer.from('hero_sections').select('*').eq('id', id).single();
    if (!error && data) return data as HeroSlide;
  } catch (err) {
    console.warn('Supabase hero item error:', err);
  }
  return runtimeStore.hero.find((h) => h.id === id) || null;
}

export async function createHeroSlide(slide: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>): Promise<HeroSlide> {
  const newId = `hero-${Date.now()}`;
  const now = new Date().toISOString();
  const payload = { ...slide, created_at: now, updated_at: now };

  try {
    const { data, error } = await supabaseServer.from('hero_sections').insert([payload]).select().single();
    if (!error && data) {
      runtimeStore.hero.push(data as HeroSlide);
      return data as HeroSlide;
    }
  } catch (err) {
    console.warn('Supabase hero insert error:', err);
  }

  const newSlide = { id: newId, ...payload };
  runtimeStore.hero.push(newSlide);
  return newSlide;
}

export async function updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide | null> {
  const now = new Date().toISOString();
  try {
    const { data, error } = await supabaseServer
      .from('hero_sections')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      const idx = runtimeStore.hero.findIndex((h) => h.id === id);
      if (idx !== -1) runtimeStore.hero[idx] = data as HeroSlide;
      return data as HeroSlide;
    }
  } catch (err) {
    console.warn('Supabase hero update error:', err);
  }

  const idx = runtimeStore.hero.findIndex((h) => h.id === id);
  if (idx !== -1) {
    runtimeStore.hero[idx] = { ...runtimeStore.hero[idx], ...updates, updated_at: now };
    return runtimeStore.hero[idx];
  }
  return null;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseServer.from('hero_sections').delete().eq('id', id);
    if (!error) {
      runtimeStore.hero = runtimeStore.hero.filter((h) => h.id !== id);
      return true;
    }
  } catch (err) {
    console.warn('Supabase hero delete error:', err);
  }

  const prevLen = runtimeStore.hero.length;
  runtimeStore.hero = runtimeStore.hero.filter((h) => h.id !== id);
  return runtimeStore.hero.length < prevLen;
}

// ==========================================
// ABOUT SECTION
// ==========================================
function normalizeAboutSection(section: AboutSection): AboutSection {
  const eyebrow = section.eyebrow?.trim() || '';
  if (!eyebrow || /exporters/i.test(eyebrow)) {
    return { ...section, eyebrow: defaultAboutSection.eyebrow };
  }
  return section;
}

export async function getAboutSection(onlyActive = false): Promise<AboutSection> {
  try {
    let query = supabaseServer
      .from('about_sections')
      .select('*')
      .order('display_order', { ascending: true })
      .limit(1);

    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query.single();

    if (!error && data) {
      return normalizeAboutSection(data as AboutSection);
    }
  } catch (err) {
    console.warn('Supabase about query error:', err);
  }

  return normalizeAboutSection(runtimeStore.about);
}

export async function updateAboutSection(updates: Partial<AboutSection>): Promise<AboutSection> {
  const now = new Date().toISOString();
  try {
    const current = await getAboutSection(false);
    const { data, error } = await supabaseServer
      .from('about_sections')
      .upsert({ ...current, ...updates, updated_at: now })
      .select()
      .single();

    if (!error && data) {
      runtimeStore.about = data as AboutSection;
      return data as AboutSection;
    }
  } catch (err) {
    console.warn('Supabase about upsert error:', err);
  }

  runtimeStore.about = { ...runtimeStore.about, ...updates, updated_at: now };
  return runtimeStore.about;
}

// ==========================================
// COLLECTIONS
// ==========================================
export async function getCollections(onlyActive = false): Promise<CollectionItem[]> {
  try {
    let query = supabaseServer.from('collections').select('*').order('display_order', { ascending: true });
    if (onlyActive) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (!error && data) {
      return data as CollectionItem[];
    }
  } catch (err) {
    console.warn('Supabase collections query error:', err);
  }

  return onlyActive ? runtimeStore.collections.filter((c) => c.is_active) : runtimeStore.collections;
}

export async function createCollection(item: Omit<CollectionItem, 'id' | 'created_at' | 'updated_at'>): Promise<CollectionItem> {
  const newId = `col-${Date.now()}`;
  const now = new Date().toISOString();
  const payload = { ...item, created_at: now, updated_at: now };

  try {
    const { data, error } = await supabaseServer.from('collections').insert([payload]).select().single();
    if (!error && data) {
      runtimeStore.collections.push(data as CollectionItem);
      return data as CollectionItem;
    }
  } catch (err) {
    console.warn('Supabase collections insert error:', err);
  }

  const created = { id: newId, ...payload };
  runtimeStore.collections.push(created);
  return created;
}

export async function updateCollection(id: string, updates: Partial<CollectionItem>): Promise<CollectionItem | null> {
  const now = new Date().toISOString();
  try {
    const { data, error } = await supabaseServer
      .from('collections')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      const idx = runtimeStore.collections.findIndex((c) => c.id === id);
      if (idx !== -1) runtimeStore.collections[idx] = data as CollectionItem;
      return data as CollectionItem;
    }
  } catch (err) {
    console.warn('Supabase collections update error:', err);
  }

  const idx = runtimeStore.collections.findIndex((c) => c.id === id);
  if (idx !== -1) {
    runtimeStore.collections[idx] = { ...runtimeStore.collections[idx], ...updates, updated_at: now };
    return runtimeStore.collections[idx];
  }
  return null;
}

export async function deleteCollection(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseServer.from('collections').delete().eq('id', id);
    if (!error) {
      runtimeStore.collections = runtimeStore.collections.filter((c) => c.id !== id);
      return true;
    }
  } catch (err) {
    console.warn('Supabase collections delete error:', err);
  }

  const prev = runtimeStore.collections.length;
  runtimeStore.collections = runtimeStore.collections.filter((c) => c.id !== id);
  return runtimeStore.collections.length < prev;
}

// ==========================================
// PRODUCTS
// ==========================================
export async function getProducts(onlyActive = false): Promise<ProductItem[]> {
  try {
    let query = supabaseServer.from('products').select('*').order('display_order', { ascending: true });
    if (onlyActive) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (!error && data) {
      return data as ProductItem[];
    }
  } catch (err) {
    console.warn('Supabase products query error:', err);
  }

  return onlyActive ? runtimeStore.products.filter((p) => p.is_active) : runtimeStore.products;
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    const { data, error } = await supabaseServer.from('products').select('*').eq('slug', slug).single();
    if (!error && data) return data as ProductItem;
  } catch (err) {
    console.warn('Supabase product slug query error:', err);
  }

  return runtimeStore.products.find((p) => p.slug === slug) || null;
}

export async function createProduct(item: Omit<ProductItem, 'id' | 'created_at' | 'updated_at'>): Promise<ProductItem> {
  const newId = `prod-${Date.now()}`;
  const now = new Date().toISOString();
  const payload = { ...item, created_at: now, updated_at: now };

  try {
    const { data, error } = await supabaseServer.from('products').insert([payload]).select().single();
    if (!error && data) {
      runtimeStore.products.push(data as ProductItem);
      return data as ProductItem;
    }
  } catch (err) {
    console.warn('Supabase products insert error:', err);
  }

  const created = { id: newId, ...payload };
  runtimeStore.products.push(created);
  return created;
}

export async function updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
  const now = new Date().toISOString();
  try {
    const { data, error } = await supabaseServer
      .from('products')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      const idx = runtimeStore.products.findIndex((p) => p.id === id);
      if (idx !== -1) runtimeStore.products[idx] = data as ProductItem;
      return data as ProductItem;
    }
  } catch (err) {
    console.warn('Supabase products update error:', err);
  }

  const idx = runtimeStore.products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    runtimeStore.products[idx] = { ...runtimeStore.products[idx], ...updates, updated_at: now };
    return runtimeStore.products[idx];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseServer.from('products').delete().eq('id', id);
    if (!error) {
      runtimeStore.products = runtimeStore.products.filter((p) => p.id !== id);
      return true;
    }
  } catch (err) {
    console.warn('Supabase products delete error:', err);
  }

  const prev = runtimeStore.products.length;
  runtimeStore.products = runtimeStore.products.filter((p) => p.id !== id);
  return runtimeStore.products.length < prev;
}

// ==========================================
// PROCESS STEPS
// ==========================================
export async function getProcessSteps(onlyActive = false): Promise<ProcessStepItem[]> {
  try {
    let query = supabaseServer.from('process_steps').select('*').order('display_order', { ascending: true });
    if (onlyActive) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (!error && data) {
      return data as ProcessStepItem[];
    }
  } catch (err) {
    console.warn('Supabase process steps query error:', err);
  }

  return onlyActive ? runtimeStore.process.filter((p) => p.is_active) : runtimeStore.process;
}

export async function createProcessStep(item: Omit<ProcessStepItem, 'id' | 'created_at' | 'updated_at'>): Promise<ProcessStepItem> {
  const newId = `proc-${Date.now()}`;
  const now = new Date().toISOString();
  const payload = { ...item, created_at: now, updated_at: now };

  try {
    const { data, error } = await supabaseServer.from('process_steps').insert([payload]).select().single();
    if (!error && data) {
      runtimeStore.process.push(data as ProcessStepItem);
      return data as ProcessStepItem;
    }
  } catch (err) {
    console.warn('Supabase process steps insert error:', err);
  }

  const created = { id: newId, ...payload };
  runtimeStore.process.push(created);
  return created;
}

export async function updateProcessStep(id: string, updates: Partial<ProcessStepItem>): Promise<ProcessStepItem | null> {
  const now = new Date().toISOString();
  try {
    const { data, error } = await supabaseServer
      .from('process_steps')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      const idx = runtimeStore.process.findIndex((p) => p.id === id);
      if (idx !== -1) runtimeStore.process[idx] = data as ProcessStepItem;
      return data as ProcessStepItem;
    }
  } catch (err) {
    console.warn('Supabase process steps update error:', err);
  }

  const idx = runtimeStore.process.findIndex((p) => p.id === id);
  if (idx !== -1) {
    runtimeStore.process[idx] = { ...runtimeStore.process[idx], ...updates, updated_at: now };
    return runtimeStore.process[idx];
  }
  return null;
}

export async function deleteProcessStep(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseServer.from('process_steps').delete().eq('id', id);
    if (!error) {
      runtimeStore.process = runtimeStore.process.filter((p) => p.id !== id);
      return true;
    }
  } catch (err) {
    console.warn('Supabase process delete error:', err);
  }

  const prev = runtimeStore.process.length;
  runtimeStore.process = runtimeStore.process.filter((p) => p.id !== id);
  return runtimeStore.process.length < prev;
}

// ==========================================
// GALLERY IMAGES
// ==========================================
export async function getGalleryImages(onlyActive = false): Promise<GalleryImageItem[]> {
  try {
    let query = supabaseServer.from('gallery_images').select('*').order('display_order', { ascending: true });
    if (onlyActive) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (!error && data) {
      return data as GalleryImageItem[];
    }
  } catch (err) {
    console.warn('Supabase gallery query error:', err);
  }

  return onlyActive ? runtimeStore.gallery.filter((g) => g.is_active) : runtimeStore.gallery;
}

export async function createGalleryImage(item: Omit<GalleryImageItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryImageItem> {
  const newId = `gal-${Date.now()}`;
  const now = new Date().toISOString();
  const payload = { ...item, created_at: now, updated_at: now };

  try {
    const { data, error } = await supabaseServer.from('gallery_images').insert([payload]).select().single();
    if (!error && data) {
      runtimeStore.gallery.push(data as GalleryImageItem);
      return data as GalleryImageItem;
    }
  } catch (err) {
    console.warn('Supabase gallery insert error:', err);
  }

  const created = { id: newId, ...payload };
  runtimeStore.gallery.push(created);
  return created;
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImageItem>): Promise<GalleryImageItem | null> {
  const now = new Date().toISOString();
  try {
    const { data, error } = await supabaseServer
      .from('gallery_images')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      const idx = runtimeStore.gallery.findIndex((g) => g.id === id);
      if (idx !== -1) runtimeStore.gallery[idx] = data as GalleryImageItem;
      return data as GalleryImageItem;
    }
  } catch (err) {
    console.warn('Supabase gallery update error:', err);
  }

  const idx = runtimeStore.gallery.findIndex((g) => g.id === id);
  if (idx !== -1) {
    runtimeStore.gallery[idx] = { ...runtimeStore.gallery[idx], ...updates, updated_at: now };
    return runtimeStore.gallery[idx];
  }
  return null;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseServer.from('gallery_images').delete().eq('id', id);
    if (!error) {
      runtimeStore.gallery = runtimeStore.gallery.filter((g) => g.id !== id);
      return true;
    }
  } catch (err) {
    console.warn('Supabase gallery delete error:', err);
  }

  const prev = runtimeStore.gallery.length;
  runtimeStore.gallery = runtimeStore.gallery.filter((g) => g.id !== id);
  return runtimeStore.gallery.length < prev;
}

// ==========================================
// ABOUT PAGE (OUR STORY)
// ==========================================
export async function getAboutPageData(): Promise<AboutPageData> {
  try {
    const { data, error } = await supabaseServer
      .from('about_page')
      .select('*')
      .limit(1)
      .single();

    if (!error && data) {
      return data as AboutPageData;
    }
  } catch (err) {
    console.warn('Supabase about_page query error, returning fallback:', err);
  }

  return runtimeStore.aboutPage;
}

export async function updateAboutPageData(updates: Partial<AboutPageData>): Promise<AboutPageData> {
  const now = new Date().toISOString();
  try {
    const current = await getAboutPageData();
    const payload = { ...current, ...updates, updated_at: now };
    const { data, error } = await supabaseServer
      .from('about_page')
      .upsert(payload)
      .select()
      .single();

    if (!error && data) {
      runtimeStore.aboutPage = data as AboutPageData;
      return data as AboutPageData;
    }
  } catch (err) {
    console.warn('Supabase about_page upsert error:', err);
  }

  runtimeStore.aboutPage = { ...runtimeStore.aboutPage, ...updates, updated_at: now };
  return runtimeStore.aboutPage;
}

// ==========================================
// METRICS & STATS
// ==========================================
export async function getDashboardStats() {
  const [collections, products, gallery, hero, process] = await Promise.all([
    getCollections(),
    getProducts(),
    getGalleryImages(),
    getHeroSlides(),
    getProcessSteps(),
  ]);

  return {
    totalCollections: collections.length,
    activeCollections: collections.filter((c) => c.is_active).length,
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalGalleryImages: gallery.length,
    activeGalleryImages: gallery.filter((g) => g.is_active).length,
    totalHeroSlides: hero.length,
    activeHeroSlides: hero.filter((h) => h.is_active).length,
    totalProcessSteps: process.length,
    lastUpdated: new Date().toISOString(),
  };
}
