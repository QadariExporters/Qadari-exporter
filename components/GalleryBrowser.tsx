'use client';
import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AssetVisual } from './AssetVisual';

export interface GalleryBrowserItem {
  id?: string;
  category: string;
  kind?: string;
  label: string;
  src: string;
}

const gallery: GalleryBrowserItem[] = [
  { id: 'gal-static-1', category: 'Products', kind: 'gallery-one', label: 'A quiet study in natural tone', src: '/our-collection/drinking-horn.jpg' },
  { id: 'gal-static-2', category: 'Products', kind: 'gallery-two', label: 'Material and silhouette', src: '/our-collection/horn-bowl.jpg' },
  { id: 'gal-static-3', category: 'Craftsmanship', kind: 'gallery-three', label: 'From material to form', src: '/hero-images/horn-massage-tools.jpg' },
  { id: 'gal-static-4', category: 'Details', kind: 'gallery-four', label: 'The detail makes the object', src: '/our-collection/horn-napkin-rings.jpg' },
  { id: 'gal-static-5', category: 'Products', kind: 'gallery-five', label: 'Objects with presence', src: '/our-collection/buffalo-horn-horn-cutlery.jpg' },
  { id: 'gal-static-6', category: 'Craftsmanship', kind: 'gallery-six', label: 'A closer look at crafting', src: '/hero-images/horn-rollers.jpg' },
  { id: 'gal-static-7', category: 'Details', kind: 'gallery-seven', label: 'Natural variation of horn grain', src: '/our-collection/horn-dish-trays.jpg' },
  { id: 'gal-static-8', category: 'Products', kind: 'gallery-eight', label: 'Selected handcrafted pieces', src: '/our-collection/horn-soap-dish.jpg' },
  { id: 'gal-static-9', category: 'Craftsmanship', kind: 'gallery-nine', label: 'The final polished surface', src: '/hero-images/horn-scales.jpg' },
  { id: 'gal-static-10', category: 'Details', kind: 'gallery-ten', label: 'Tactile and functional by nature', src: '/our-collection/horn-shoehorn.jpg' },
  { id: 'gal-static-11', category: 'Products', kind: 'gallery-eleven', label: 'Modern curves and organic lines', src: '/our-collection/horn-glasses.jpg' },
  { id: 'gal-static-12', category: 'Products', kind: 'gallery-twelve', label: 'Premium material selections', src: '/our-collection/horn-Jewelry.jpg' }
];

export function GalleryBrowser({
  items: initialItems,
  categories: initialCategories,
}: {
  items?: GalleryBrowserItem[];
  categories?: string[];
}) {
  const items = initialItems && initialItems.length > 0 ? initialItems : gallery;
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<number | null>(null);

  const filterList = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return ['All', ...Array.from(new Set(initialCategories.filter((c) => c !== 'Home Gallery')))];
    }
    const cats = Array.from(new Set(items.map((i) => i.category).filter((c) => Boolean(c) && c !== 'Home Gallery')));
    return ['All', ...(cats.length > 0 ? cats : ['Products', 'Craftsmanship', 'Details'])];
  }, [initialCategories, items]);

  const shown = useMemo(() => {
    return filter === 'All'
      ? items.filter((item) => item.category !== 'Home Gallery')
      : items.filter((item) => item.category?.toLowerCase() === filter.toLowerCase());
  }, [filter, items]);
  
  return (
    <>
      <div className="gallery-filters">
        {filterList.map((item) => (
          <button
            key={item}
            className={filter.toLowerCase() === item.toLowerCase() ? 'active' : ''}
            onClick={() => {
              setFilter(item);
              setActive(null);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      
      {shown.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <p className="text-sm">No photographs found in this category.</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {shown.map((item, index) => (
            <button 
              className={`masonry-item masonry-${index % 5} group overflow-hidden relative block w-full text-left`} 
              key={item.id || `${item.src}-${index}`} 
              onClick={() => setActive(index)}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.label || 'Gallery photograph'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#dbc7af] mb-1 font-semibold">
                    {item.category}
                  </span>
                  <span className="text-white text-xs font-serif leading-tight">
                    {item.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {active !== null && shown[active] && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">
            <X />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={shown[active].src}
              alt={shown[active].label}
              className="max-h-[82vh] max-w-[90vw] object-contain mx-auto rounded-md shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            />
            <div className="text-center mt-3 text-white">
              <span className="text-xs uppercase tracking-widest text-[#dbc7af] font-mono block">
                {shown[active].category}
              </span>
              <p className="text-sm text-stone-200 mt-0.5 font-serif">
                {shown[active].label}
              </p>
            </div>
          </div>
          
          {shown.length > 1 && (
            <>
              <button 
                className="gallery-control gallery-prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((active - 1 + shown.length) % shown.length);
                }} 
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              
              <button 
                className="gallery-control gallery-next" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((active + 1) % shown.length);
                }} 
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

