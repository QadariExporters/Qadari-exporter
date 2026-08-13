'use client';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AssetVisual } from './AssetVisual';

const gallery = [
  { category: 'Products', kind: 'gallery-one', label: 'A quiet study in natural tone', src: '/our-collection/drinking-horn.jpg' },
  { category: 'Products', kind: 'gallery-two', label: 'Material and silhouette', src: '/our-collection/horn-bowl.jpg' },
  { category: 'Craftsmanship', kind: 'gallery-three', label: 'From material to form', src: '/hero-images/horn-massage-tools.jpg' },
  { category: 'Details', kind: 'gallery-four', label: 'The detail makes the object', src: '/our-collection/horn-napkin-rings.jpg' },
  { category: 'Products', kind: 'gallery-five', label: 'Objects with presence', src: '/our-collection/buffalo-horn-horn-cutlery.jpg' },
  { category: 'Craftsmanship', kind: 'gallery-six', label: 'A closer look at crafting', src: '/hero-images/horn-rollers.jpg' },
  { category: 'Details', kind: 'gallery-seven', label: 'Natural variation of horn grain', src: '/our-collection/horn-dish-trays.jpg' },
  { category: 'Products', kind: 'gallery-eight', label: 'Selected handcrafted pieces', src: '/our-collection/horn-soap-dish.jpg' },
  { category: 'Craftsmanship', kind: 'gallery-nine', label: 'The final polished surface', src: '/hero-images/horn-scales.jpg' },
  { category: 'Details', kind: 'gallery-ten', label: 'Tactile and functional by nature', src: '/our-collection/horn-shoehorn.jpg' },
  { category: 'Products', kind: 'gallery-eleven', label: 'Modern curves and organic lines', src: '/our-collection/horn-glasses.jpg' },
  { category: 'Products', kind: 'gallery-twelve', label: 'Premium material selections', src: '/our-collection/horn-Jewelry.jpg' }
];

export function GalleryBrowser() {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<number | null>(null);
  const shown = filter === 'All' ? gallery : gallery.filter((item) => item.category === filter);
  
  return (
    <>
      <div className="gallery-filters">
        {['All', 'Products', 'Craftsmanship', 'Details'].map((item) => (
          <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
      
      <div className="masonry-grid">
        {shown.map((item, index) => (
          <button 
            className={`masonry-item masonry-${index % 5} group overflow-hidden relative block w-full text-left`} 
            key={`${item.kind}-${filter}`} 
            onClick={() => setActive(index)}
          >
            <AssetVisual kind={item.kind} label={item.label} src={item.src} />
            <span className="absolute bottom-4 left-4 text-white uppercase tracking-widest text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      
      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">
            <X />
          </button>
          
          <AssetVisual kind={shown[active].kind} label={shown[active].label} src={shown[active].src} className="scale-95 duration-500 animate-in fade-in" />
          
          <button 
            className="gallery-control gallery-prev" 
            onClick={() => setActive((active - 1 + shown.length) % shown.length)} 
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          
          <button 
            className="gallery-control gallery-next" 
            onClick={() => setActive((active + 1) % shown.length)} 
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
