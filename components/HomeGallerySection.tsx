import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HomeGallerySection() {
  return (
    <section className="home-gallery shell section-pad">
      <div className="section-heading">
        <div>
          <p className="eyebrow">06 / Editorial gallery</p>
          <h2>The craft<br /><em>in detail</em></h2>
        </div>
        <Link href="/gallery" className="text-link">Open gallery <ArrowRight size={16} /></Link>
      </div>
      <div className="home-gallery-grid">
        <img src="/our-collection/drinking-horn.jpg" alt="Gallery image 1" />
        <img src="/our-collection/horn-bowl.jpg" alt="Gallery image 2" />
        <img src="/our-collection/buffalo-horn-horn-cutlery.jpg" alt="Gallery image 3" />
        <img src="/our-collection/horn-dish-trays.jpg" alt="Gallery image 4" />
      </div>
    </section>
  );
}
