import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CollectionItem } from '@/lib/db/schema';
import { defaultCollections } from '@/lib/db/default-data';

interface CollectionSectionProps {
  items?: CollectionItem[];
}

export function CollectionSection({ items }: CollectionSectionProps) {
  const collectionList = (items && items.length > 0) ? items : defaultCollections;

  return (
    <section className="collection-section shell section-pad">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Our collection</p>
          <h2>Explore the<br /><em>collection</em></h2>
        </div>
        <Link href="/products" className="text-link">View all products <ArrowUpRight size={16} /></Link>
      </div>
      <div className="collection-cards">
        {collectionList.map((item, index) => (
          <Link href={item.link || `/products?category=${encodeURIComponent(item.name || item.title)}`} className="collection-card" key={item.id || index}>
            <Image src={item.image} alt={item.title || item.name} fill className="object-cover" />
            <div className="card-content">
              {item.label && <span className="card-label">{item.label}</span>}
              <h3>{item.title || item.name}</h3>
            </div>
            <ArrowUpRight size={19} className="card-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
