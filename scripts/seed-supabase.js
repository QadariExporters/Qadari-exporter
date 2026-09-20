const { createClient } = require('@supabase/supabase-js');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase environment variables missing');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Default data (without hardcoded string IDs so Postgres generates UUIDs)
const heroSlides = [
  {
    eyebrow: 'Viking Heritage',
    title: 'AUTHENTIC VIKING\nDRINKING HORNS.',
    description: 'Handcrafted buffalo horn tankards for true enthusiasts and themed bars.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/drinking-horn-and-tankards.jpg',
    button_1_text: 'Explore collection',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 1,
    is_active: true,
  },
  {
    eyebrow: 'Serving Bowls',
    title: 'HANDMADE HORN\nSERVING BOWLS.',
    description: 'Natural buffalo horn bowls with matching cutlery for elegant dining.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-bowls.jpg',
    button_1_text: 'View collection',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 2,
    is_active: true,
  },
  {
    eyebrow: 'Dining Cutlery',
    title: 'PREMIUM HORN\nCUTLERY SETS.',
    description: 'Handcrafted knives, forks and spoons with natural buffalo horn handles.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-cutlery.jpg',
    button_1_text: 'Discover our story',
    button_1_link: '/about',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 3,
    is_active: true,
  },
  {
    eyebrow: 'Business Inquiry',
    title: 'Dishes\n& Trays',
    description: 'Authentic Craftsmanship Unique Design',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-dish-and-trays.jpg',
    button_1_text: 'Start an inquiry',
    button_1_link: '/contact',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 4,
    is_active: true,
  },
  {
    eyebrow: 'Horn Drinkware',
    title: 'LUXURY HORN\nTUMBLERS & GLASSES.',
    description: 'Brass-rimmed horn glasses and Viking tumblers for sophisticated drinkware collections.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-glasses.jpg',
    button_1_text: 'View glasses',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 5,
    is_active: true,
  },
  {
    eyebrow: 'Horn Jewellery',
    title: 'ETHICAL HORN\nJEWELLERY.',
    description: 'Handcrafted earrings, bracelets and necklaces from ethically sourced buffalo horn.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-jewellery.jpg',
    button_1_text: 'Explore jewellery',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 6,
    is_active: true,
  },
  {
    eyebrow: 'Gua Sha Tools',
    title: 'NATURAL HORN\nGUA SHA TOOLS.',
    description: 'Traditional massage combs and facial tools for wellness and skincare routines.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-massage-tools.jpg',
    button_1_text: 'View tools',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 7,
    is_active: true,
  },
  {
    eyebrow: 'Table Settings',
    title: 'HORN NAPKIN\nRINGS.',
    description: 'Hand-polished napkin rings adding rustic elegance to any dining table.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-napkin-rings.jpg',
    button_1_text: 'Shop accessories',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 8,
    is_active: true,
  },
  {
    eyebrow: 'Craft Materials',
    title: 'HORN TURNING\nROLLS.',
    description: 'Polished horn cylinders for knife handles, pipe making and premium craft applications.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-rollers.jpg',
    button_1_text: 'View rollers',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 9,
    is_active: true,
  },
  {
    eyebrow: 'Precision Scales',
    title: 'LUXURY HANDMADE\nHorn Scales.',
    description: 'Perfect for Knife & Handle Makers',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-scales.jpg',
    button_1_text: 'Explore scales',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 10,
    is_active: true,
  },
  {
    eyebrow: 'Shoe Care',
    title: 'LUXURY HORN\nSHOE HORNS.',
    description: 'Handcrafted shoehorns protecting footwear while adding sophisticated elegance.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-shoehorns.jpg',
    button_1_text: 'View shoehorns',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 11,
    is_active: true,
  },
  {
    eyebrow: 'Bath Accessories',
    title: 'HORN SOAP\nDISHES.',
    description: 'Natural horn soap dishes bringing luxury and elegance to bathroom spaces.',
    image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-soap-dishes.jpg',
    button_1_text: 'Shop dishes',
    button_1_link: '/products',
    button_2_text: 'Enquire on WhatsApp',
    button_2_link: '',
    display_order: 12,
    is_active: true,
  },
];

