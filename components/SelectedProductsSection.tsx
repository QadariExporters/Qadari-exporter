import { ProductCard } from './ProductCard';
import { ProductItem } from '@/lib/db/schema';

interface SelectedProductsSectionProps {
  products?: ProductItem[] | any[];
}

export function SelectedProductsSection({ products }: SelectedProductsSectionProps) {
  const allProducts = products || [];
  const featured = allProducts.filter((p) => p.featured !== false && p.is_active !== false);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="selected-section">
      <div className="shell section-pad">
        <div className="section-heading">
          <div>
            <h2>Our<br /><em>products</em></h2>
          </div>
          <p>Browse a selection from the collection. Product information, quantities and customization options are available on request.</p>
        </div>
        <div className="product-grid featured-grid">
          {featured.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
