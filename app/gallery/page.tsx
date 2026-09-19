import type { Metadata } from 'next';
import { GalleryBrowser } from '@/components/GalleryBrowser';
import { getGalleryImages } from '@/lib/db/service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Qadri Exporters | Product & Craft Gallery',
  description: 'A closer look at the materials, forms and details in the Qadri Exporters collection.',
};

export default async function GalleryPage() {
  const dbImages = await getGalleryImages(true);
  
  const galleryItems = dbImages.map((img) => ({
    id: img.id,
    category: img.category || 'Products',
    label: img.label || img.title || 'Horn Craft Detail',
    src: img.image,
  }));

  const categories = Array.from(new Set(dbImages.map((img) => img.category).filter(Boolean)));

  return (
    <main className="page-main">
      <section
        className="page-hero-image-full"
        style={{ backgroundImage: "url('/hero-images/drinking-horn-and-tankards.jpg')" }}
      >
        <div className="shell">
          <p className="eyebrow" style={{ color: '#dbc7af' }}>
            The visual archive
          </p>
          <h1 style={{ color: 'var(--white)' }}>
            The craft
            <br />
            <em style={{ color: '#dbc7af' }}>in detail.</em>
          </h1>
          <p className="hero-description" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Product, process and natural variation — a closer look at the language of horn.
          </p>
        </div>
      </section>
      <section className="shell gallery-page-content">
        <GalleryBrowser items={galleryItems} categories={categories} />
      </section>
    </main>
  );
}

