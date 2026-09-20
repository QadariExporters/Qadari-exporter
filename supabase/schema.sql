-- ================================================================
-- QADRI HORNCRAFT - DATABASE SCHEMA & INITIAL SEED DATA
-- Note: Does NOT use Supabase Auth. Uses custom `admins` table.
-- ================================================================

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. HERO SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.hero_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eyebrow VARCHAR(255) DEFAULT '',
    title TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    button_1_text VARCHAR(255) DEFAULT 'Explore collection',
    button_1_link VARCHAR(255) DEFAULT '/products',
    button_2_text VARCHAR(255) DEFAULT 'Enquire on WhatsApp',
    button_2_link VARCHAR(255) DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ABOUT SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.about_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eyebrow VARCHAR(255) DEFAULT 'About Qadri Horncraft',
    heading TEXT NOT NULL,
    subheading TEXT DEFAULT '',
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    button_text VARCHAR(255) DEFAULT 'Discover our story',
    button_link VARCHAR(255) DEFAULT '/about',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    label VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT '',
    image TEXT NOT NULL,
    slug VARCHAR(255) DEFAULT '',
    link VARCHAR(255) DEFAULT '/products',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) DEFAULT '',
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) NOT NULL DEFAULT 'Decorative',
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image TEXT NOT NULL,
    material VARCHAR(255) DEFAULT '',
    finish VARCHAR(255) DEFAULT '',
    size VARCHAR(255) DEFAULT '',
    color VARCHAR(255) DEFAULT '',
    customization VARCHAR(255) DEFAULT '',
    moq VARCHAR(255) DEFAULT '',
    featured BOOLEAN NOT NULL DEFAULT true,
    gallery_images TEXT[] DEFAULT '{}',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROCESS STEPS TABLE
CREATE TABLE IF NOT EXISTS public.process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. EDITORIAL GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) DEFAULT '',
    label VARCHAR(255) DEFAULT '',
    category VARCHAR(255) NOT NULL DEFAULT 'Products',
    image TEXT NOT NULL,
    alt_text VARCHAR(255) DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_hero_order ON public.hero_sections(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_about_order ON public.about_sections(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_collections_order ON public.collections(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category, is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured, is_active);
CREATE INDEX IF NOT EXISTS idx_process_order ON public.process_steps(display_order, is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON public.gallery_images(display_order, is_active);

-- DEFAULT ADMIN USER (admin@qadriexporters.com / admin123)
-- Hash generated using bcrypt
INSERT INTO public.admins (name, email, password_hash, role)
VALUES ('Super Admin', 'admin@qadriexporters.com', '$2b$10$qpOzkHdiJF8hOd3TKcMtkuxSMJRHf.PcWBsMZ44yB9G4a8WPEK.6e', 'superadmin')
ON CONFLICT (email) DO NOTHING;

