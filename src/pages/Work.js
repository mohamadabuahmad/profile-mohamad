import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { useSite } from '../app/SiteContext';
import { trackEvent } from '../analytics';
import DeviceShot from '../components/DeviceShot';
import AutomationGraphic from '../components/AutomationGraphic';
import CtaBand from '../components/CtaBand';
import './work.css';

const Work = ({ work }) => {
  const { t, locale } = useSite();
  const labels = work.labels;

  return (
    <>
      <section className="ds-hero-page" aria-labelledby="work-title">
        <div className="ds-wrap">
          <p className="ds-eyebrow ds-rise">{work.hero.eyebrow}</p>
          <h1 id="work-title" className="ds-display ds-rise" style={{ '--d': 1, maxWidth: '18ch' }}>
            {work.hero.title}
          </h1>
          <p className="ds-lede ds-rise" style={{ '--d': 2 }}>{work.hero.lede}</p>
          <p className="ds-note ds-rise" style={{ '--d': 3 }}>{work.hero.note}</p>
        </div>
      </section>

      {work.items.map((project, index) => (
        <section
          key={project.id}
          id={project.id}
          className={`ds-section ds-case-study ${index % 2 ? 'ds-case-study--alt' : ''} ${index % 2 ? 'ds-band' : ''}`}
          aria-labelledby={`${project.id}-title`}
        >
          <div className="ds-wrap ds-split">
            <div className="ds-split__media" data-reveal>
              <div
                className={`ds-shots ds-shots--${project.shots.length || 'none'} ds-shots--${project.shots[0]?.device || 'none'}`}
                data-scroller={project.shots.length > 1 ? 'true' : undefined}
                {...(project.shots.length > 1
                  // The row scrolls horizontally on small screens, so it has to be reachable
                  // and scrollable with the keyboard as well as by swipe.
                  ? { tabIndex: 0, role: 'group', 'aria-label': `${project.name} — ${labels.shots}` }
                  : {})}
              >
                {project.shots.length > 0 ? (
                  project.shots.map((shot, i) => (
                    <DeviceShot key={shot.src} shot={shot} priority={index === 0 && i === 0} />
                  ))
                ) : (
                  <AutomationGraphic steps={t.home.automation.after.slice(0, 3)} />
                )}
              </div>
            </div>

            <div className="ds-case-study__copy">
              <div data-reveal>
                <p className="ds-micro">{project.kind}</p>
                <h2 id={`${project.id}-title`} className="ds-h2 ds-case-study__name">{project.name}</h2>
                <ul className="ds-chips ds-chips--quiet" aria-label={labels.capabilities}>
                  {project.capabilities.map((capability) => (
                    <li key={capability} className="ds-chip">{capability}</li>
                  ))}
                </ul>
              </div>

              <dl className="ds-case-study__body">
                {['challenge', 'solution', 'experience', 'result'].map((key, i) => (
                  <div key={key} data-reveal style={{ '--d': i }}>
                    <dt>{labels[key]}</dt>
                    <dd>{project[key]}</dd>
                  </div>
                ))}
              </dl>

              <div className="ds-case-study__foot" data-reveal>
                <div>
                  <h3 className="ds-micro">{labels.technology}</h3>
                  <ul className="ds-chips">
                    {project.technology.map((tech) => (
                      <li key={tech} className="ds-chip" dir="ltr">{tech}</li>
                    ))}
                  </ul>
                </div>
                <div className="ds-case-study__links">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="ds-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('Work', 'project_click', `${locale}:${project.id}`)}
                    >
                      {link.label} <FiArrowUpRight className="ds-arrow" aria-hidden="true" />
                      <span className="ds-sr">{labels.newTab}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBand source="work" />
    </>
  );
};

export default Work;
