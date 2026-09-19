'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { whatsappLink, PHONE_NUMBER, PHONE_HREF } from '@/lib/config';

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="shell footer-links">
        <div>
          <p className="footer-label">Explore</p>
          <Link href="/products">Collections</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">Our Story</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <p className="footer-label">Categories</p>
          <Link href="/products">Horn Combs</Link>
          <Link href="/products">Horn Buttons</Link>
          <Link href="/products">Horn Jewellery</Link>
          <Link href="/products">Horn Utensils</Link>
        </div>
        <div>
          <p className="footer-label">Contact Us</p>
          <a href={PHONE_HREF} style={{ color: 'rgba(255, 255, 255, 0.72)', textDecoration: 'none' }}>
            Phone: {PHONE_NUMBER}
          </a>
          <a 
            href={whatsappLink('Hello Qadri Exporters, I would like to make an inquiry.')} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: 'rgba(255, 255, 255, 0.72)', textDecoration: 'none' }}
          >
            WhatsApp: {PHONE_NUMBER}
          </a>
          <Link href="/contact">Direct Inquiry Form</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Qadri Exporters</span>
        <span>Natural horn products, shaped with care.</span>
        <span>
          <Link href="/contact">Privacy</Link> <Link href="/contact">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
