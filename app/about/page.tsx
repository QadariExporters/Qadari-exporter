import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { getAboutPageData } from '@/lib/db/service';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPageData();
  return {
    title: `${data.hero_title || 'Our Story'} | Qadri Exporters`,
    description: data.hero_description || 'The material, approach and values behind Qadri Exporters.',
  };
}

export default async function AboutPage() {
  const data = await getAboutPageData();

  return (
    <main className="page-main">
      {/* Hero Section */}
      <section
        className="page-hero page-hero-image-full"
        style={{ backgroundImage: `url('${data.hero_image || '/hero-images/drinking-horn-and-tankards.jpg'}')` }}
      >
        <div className="shell">
          <div className="hero-section-nav"></div>
          <div>
            <p className="eyebrow" style={{ color: '#dbc7af' }}>
              {data.hero_eyebrow || 'The company'}
            </p>
            <h1 style={{ color: 'var(--white)' }}>
              {data.hero_title || 'Our story.'}
            </h1>
            <p className="hero-description" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              {data.hero_description ||
                'Qadri Exporters is a manufacturer and exporter of handcrafted horn products. This is where the material, the approach and the people behind the work will meet.'}
            </p>
          </div>
        </div>
      </section>

      {/* Section 01: Our Story */}
      <section className="shell about-intro section-pad">
        <div className="about-intro-layout">
          <div className="about-image">
            <img
              src={data.story_image || '/our-collection/horn-bowl.jpg'}
              alt={data.story_heading || 'Our story'}
            />
          </div>
          <div>
            <p className="eyebrow">{data.story_eyebrow || '01 / Our story'}</p>
            <h2>
              {data.story_heading || 'A point of view'}
              {data.story_italic_text && (
                <>
                  <br />
                  <em>{data.story_italic_text}</em>
                </>
              )}
            </h2>
            <p>{data.story_paragraph_1}</p>
            {data.story_paragraph_2 && <p>{data.story_paragraph_2}</p>}
            {data.story_note && <p className="muted">{data.story_note}</p>}
          </div>
        </div>
      </section>

      {/* Section 02: Our Material */}
      <section className="about-panels">
        <div className="shell about-panel-grid">
          <div>
            <p className="eyebrow">{data.material_eyebrow || '02 / Our material'}</p>
            <h2>
              {data.material_heading || 'Let natural variation'}
              {data.material_italic_text && (
                <>
                  <br />
                  <em>{data.material_italic_text}</em>
                </>
              )}
            </h2>
            <p>{data.material_description}</p>
          </div>
          <div className="about-image">
            <img
              src={data.material_image || '/our-collection/buffalo-horn-horn-cutlery.jpg'}
              alt={data.material_heading || 'Our material'}
            />
          </div>
        </div>
      </section>

      {/* Section 03: Our Values */}
      <section className="shell values-section section-pad">
        <p className="eyebrow">{data.values_eyebrow || '03 / Our values'}</p>
        <div className="values-grid">
          {(data.values_list || []).map((val) => (
            <div key={val.title}>
              <span>{val.number}</span>
              <h3>{val.title}</h3>
              {val.description && (
                <p className="text-xs text-stone-500 mt-1">{val.description}</p>
              )}
              <ArrowRight size={17} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

