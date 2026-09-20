  'use client';
import { X, ArrowRight, Trash2, MessageCircle } from 'lucide-react';
import { useInquiry } from './InquiryProvider';
import { whatsappLink } from '@/lib/config';

export function InquirySidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, remove, link } = useInquiry();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`inquiry-sidebar-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={`inquiry-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="inquiry-sidebar-header">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2>{items.length.toString().padStart(2, '0')} <em>pieces</em></h2>
          </div>
          <button 
            className="inquiry-sidebar-close"
            onClick={onClose}
            aria-label="Close inquiry sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="inquiry-sidebar-content">
          {!items.length ? (
            <div className="empty-state">
              <p>Your inquiry list is empty.</p>
              <p className="muted">Add products as you browse, then send one considered message to the Qadri Horncraft team.</p>
              <a 
                className="button button-whatsapp" 
                href={whatsappLink('Hello Qadri Horncraft, I would like to make a product inquiry.')} 
                target="_blank" 
                rel="noreferrer"
              >
                Send inquiry on WhatsApp <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div className="inquiry-sidebar-items">
              {items.map(({ product, quantity }) => (
                <div className="inquiry-sidebar-item" key={product.slug}>
                  <div className="inquiry-sidebar-thumb">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="inquiry-sidebar-details">
                    <p className="eyebrow">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="muted">Quantity: {quantity}</p>
                  </div>
                  <button 
                    className="inquiry-sidebar-remove"
                    onClick={() => remove(product.slug)}
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="inquiry-sidebar-footer">
            <p>Send your selected products directly to the Qadri Horncraft team for pricing, quantities and product information.</p>
            <a 
              className="button button-whatsapp" 
              href={link} 
              target="_blank" 
              rel="noreferrer"
            >
              Send inquiry on WhatsApp <ArrowRight size={16} />
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
