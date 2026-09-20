import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/config';

export function InquiryBanner() {
  return (
    <section className="inquiry-banner">
      <div className="shell inquiry-banner-inner">
        <div>
          {/* <p className="eyebrow">05 / Wholesale & custom</p> */}
          <h2>Looking for<br /><em>something specific?</em></h2>
        </div>
        <div>
          <p>For wholesale requirements, bulk quantities, custom specifications or product inquiries, speak directly with our team.</p>
          <a className="button button-dark" href={whatsappLink('Hello Qadri Horncraft, I would like to discuss a wholesale or custom product inquiry.')} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> Discuss on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
