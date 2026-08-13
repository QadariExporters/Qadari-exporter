import Image from 'next/image';

const process = [
  { number: '01', title: 'SELECT', text: 'The natural character of each piece begins the conversation.', image: '/our-collection/drinking-horn.jpg' },
  { number: '02', title: 'SHAPE', text: 'Form is carefully considered around the material.', image: '/our-collection/horn-bowl.jpg' },
  { number: '03', title: 'REFINE', text: 'Edges, surfaces and proportions are brought into balance.', image: '/our-collection/buffalo-horn-horn-cutlery.jpg' },
  { number: '04', title: 'FINISH', text: 'The finished object keeps a sense of where it began.', image: '/our-collection/horn-dish-trays.jpg' }
];

export function ProcessSection() {
  return (
    <section className="material-section">
      <div className="shell section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The process</p>
            <h2>From material<br /><em>to form</em></h2>
          </div>
          <p>We keep the language of the material visible. The result is a collection that feels natural, considered and quietly individual.</p>
        </div>
        <div className="process-grid">
          {process.map((item, index) => (
            <div className="process-card" key={item.number}>
              <div className="process-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="process-card-copy">
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
