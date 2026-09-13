import React from 'react';
import { FiArrowRight, FiArrowDown } from 'react-icons/fi';
import { useServicesText } from '../i18n';
import { VISUALS } from './Visuals';

// One of the five service categories: outcome headline, problems it solves,
// what the solution can look like, an illustrative visual and a CTA that pre-fills the lead form.
const SolutionSection = ({ solution, index, reverse, onRequest }) => {
  const { t } = useServicesText();
  const Visual = VISUALS[solution.id];
  const headingId = `solution-${solution.id}-title`;

  return (
    <article
      id={`solution-${solution.id}`}
      className={`ds-solution ${reverse ? 'ds-solution--reverse' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="ds-solution__copy" data-reveal>
        <p className="ds-solution__label">
          <span className="ds-solution__index">{String(index + 1).padStart(2, '0')}</span>
          {solution.label}
        </p>
        <h3 id={headingId} className="ds-solution__title">{solution.title}</h3>
        <p className="ds-solution__body">{solution.body}</p>

        <div className="ds-solution__cols">
          <div>
            <h4 className="ds-micro">{t.solutionsIntro.problemsLabel}</h4>
            <ul className="ds-solution__problems">
              {solution.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="ds-micro">{t.solutionsIntro.examplesLabel}</h4>
            <ul className="ds-chips">
              {solution.examples.map((e) => (
                <li key={e} className="ds-chip">{e}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ds-solution__actions">
          <a
            href="#start"
            className="ds-btn ds-btn--primary"
            onClick={(e) => onRequest(e, { need: solution.id, source: `service_${solution.id}` })}
          >
            {solution.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
          </a>
          {solution.id === 'automation' && (
            <a href="#automation-demo" className="ds-link">
              {t.solutionsIntro.demoLink} <FiArrowDown aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="ds-solution__visual" data-reveal>
        <Visual />
      </div>
    </article>
  );
};

export default SolutionSection;
