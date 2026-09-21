import Link from 'next/link';
import { Product } from '@/data/products';
import { whatsappLink, productInquiryMessage } from '@/lib/config';

export function ProductCard({ product }: { product: Product }) {
  const formattedPrice =
    product.price !== undefined && product.price !== null && product.price !== ''
      ? typeof product.price === 'number'
        ? `₹${product.price.toFixed(2)}`
        : `₹${product.price}`
      : null;

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image">
        <img 
          src={product.image} 
          alt={product.name} 
        />
      </Link>
      <div className="product-meta">
        <div>
          <p className="eyebrow">{product.category}</p>
          <Link href={`/products/${product.slug}`}>
            <h3>{product.name}</h3>
          </Link>
        </div>
        {formattedPrice && (
          <div className="product-price-badge">
            <span className="product-price-val">{formattedPrice}</span>
          </div>
        )}
      </div>
      <div className="product-card-actions">
        <Link href={`/products/${product.slug}`} className="product-card-btn product-card-btn-view">
          View Details
        </Link>
        <a
          href={whatsappLink(productInquiryMessage(product.name))}
          target="_blank"
          rel="noreferrer"
          className="product-card-btn product-card-btn-contact"
        >
          Contact Now
        </a>
      </div>
    </article>
  );
}
