import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="shell">
        <p className="eyebrow">Start a conversation</p>
        <h2>Let the material<br /><em>make the first impression.</em></h2>
        <Link className="button button-light" href="/contact">Start a conversation <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}
