import type { Metadata } from 'next';
import { ProductsBrowser } from '@/components/ProductsBrowser';
import { products as fallbackProducts } from '@/data/products';
import { getProducts } from '@/lib/db/service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Qadri Exporters | Horn Product Collection',
  description: 'Explore Qadri Exporters natural horn product collection.',
};

export default async function ProductsPage() {
  let productsList = fallbackProducts;

  try {
    const dbProducts = await getProducts(true);

    if (dbProducts && dbProducts.length > 0) {
      // Map dbProducts to Product interface
      productsList = dbProducts.map((p) => ({
        ...p,
        shortDescription: p.short_description || p.description || '',
        galleryImages: p.gallery_images || [],
      }));
    }
  } catch (err) {
    console.warn('Failed to load dynamic products, using fallback:', err);
  }

  return (
    <main className="page-main">
      <section
        className="page-hero-image-full"
        style={{ backgroundImage: "url('/our-collection/buffalo-horn-horn-cutlery.jpg')" }}
      >
        <div className="shell">
          <p className="eyebrow" style={{ color: '#dbc7af' }}>
            The collection
          </p>
          <h1 style={{ color: 'var(--white)' }}>
            Objects with
            <br />
            <em style={{ color: '#dbc7af' }}>natural character.</em>
          </h1>
          <p className="hero-description" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Explore our range of natural horn products. Product information, quantities and customization
            options are available on request.
          </p>
        </div>
      </section>
      <section className="shell collection-browser">
        <ProductsBrowser products={productsList} />
      </section>
    </main>
  );
}

