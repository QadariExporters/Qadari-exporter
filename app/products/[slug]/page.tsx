import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, products } from '@/data/products';
import { getProductBySlug, getProducts } from '@/lib/db/service';
import { ProductGallery } from '@/components/ProductGallery';
import { InquiryButton } from '@/components/InquiryButton';
import { whatsappLink, productInquiryMessage } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dbProduct = await getProductBySlug(params.slug);
  const staticProduct = getProduct(params.slug);
  const product = dbProduct || staticProduct;

  return {
    title: product ? `${product.name} | Qadri Horncraft` : 'Product | Qadri Horncraft',
    description: product ? (product.short_description || product.shortDescription || product.description) : undefined,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const dbProduct = await getProductBySlug(params.slug);
  const staticProduct = getProduct(params.slug);
  const rawProduct = dbProduct || staticProduct;

  if (!rawProduct) {
    notFound();
  }

  // Normalise product object
  const product = {
    ...rawProduct,
    shortDescription: rawProduct.short_description || rawProduct.shortDescription || '',
    galleryImages: rawProduct.gallery_images || rawProduct.galleryImages || [],
  };

  const formattedPrice =
    product.price !== undefined && product.price !== null && product.price !== ''
      ? typeof product.price === 'number'
        ? `₹${product.price.toFixed(2)}`
        : `₹${product.price}`
      : null;

  const specs: [string, string | undefined][] = [
    ...(formattedPrice ? ([['Price', `${formattedPrice} INR / Piece`]] as [string, string][]) : []),
    ['Material', product.material || 'Natural horn'],
    ['Finish', product.finish || 'Polished'],
    ['Size', product.size || 'Available on request'],
    ['Colour', product.color || 'Natural variation'],
    ['Customization', product.customization || 'Available on request'],
    ['MOQ', product.moq ? product.moq.replace(/\s*pcs\b/gi, '').trim() : '100'],
  ];

  return (
    <main className="page-main product-detail-page">
      <div className="shell breadcrumb">
        <Link href="/products">
          <ArrowLeft size={15} /> Back to collection
        </Link>
      </div>

      <div className="shell detail-layout">
        <ProductGallery product={product} />

        <div className="detail-copy">
          {product.category && <p className="eyebrow">{product.category}</p>}
          <h1>{product.name}</h1>
          {formattedPrice && (
            <div className="detail-price-badge">
              <span className="price-amount">{formattedPrice}</span>
              <span className="price-unit">INR / Piece (FOB)</span>
            </div>
          )}
          <p className="detail-description">{product.description || product.shortDescription}</p>

          <div className="detail-actions">
            <InquiryButton product={product} />
            <a
              className="button button-whatsapp"
              href={whatsappLink(productInquiryMessage(product.name))}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Enquire on WhatsApp
            </a>
          </div>

          <div className="spec-list">
            {specs.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value || 'Available on request'}</strong>
              </div>
            ))}
          </div>

          <p className="detail-note">
            Specific product information, pricing, quantities and shipping details are shared directly for each inquiry.
          </p>
        </div>
      </div>

      <div className="shell next-product">
        <Link href="/products">
          <span>Continue exploring</span>
          <strong>
            Return to collection <ArrowRight size={16} />
          </strong>
        </Link>
      </div>
    </main>
  );
}