const aboutSection = {
  eyebrow: 'About Qadri HornCraft',
  heading: 'the character of natural horn',
  subheading: 'Authentic Craftsmanship & Ethically Sourced',
  description: 'Natural horn carries its own variations in tone, texture and pattern. These characteristics give each finished piece a distinctive visual identity.',
  image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/about_qadri.png',
  button_text: 'Discover our story',
  button_link: '/about',
  display_order: 1,
  is_active: true,
};

const collections = [
  { name: 'Drinking Horns', title: 'Drinking Horns', label: 'Viking Style', description: 'Handcrafted buffalo horn tankards and glasses.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg', slug: 'drinking-horns', link: '/products', display_order: 1, is_active: true },
  { name: 'Horn Bowls', title: 'Horn Bowls', label: 'Premium Quality', description: 'Refined serving bowls retaining natural horn character.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-bowl.jpg', slug: 'horn-bowls', link: '/products', display_order: 2, is_active: true },
  { name: 'Horn Cutlery', title: 'Horn Cutlery', label: 'Handcrafted', description: 'Organic dining utensils with polished horn handles.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/buffalo-horn-horn-cutlery.jpg', slug: 'horn-cutlery', link: '/products', display_order: 3, is_active: true },
  { name: 'Dish & Trays', title: 'Dish & Trays', label: 'Elegant Design', description: 'Decorative valet trays and vanity dishes.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg', slug: 'dish-trays', link: '/products', display_order: 4, is_active: true },
  { name: 'Horn Glasses', title: 'Horn Glasses', label: 'Drinkware', description: 'Modern tumbler shapes in organic material.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-glasses.jpg', slug: 'horn-glasses', link: '/products', display_order: 5, is_active: true },
  { name: 'Horn Jewellery', title: 'Horn Jewellery', label: 'Natural Beauty', description: 'Sustainably crafted earrings, bracelets and pendants.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-Jewelry.jpg', slug: 'horn-jewellery', link: '/products', display_order: 6, is_active: true },
  { name: 'Massage Tools', title: 'Massage Tools', label: 'Wellness', description: 'Gua Sha tools and combs for natural therapy.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-massage-tools.jpg', slug: 'massage-tools', link: '/products', display_order: 7, is_active: true },
  { name: 'Napkin Rings', title: 'Napkin Rings', label: 'Table Accessories', description: 'Sculptural dining accessories in marbled horn.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/Horn-napkin-rings.jpg', slug: 'napkin-rings', link: '/products', display_order: 8, is_active: true },
  { name: 'Horn Rollers', title: 'Horn Rollers', label: 'Functional', description: 'Skincare rollers and cylindrical craft rolls.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-rollers.jpg', slug: 'horn-rollers', link: '/products', display_order: 9, is_active: true },
  { name: 'Horn Scales', title: 'Horn Scales', label: 'Precision', description: 'Knife handle slabs and pen blanks.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-scales.jpg', slug: 'horn-scales', link: '/products', display_order: 10, is_active: true },
  { name: 'Shoehorns', title: 'Shoehorns', label: 'Everyday', description: 'Ergonomic handcrafted horn shoehorns.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-shoehorn.jpg', slug: 'shoehorns', link: '/products', display_order: 11, is_active: true },
  { name: 'Soap Dishes', title: 'Soap Dishes', label: 'Bathroom', description: 'Water-resistant natural horn bathroom accessories.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-soap-dish.jpg', slug: 'soap-dishes', link: '/products', display_order: 12, is_active: true },
];

