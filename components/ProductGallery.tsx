'use client';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useState } from 'react';

interface ProductGalleryProps {
  product: {
    name: string;
    image: string;
    galleryImages?: string[];
    gallery_images?: string[];
  };
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const rawList = [
    product.image,
    ...(product.galleryImages || []),
    ...(product.gallery_images || []),
  ].filter(Boolean);
  const images = Array.from(new Set(rawList));
  const next = () => setActive((current) => (current + 1) % images.length);
  const previous = () => setActive((current) => (current - 1 + images.length) % images.length);

  return (
    <div className="gallery-viewer">
      <div className="gallery-main">
        <img 
          src={images[active]} 
          alt={`${product.name}, image ${active + 1}`} 
        />
        <button className="gallery-expand" onClick={() => setLightbox(true)} aria-label="Open fullscreen">
          <Maximize2 size={18} />
        </button>
        {images.length > 1 && (
          <>
            <button className="gallery-control gallery-prev" onClick={previous} aria-label="Previous image">
              <ChevronLeft size={18} />
            </button>
            <button className="gallery-control gallery-next" onClick={next} aria-label="Next image">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
          {images.map((image, index) => (
            <button 
              key={image} 
              className={active === index ? 'active' : ''} 
              onClick={() => setActive(index)} 
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-20 md:h-24 object-cover" 
              />
            </button>
          ))}
        </div>
      )}
      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Close">
            <X />
          </button>
          <img src={images[active]} alt={product.name} />
          {images.length > 1 && (
            <>
              <button className="gallery-control gallery-prev" onClick={previous} aria-label="Previous image">
                <ChevronLeft />
              </button>
              <button className="gallery-control gallery-next" onClick={next} aria-label="Next image">
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
