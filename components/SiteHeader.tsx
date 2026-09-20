'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInquiry } from './InquiryProvider';
import { InquirySidebar } from './InquirySidebar';
import { whatsappLink } from '@/lib/config';

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false); 
  const [open, setOpen] = useState(false); 
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { items } = useInquiry();

  useEffect(() => { 
    const handle = () => setScrolled(window.scrollY > 40); 
    window.addEventListener('scroll', handle); 
    return () => window.removeEventListener('scroll', handle); 
  }, []);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const links = [
    ['Products', '/products'],
    ['Gallery', '/gallery'],
    ['Our Story', '/about'],
    ['Contact', '/contact'],
  ];
  const isDarkTextPage = pathname.startsWith('/products') || ['/gallery', '/about', '/contact'].includes(pathname);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="shell nav-inner">
          <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
            <img
              src="/logo.png"
              alt="Qadri Horncraft"
              className="logo-img"
            />
          </Link>
          <nav className="desktop-nav">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="inquiry-link" onClick={() => setInquiryOpen(true)}>
              Inquiry <span>{items.length.toString().padStart(2, '0')}</span>
            </button>
            <a href={whatsappLink('Hello Qadri Horncraft, I would like to make a product inquiry.')} className="whatsapp-link" target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="mobile-menu">
            <nav>
              {links.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
            <button className="inquiry-link" onClick={() => { setInquiryOpen(true); setOpen(false); }}>
              Inquiry list <span>{items.length}</span>
            </button>
            <a 
              href={whatsappLink('Hello Qadri Horncraft, I would like to make a product inquiry.')} 
              target="_blank" 
              rel="noreferrer" 
              className="mobile-menu-whatsapp"
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap' }}
            >
              <MessageCircle size={16} style={{ display: 'inline-block', flexShrink: 0 }} />
              <span>WhatsApp</span>
            </a>
          </div>
        )}
      </header>
      <InquirySidebar isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
