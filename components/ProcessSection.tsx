import Image from 'next/image';
import { ProcessStepItem } from '@/lib/db/schema';
import { defaultProcessSteps } from '@/lib/db/default-data';

interface ProcessSectionProps {
  steps?: ProcessStepItem[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  const stepList = (steps && steps.length > 0) ? steps : defaultProcessSteps;

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
          {stepList.map((item, index) => (
            <div className="process-card" key={item.id || item.step_number || index}>
              <div className="process-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="process-card-copy">
                <span>{item.step_number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
