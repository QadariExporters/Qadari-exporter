import type { Metadata } from 'next';
import { GalleryBrowser } from '@/components/GalleryBrowser';

export const metadata: Metadata = { title: 'Qadri Exporters | Product & Craft Gallery', description: 'A closer look at the materials, forms and details in the Qadri Exporters collection.' };

export default function GalleryPage() {
  return (
    <main className="page-main">
      <section className="page-hero-image-full" style={{ backgroundImage: "url('/hero-images/drinking-horn-and-tankards.jpg')" }}>
        <div className="shell">
          <p className="eyebrow" style={{ color: '#dbc7af' }}>The visual archive</p>
          <h1 style={{ color: 'var(--white)' }}>The craft<br /><em style={{ color: '#dbc7af' }}>in detail.</em></h1>
          <p className="hero-description" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Product, process and natural variation — a closer look at the language of horn.</p>
        </div>
      </section>
      <section className="shell gallery-page-content">
        <GalleryBrowser />
      </section>
    </main>
  );
}
