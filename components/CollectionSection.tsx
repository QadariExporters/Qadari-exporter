import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const collections = [
  { image: '/our-collection/drinking-horn.jpg', title: 'Drinking Horns', label: 'Viking Style' },
  { image: '/our-collection/horn-bowl.jpg', title: 'Horn Bowls', label: 'Premium Quality' },
  { image: '/our-collection/buffalo-horn-horn-cutlery.jpg', title: 'Horn Cutlery', label: 'Handcrafted' },
  { image: '/our-collection/horn-dish-trays.jpg', title: 'Dish & Trays', label: 'Elegant Design' },
  { image: '/our-collection/horn-glasses.jpg', title: 'Horn Glasses', label: 'Drinkware' },
  { image: '/our-collection/horn-Jewelry.jpg', title: 'Horn Jewellery', label: 'Natural Beauty' },
  { image: '/our-collection/horn-massage-tools.jpg', title: 'Massage Tools', label: 'Wellness' },
  { image: '/our-collection/Horn-napkin-rings.jpg', title: 'Napkin Rings', label: 'Table Accessories' },
  { image: '/our-collection/horn-rollers.jpg', title: 'Horn Rollers', label: 'Functional' },
  { image: '/our-collection/horn-scales.jpg', title: 'Horn Scales', label: 'Precision' },
  { image: '/our-collection/horn-shoehorn.jpg', title: 'Shoehorns', label: 'Everyday' },
  { image: '/our-collection/horn-soap-dish.jpg', title: 'Soap Dishes', label: 'Bathroom' }
];

export function CollectionSection() {
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
        {collections.map((item, index) => (
          <Link href="/products" className="collection-card" key={index}>
            <Image src={item.image} alt={item.title} fill className="object-cover" />
            <div className="card-content">
              <span className="card-label">{item.label}</span>
              <h3>{item.title}</h3>
            </div>
            <ArrowUpRight size={19} className="card-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
