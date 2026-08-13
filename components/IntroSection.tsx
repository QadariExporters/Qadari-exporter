
import Image from 'next/image';

export function IntroSection() {
  return (
    <section className="intro-section shell section-pad">
      <div className="intro-heading">
        <p className="eyebrow">About Qadri Exporters</p>
        <h2 className="leading-tight" style={{ whiteSpace: 'nowrap', fontSize: 'clamp(50px, 6vw, 84px)' }}>
          the character of<br />
          <em>natural horn</em>
        </h2>
        <p style={{ marginTop: '28px', maxWidth: '460px', fontSize: '17px', lineHeight: '1.6' }}>
          Natural horn carries its own variations in tone, texture and pattern. 
          These characteristics give each finished piece a distinctive visual identity.
        </p>
      </div>
      <div className="intro-image-wrap">
        <Image 
          src="/hero-images/about qadri.png" 
          alt="About Qadri Exporters" 
          width={800} 
          height={600} 
          className="w-full h-auto object-cover rounded-sm shadow-md"
          priority
        />
      </div>
    </section>
  );
}
