import { HeroSlider } from '@/components/HeroSlider';
import { IntroSection } from '@/components/IntroSection';
import { CollectionSection } from '@/components/CollectionSection';
import { SelectedProductsSection } from '@/components/SelectedProductsSection';
import { ProcessSection } from '@/components/ProcessSection';
import { InquiryBanner } from '@/components/InquiryBanner';
import { HomeGallerySection } from '@/components/HomeGallerySection';
import { FinalCTA } from '@/components/FinalCTA';
import {
  getHeroSlides,
  getAboutSection,
  getCollections,
  getProducts,
  getProcessSteps,
  getGalleryImages,
} from '@/lib/db/service';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [heroSlides, aboutData, collections, products, processSteps, galleryImages] = await Promise.all([
    getHeroSlides(true),
    getAboutSection(),
    getCollections(true),
    getProducts(true),
    getProcessSteps(true),
    getGalleryImages(true),
  ]);

  return (
    <main>
      <HeroSlider initialSlides={heroSlides} />
      <IntroSection data={aboutData} />
      <CollectionSection items={collections} />
      <SelectedProductsSection products={products} />
      <ProcessSection steps={processSteps} />
      <InquiryBanner />
      <HomeGallerySection images={galleryImages} />
      <FinalCTA />
    </main>
  );
}
