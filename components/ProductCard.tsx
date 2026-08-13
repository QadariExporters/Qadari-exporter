import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/data/products';
import { InquiryButton } from './InquiryButton';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image">
        <img 
          src={product.image} 
          alt={product.name} 
        />
        <span className="product-arrow">
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="product-meta">
        <div>
          <p className="eyebrow">{product.category}</p>
          <Link href={`/products/${product.slug}`}>
            <h3>{product.name}</h3>
          </Link>
        </div>
        <InquiryButton product={product} compact />
      </div>
      <Link href={`/products/${product.slug}`} className="product-view">
        View details <ArrowUpRight size={15} />
      </Link>
    </article>
  );
}
