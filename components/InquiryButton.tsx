'use client';
import { Check, Plus } from 'lucide-react';
import { Product } from '@/data/products';
import { useInquiry } from './InquiryProvider';

export function InquiryButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { items, add } = useInquiry();
  const added = items.some((item) => item.product.slug === product.slug);
  return <button type="button" className={compact ? 'text-link' : 'button button-dark'} onClick={() => add(product)} disabled={added}>{added ? <><Check size={15} /> Added to inquiry</> : <><Plus size={15} /> Add to inquiry</>}</button>;
}
