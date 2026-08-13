import type { Metadata } from 'next';
import { ProductsBrowser } from '@/components/ProductsBrowser';
import { products } from '@/data/products';

export const metadata: Metadata = { title: 'Qadri Exporters | Horn Product Collection', description: 'Explore Qadri Exporters natural horn product collection.' };

export default function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  return (
    <main className="page-main">
      <section className="page-hero-image-full" style={{ backgroundImage: "url('/our-collection/buffalo-horn-horn-cutlery.jpg')" }}>
        <div className="shell">
          <p className="eyebrow" style={{ color: '#dbc7af' }}>The collection</p>
          <h1 style={{ color: 'var(--white)' }}>Objects with<br /><em style={{ color: '#dbc7af' }}>natural character.</em></h1>
          <p className="hero-description" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Explore our range of natural horn products. Product information, quantities and customization options are available on request.</p>
        </div>
      </section>
      <section className="shell collection-browser">
        <ProductsBrowser products={products} initialCategory={searchParams.category || 'All'} />
      </section>
    </main>
  );
}
