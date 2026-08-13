import { ProductCard } from './ProductCard';
import { products } from '@/data/products';

export function SelectedProductsSection() {
  return (
    <section className="selected-section">
      <div className="shell section-pad">
        <div className="section-heading">
          <div>
            {/* <p className="eyebrow">04 / Selected pieces</p> */}
            <h2>Our<br /><em>products</em></h2>
          </div>
          <p>Browse a selection from the collection. Product information, quantities and customization options are available on request.</p>
        </div>
        <div className="product-grid featured-grid">
          {products.filter((product) => product.featured).slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
