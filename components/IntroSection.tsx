import Image from 'next/image';
import { AboutSection } from '@/lib/db/schema';
import { defaultAboutSection } from '@/lib/db/default-data';

interface IntroSectionProps {
  data?: AboutSection | null;
}

export function IntroSection({ data }: IntroSectionProps) {
  if (data === null || (data && data.is_active === false)) return null;
  const content = data || defaultAboutSection;
  if (content.is_active === false) return null;

  const renderHeading = (heading: string) => {
    if (!heading) return null;
    const parts = heading.split('\n');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <br />
          <em>{parts.slice(1).join(' ')}</em>
        </>
      );
    }
    // If heading starts with "the character of" or contains multiple words
    const words = heading.split(' ');
    if (words.length > 2) {
      const splitIdx = Math.ceil(words.length / 2);
      const first = words.slice(0, splitIdx).join(' ');
      const rest = words.slice(splitIdx).join(' ');
      return (
        <>
          {first}
          <br />
          <em>{rest}</em>
        </>
      );
    }
    return <em>{heading}</em>;
  };

  return (
    <section className="intro-section shell section-pad">
      <div className="intro-heading">
        <p className="eyebrow">{content.eyebrow || 'About Qadri Exporters'}</p>
        <h2 className="leading-tight" style={{ fontSize: 'clamp(42px, 5.5vw, 80px)' }}>
          {renderHeading(content.heading)}
        </h2>
        <p style={{ marginTop: '28px', maxWidth: '460px', fontSize: '17px', lineHeight: '1.6' }}>
          {content.description}
        </p>
      </div>
      <div className="intro-image-wrap">
        <Image
          src={content.image || '/hero-images/about qadri.png'}
          alt={content.eyebrow || 'About Qadri Exporters'}
          width={800}
          height={600}
          className="w-full h-auto object-cover rounded-sm shadow-md"
          priority
        />
      </div>
    </section>
  );
}
