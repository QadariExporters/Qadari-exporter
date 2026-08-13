import { HeroSlider } from '@/components/HeroSlider';
import { IntroSection } from '@/components/IntroSection';
import { CollectionSection } from '@/components/CollectionSection';
import { SelectedProductsSection } from '@/components/SelectedProductsSection';
import { ProcessSection } from '@/components/ProcessSection';
import { InquiryBanner } from '@/components/InquiryBanner';
import { HomeGallerySection } from '@/components/HomeGallerySection';
import { FinalCTA } from '@/components/FinalCTA';

export default function Home() {
    return <main><HeroSlider /><IntroSection /><CollectionSection /><SelectedProductsSection /><ProcessSection /><InquiryBanner /><HomeGallerySection /><FinalCTA /></main>;
}