const products = [
  { slug: 'horn-bowl-01', name: 'Premium Horn Bowl', title: 'Premium Horn Bowl', category: 'Decorative', short_description: 'A considered everyday form with the natural character of horn.', description: 'A refined bowl form that lets natural variation, tone and pattern remain part of the object.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn-Bowl.jpg', material: 'Natural horn', finish: 'Polished', size: 'Available on request', color: 'Natural variation', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-bowl.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Soap_Dish.jpg'], display_order: 1, is_active: true },
  { slug: 'buffalo-horn-drinking-02', name: 'Buffalo Horn Drinking Mug', title: 'Buffalo Horn Drinking Mug', category: 'Cups & Vessels', short_description: 'A generous silhouette shaped for a calm, tactile experience.', description: 'A classic viking-style drinking horn mug with a quietly expressive material surface.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Buffalo_Horn_Drinking.jpg', material: 'Buffalo horn', finish: 'Polished outside, food-safe inside', size: '15-18 oz', color: 'Dark variation', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-glasses.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Viking_Horn_Glass.jpg'], display_order: 2, is_active: true },
  { slug: 'horn-espresso-spoon-03', name: 'Horn Espresso Spoon', title: 'Horn Espresso Spoon', category: 'Utensils', short_description: 'Small details with a distinct natural presence.', description: 'Horn spoons selected and finished for product makers looking for a more individual detail.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Espresso_Spoon.jpg', material: 'Natural horn', finish: 'Polished', size: 'Standard', color: 'Amber variation', customization: 'Available on request', moq: '500', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/buffalo-horn-horn-cutlery.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn-Bowl.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg'], display_order: 3, is_active: true },
  { slug: 'viking-horn-glass-04', name: 'Viking Horn Glass', title: 'Viking Horn Glass', category: 'Cups & Vessels', short_description: 'Functional forms where warmth and texture become part of the ritual.', description: 'A considered drinking glass for buyers seeking natural material and distinctive finish.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Viking_Horn_Glass.jpg', material: 'Natural horn', finish: 'Highly polished', size: 'Standard', color: 'Natural pattern', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-glasses.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Buffalo_Horn_Drinking.jpg'], display_order: 4, is_active: true },
  { slug: 'buffalo-horn-napkin-ring-05', name: 'Buffalo Horn Napkin Ring', title: 'Buffalo Horn Napkin Ring', category: 'Decorative', short_description: 'A sculptural table accessory with an easy, organic line.', description: 'A beautiful napkin ring form shaped to retain the material\'s subtle tonal movement.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Napkin_Ring.jpg', material: 'Natural horn', finish: 'Smooth', size: 'Standard', color: 'Mixed tones', customization: 'Available on request', moq: '200', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/Horn-napkin-rings.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-napkin-rings.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg'], display_order: 5, is_active: true },
  { slug: 'textured-horn-soap-dish-06', name: 'Textured Horn Soap Dish', title: 'Textured Horn Soap Dish', category: 'Decorative', short_description: 'A polished utility piece built around the natural arc of horn.', description: 'A tactile soap dish with a quiet visual language and natural variation, perfect for modern bathrooms.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Soap_Dish.jpg', material: 'Natural horn', finish: 'Polished', size: 'Standard', color: 'Natural variation', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-soap-dish.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Napkin_Ring.jpg'], display_order: 6, is_active: true },
  { slug: 'viking-drinking-horn-07', name: 'Viking Drinking Horn', title: 'Viking Drinking Horn', category: 'Cups & Vessels', short_description: 'Authentic drinking horn with stand.', description: 'Handcrafted drinking horn using age-old techniques, complete with a metal or horn stand.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg', material: 'Ox horn', finish: 'Polished raw finish', size: '12-16 inches', color: 'Natural pattern', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Buffalo_Horn_Drinking.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-glasses.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Viking_Horn_Glass.jpg'], display_order: 7, is_active: true },
  { slug: 'buffalo-horn-cutlery-08', name: 'Buffalo Horn Cutlery Set', title: 'Buffalo Horn Cutlery Set', category: 'Utensils', short_description: 'Sleek, organic spoons and forks for natural dining.', description: 'Set of handcrafted horn salad servers and cutlery. Lightweight, durable and unique.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/buffalo-horn-horn-cutlery.jpg', material: 'Natural horn', finish: 'Smooth polished', size: 'Standard', color: 'Amber/Dark', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Espresso_Spoon.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn-Bowl.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg'], display_order: 8, is_active: true },
  { slug: 'handcrafted-horn-jewelry-09', name: 'Handcrafted Horn Jewelry', title: 'Handcrafted Horn Jewelry', category: 'Jewellery', short_description: 'Elegant, lightweight designs emphasizing natural pattern.', description: 'Organic bracelets, bangles, and necklaces crafted from sustainably sourced horn.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-Jewelry.jpg', material: 'Natural horn', finish: 'Polished', size: 'Varied', color: 'Multi-tone variation', customization: 'Available on request', moq: '200', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-jewellery.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/Horn-napkin-rings.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-bowl.jpg'], display_order: 9, is_active: true },
  { slug: 'horn-dish-trays-10', name: 'Horn Dish & Trays', title: 'Horn Dish & Trays', category: 'Decorative', short_description: 'Decorative serving trays showcasing horn grain.', description: 'Exquisite valet trays and dishes crafted by heat-shaping horn into minimalist utility objects.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg', material: 'Natural horn', finish: 'Polished', size: 'Standard', color: 'Natural grain', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Soap_Dish.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-bowl.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-soap-dish.jpg'], display_order: 10, is_active: true },
  { slug: 'horn-drinking-glasses-11', name: 'Horn Drinking Glasses', title: 'Horn Drinking Glasses', category: 'Cups & Vessels', short_description: 'Modern tumbler shapes in organic material.', description: 'Set of short drinking glasses showcasing distinct translucency and natural light transmission.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-glasses.jpg', material: 'Light colored horn', finish: 'Polished', size: '10 oz', color: 'Light amber', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Viking_Horn_Glass.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Buffalo_Horn_Drinking.jpg'], display_order: 11, is_active: true },
  { slug: 'horn-massage-tools-12', name: 'Gua Sha Massage Tools', title: 'Gua Sha Massage Tools', category: 'Utensils', short_description: 'Traditional scrapers and rollers for holistic wellness.', description: 'Smoothly finished horn tools for Gua Sha and massage therapy, preferred for natural properties.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-massage-tools.jpg', material: 'Black buffalo horn', finish: 'Ultra smooth', size: 'Standard', color: 'Black', customization: 'Available on request', moq: '300', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-rollers.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-scales.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-shoehorn.jpg'], display_order: 12, is_active: true },
  { slug: 'horn-napkin-rings-set-13', name: 'Horn Napkin Rings Set', title: 'Horn Napkin Rings Set', category: 'Decorative', short_description: 'Hexagonal and round styles for formal dining.', description: 'Elegant napkin holders displaying rich marbling of white, brown, and black tones.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/Horn-napkin-rings.jpg', material: 'Natural horn', finish: 'Polished', size: 'Standard', color: 'Marbled', customization: 'Available on request', moq: '200', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Napkin_Ring.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-napkin-rings.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg'], display_order: 13, is_active: true },
  { slug: 'horn-rollers-14', name: 'Horn Facial Rollers', title: 'Horn Facial Rollers', category: 'Decorative', short_description: 'Tactile rollers for skincare routine.', description: 'Dual-ended facial rollers made from cold-to-the-touch natural horn for skin relaxation.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-rollers.jpg', material: 'Natural horn', finish: 'Polished', size: 'Standard', color: 'Natural pattern', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-massage-tools.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-scales.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-shoehorn.jpg'], display_order: 14, is_active: true },
  { slug: 'polished-horn-scales-15', name: 'Polished Horn Scales', title: 'Polished Horn Scales', category: 'Knife Handles', short_description: 'Premium slabs for custom knives and craft.', description: 'Paired flat scales ready for knife handles, pen blanks, or custom inlay craftsmanship.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-scales.jpg', material: 'Dense horn', finish: 'Flat sanded', size: '5" x 1.5"', color: 'Dense dark/amber', customization: 'Available on request', moq: '50 pairs', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-massage-tools.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-rollers.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-shoehorn.jpg'], display_order: 15, is_active: true },
  { slug: 'classic-horn-shoehorn-16', name: 'Classic Horn Shoehorn', title: 'Classic Horn Shoehorn', category: 'Decorative', short_description: 'Ergonomic shape with a polished handle.', description: 'Traditional long shoehorn crafted from a single selection of horn, naturally smooth for ease.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-shoehorn.jpg', material: 'Natural horn', finish: 'Polished', size: '12 inches', color: 'Natural amber', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-massage-tools.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-rollers.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-scales.jpg'], display_order: 16, is_active: true },
  { slug: 'premium-horn-soap-dish-17', name: 'Premium Horn Soap Dish', title: 'Premium Horn Soap Dish', category: 'Decorative', short_description: 'A custom-carved drainage dish for bath items.', description: 'Elevated soap dish showcasing rich amber striations, naturally water-resistant when cared for.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-soap-dish.jpg', material: 'Natural horn', finish: 'Polished with drainage', size: 'Standard', color: 'Amber striations', customization: 'Available on request', moq: '100', featured: true, gallery_images: ['https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn_Soap_Dish.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg', 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/products/Horn-Bowl.jpg'], display_order: 17, is_active: true },
];

const processSteps = [
  { step_number: '01', title: 'SELECT', description: 'The natural character of each piece begins the conversation.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg', display_order: 1, is_active: true },
  { step_number: '02', title: 'SHAPE', description: 'Form is carefully considered around the material.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-bowl.jpg', display_order: 2, is_active: true },
  { step_number: '03', title: 'REFINE', description: 'Edges, surfaces and proportions are brought into balance.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/buffalo-horn-horn-cutlery.jpg', display_order: 3, is_active: true },
  { step_number: '04', title: 'FINISH', description: 'The finished object keeps a sense of where it began.', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg', display_order: 4, is_active: true },
];

const galleryImages = [
  { title: 'Drinking Horn Craft', label: 'A quiet study in natural tone', category: 'Products', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/drinking-horn.jpg', alt_text: 'A quiet study in natural tone', display_order: 1, is_active: true },
  { title: 'Horn Bowl', label: 'Material and silhouette', category: 'Products', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-bowl.jpg', alt_text: 'Material and silhouette', display_order: 2, is_active: true },
  { title: 'Gua Sha Shaping', label: 'From material to form', category: 'Craftsmanship', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-massage-tools.jpg', alt_text: 'From material to form', display_order: 3, is_active: true },
  { title: 'Napkin Rings Detail', label: 'The detail makes the object', category: 'Details', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/Horn-napkin-rings.jpg', alt_text: 'The detail makes the object', display_order: 4, is_active: true },
  { title: 'Horn Cutlery Set', label: 'Objects with presence', category: 'Products', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/buffalo-horn-horn-cutlery.jpg', alt_text: 'Objects with presence', display_order: 5, is_active: true },
  { title: 'Horn Cylinders', label: 'A closer look at crafting', category: 'Craftsmanship', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-rollers.jpg', alt_text: 'A closer look at crafting', display_order: 6, is_active: true },
  { title: 'Dishes and Trays', label: 'Natural variation of horn grain', category: 'Details', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-dish-trays.jpg', alt_text: 'Natural variation of horn grain', display_order: 7, is_active: true },
  { title: 'Soap Dish', label: 'Selected handcrafted pieces', category: 'Products', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-soap-dish.jpg', alt_text: 'Selected handcrafted pieces', display_order: 8, is_active: true },
  { title: 'Polished Scales', label: 'The final polished surface', category: 'Craftsmanship', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/hero/horn-scales.jpg', alt_text: 'The final polished surface', display_order: 9, is_active: true },
  { title: 'Horn Shoehorn', label: 'Tactile and functional by nature', category: 'Details', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-shoehorn.jpg', alt_text: 'Tactile and functional by nature', display_order: 10, is_active: true },
  { title: 'Horn Glasses', label: 'Modern curves and organic lines', category: 'Products', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-glasses.jpg', alt_text: 'Modern curves and organic lines', display_order: 11, is_active: true },
  { title: 'Jewellery Pieces', label: 'Premium material selections', category: 'Products', image: 'https://ik.imagekit.io/udlbbo3ci/qadri-cms/collections/horn-Jewelry.jpg', alt_text: 'Premium material selections', display_order: 12, is_active: true },
];

async function seed() {
  console.log('--- Seeding Supabase Database with all Home Page content ---');

  // 1. Hero
  const { data: currentHero } = await supabase.from('hero_sections').select('image');
  const existingHeroImages = new Set((currentHero || []).map((h) => h.image));
  const newHeroSlides = heroSlides.filter((h) => !existingHeroImages.has(h.image));
  if (newHeroSlides.length > 0) {
    const { error } = await supabase.from('hero_sections').insert(newHeroSlides);
    console.log('Hero slides inserted:', newHeroSlides.length, error ? `Error: ${error.message}` : 'OK');
  } else {
    console.log('Hero slides: All already present in DB');
  }

  // 2. About
  const { data: currentAbout } = await supabase.from('about_sections').select('id');
  if (!currentAbout || currentAbout.length === 0) {
    const { error } = await supabase.from('about_sections').insert([aboutSection]);
    console.log('About section inserted:', error ? `Error: ${error.message}` : 'OK');
  } else {
    const { error } = await supabase
      .from('about_sections')
      .update({ eyebrow: aboutSection.eyebrow })
      .or('eyebrow.ilike.%exporters%,eyebrow.eq.About Qadri Horncraft');
    console.log(
      'About section eyebrow synced:',
      error ? `Error: ${error.message}` : aboutSection.eyebrow
    );
  }

  // 3. Collections
  const { data: currentCol } = await supabase.from('collections').select('name');
  const existingColNames = new Set((currentCol || []).map((c) => c.name));
  const newCollections = collections.filter((c) => !existingColNames.has(c.name));
  if (newCollections.length > 0) {
    const { error } = await supabase.from('collections').insert(newCollections);
    console.log('Collections inserted:', newCollections.length, error ? `Error: ${error.message}` : 'OK');
  } else {
    console.log('Collections: All already present in DB');
  }

  // 4. Products
  const { data: currentProd } = await supabase.from('products').select('slug');
  const existingProdSlugs = new Set((currentProd || []).map((p) => p.slug));
  const newProducts = products.filter((p) => !existingProdSlugs.has(p.slug));
  if (newProducts.length > 0) {
    const { error } = await supabase.from('products').insert(newProducts);
    console.log('Products inserted:', newProducts.length, error ? `Error: ${error.message}` : 'OK');
  } else {
    console.log('Products: All already present in DB');
  }

  // 5. Process
  const { data: currentProc } = await supabase.from('process_steps').select('step_number');
  const existingProcNumbers = new Set((currentProc || []).map((p) => p.step_number));
  const newProcess = processSteps.filter((p) => !existingProcNumbers.has(p.step_number));
  if (newProcess.length > 0) {
    const { error } = await supabase.from('process_steps').insert(newProcess);
    console.log('Process steps inserted:', newProcess.length, error ? `Error: ${error.message}` : 'OK');
  } else {
    console.log('Process steps: All already present in DB');
  }

  // 6. Gallery
  const { data: currentGal } = await supabase.from('gallery_images').select('image');
  const existingGalImages = new Set((currentGal || []).map((g) => g.image));
  const newGallery = galleryImages.filter((g) => !existingGalImages.has(g.image));
  if (newGallery.length > 0) {
    const { error } = await supabase.from('gallery_images').insert(newGallery);
    console.log('Gallery images inserted:', newGallery.length, error ? `Error: ${error.message}` : 'OK');
  } else {
    console.log('Gallery images: All already present in DB');
  }

  console.log('--- Seeding finished successfully ---');
}

seed().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});
