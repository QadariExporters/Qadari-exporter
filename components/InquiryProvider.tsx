'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '@/data/products';
import { whatsappLink } from '@/lib/config';

interface InquiryItem { product: Product; quantity: number }
interface InquiryContextValue { items: InquiryItem[]; add: (product: Product) => void; remove: (slug: string) => void; clear: () => void; link: string }
const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  useEffect(() => { const saved = localStorage.getItem('qadri-inquiry'); if (saved) setItems(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem('qadri-inquiry', JSON.stringify(items)); }, [items]);
  const add = (product: Product) => setItems((current) => current.some((item) => item.product.slug === product.slug) ? current : [...current, { product, quantity: 1 }]);
  const remove = (slug: string) => setItems((current) => current.filter((item) => item.product.slug !== slug));
  const clear = () => setItems([]);
  const link = useMemo(() => whatsappLink(`Hello Qadri Exporters,\n\nI would like to enquire about:\n\n${items.map((item) => `- ${item.product.name} (quantity: ${item.quantity})`).join('\n')}\n\nPlease share pricing, MOQ, available sizes, customization options and shipping details.\n\nThank you.`), [items]);
  return <InquiryContext.Provider value={{ items, add, remove, clear, link }}>{children}</InquiryContext.Provider>;
}
export function useInquiry() { const context = useContext(InquiryContext); if (!context) throw new Error('useInquiry must be used inside InquiryProvider'); return context; }
