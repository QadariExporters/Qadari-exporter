export interface Admin {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: 'superadmin' | 'admin' | 'editor';
  created_at?: string;
  updated_at?: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  button_1_text: string;
  button_1_link: string;
  button_2_text: string;
  button_2_link: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AboutSection {
  id: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  description: string;
  image: string;
  button_text: string;
  button_link: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  title: string;
  label?: string;
  description?: string;
  image: string;
  slug?: string;
  link?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  title?: string;
  slug: string;
  category?: string;
  short_description?: string;
  shortDescription?: string;
  description?: string;
  image: string;
  material?: string;
  finish?: string;
  size?: string;
  color?: string;
  customization?: string;
  moq?: string;
  price?: number | null;
  featured: boolean;
  gallery_images?: string[];
  galleryImages?: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessStepItem {
  id: string;
  step_number: string;
  title: string;
  description: string;
  image: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImageItem {
  id: string;
  title?: string;
  label?: string;
  category: string;
  image: string;
  alt_text?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AboutValueItem {
  number: string;
  title: string;
  description?: string;
}

export interface AboutPageData {
  id: string;
  // Hero Section
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  hero_image: string;
  // 01 / Our Story
  story_eyebrow: string;
  story_heading: string;
  story_italic_text?: string;
  story_paragraph_1: string;
  story_paragraph_2?: string;
  story_note?: string;
  story_image: string;
  // 02 / Our Material
  material_eyebrow: string;
  material_heading: string;
  material_italic_text?: string;
  material_description: string;
  material_image: string;
  // 03 / Our Values
  values_eyebrow: string;
  values_list: AboutValueItem[];
  created_at?: string;
  updated_at?: string;
}

