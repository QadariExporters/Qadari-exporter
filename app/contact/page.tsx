import type { Metadata } from 'next';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { whatsappLink, PHONE_NUMBER, PHONE_HREF } from '@/lib/config';

export const metadata: Metadata = { title: 'Qadri Horncraft | Contact & Product Enquiries', description: 'Start a product, wholesale or custom inquiry with Qadri Horncraft.' };

export default function ContactPage() {
  return (
    <main className="page-main">
      <section className="page-hero-image-full" style={{ backgroundImage: "url('/hero-images/horn-bowls.jpg')" }}>
        <div className="shell">
          <p className="eyebrow" style={{ color: '#dbc7af' }}>Start a conversation</p>
          <h1 style={{ color: 'var(--white)' }}>Let&apos;s create<br /><em style={{ color: '#dbc7af' }}>something together.</em></h1>
          <p className="hero-description" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>For product information, wholesale requirements or custom specifications, speak directly with the Qadri Horncraft team.</p>
        </div>
      </section>
      <section className="shell contact-layout section-pad">
        <div className="contact-info">
          <p className="eyebrow">Get in touch</p>
          <h2>Bring us<br /><em>your inquiry.</em></h2>
          <p>For custom manufacturing, export inquiries, or catalog details, contact us directly via phone or WhatsApp.</p>
          <div className="contact-details">
            <div>
              <Phone size={17} />
              <span>
                Phone
                <br />
                <a href={PHONE_HREF} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <strong>{PHONE_NUMBER}</strong>
                </a>
              </span>
            </div>
            <div>
              <MessageCircle size={17} />
              <span>
                WhatsApp
                <br />
                <a 
                  href={whatsappLink('Hello Qadri Horncraft, I would like to make a product inquiry.')} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <strong>{PHONE_NUMBER}</strong>
                </a>
              </span>
            </div>
          </div>
          <a className="button button-whatsapp" href={whatsappLink('Hello Qadri Horncraft, I would like to make a product inquiry.')} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
        <div className="contact-form-wrap">
          <p className="eyebrow">Product enquiry</p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
