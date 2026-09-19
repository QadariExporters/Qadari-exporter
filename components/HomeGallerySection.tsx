import Link from 'next/link';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { GalleryImageItem } from '@/lib/db/schema';

interface HomeGallerySectionProps {
  images?: GalleryImageItem[];
}

export function HomeGallerySection({ images }: HomeGallerySectionProps) {
  const activeImages = (images || []).filter((img) => img.is_active !== false);

  if (activeImages.length === 0) {
    return null; // Don't display empty section or gallery page items
  }

  const isFour = activeImages.length === 4;

  return (
    <section className="home-gallery shell section-pad">
      <div className="section-heading">
        <div>
          <p className="eyebrow">06 / Editorial gallery</p>
          <h2>The craft<br /><em>in detail</em></h2>
        </div>
        <Link href="/gallery" className="text-link">Open gallery <ArrowRight size={16} /></Link>
      </div>
      <div className={`home-gallery-grid ${isFour ? 'home-gallery-grid-4' : 'home-gallery-grid-flexible'}`}>
        {activeImages.map((item, index) => (
          <div
            key={item.id || index}
            className={`home-gallery-item group overflow-hidden relative rounded-xs bg-stone-100 ${
              isFour ? `home-gallery-tile-${index}` : ''
            }`}
          >
            <img
              src={item.image}
              alt={item.alt_text || item.label || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {(item.label || item.title) && (
              <span className="absolute bottom-3 left-3 text-white text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/60 px-2 py-1 rounded backdrop-blur-xs">
                {item.label || item.title}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
