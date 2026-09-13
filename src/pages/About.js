import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import { useSite } from '../app/SiteContext';
import { trackEvent } from '../analytics';
import SectionHeading from '../components/ui/SectionHeading';
import CtaBand from '../components/CtaBand';
import './about.css';

const About = () => {
  const { t, path } = useSite();
  const a = t.about;

  return (
    <>
      <section className="ds-hero-page ds-about-hero" aria-labelledby="about-title">
        <div className="ds-wrap ds-about-hero__grid">
          <div>
            <p className="ds-eyebrow ds-rise">{a.hero.eyebrow}</p>
            <h1 id="about-title" className="ds-display ds-about-hero__title ds-rise" style={{ '--d': 1 }}>
              {a.hero.title}
            </h1>
            <p className="ds-lede ds-rise" style={{ '--d': 2 }}>{a.hero.lede}</p>
            <div className="ds-actions ds-rise" style={{ '--d': 3 }}>
              <Link to={path('contact')} className="ds-btn ds-btn--primary">
                {t.cta.primary} <FiArrowRight className="ds-arrow" aria-hidden="true" />
              </Link>
              <a
                href={`${process.env.PUBLIC_URL}/CV.pdf`}
                className="ds-btn ds-btn--ghost"
                download
                onClick={() => trackEvent('About', 'cv_download', 'about')}
              >
                <FiDownload aria-hidden="true" /> {a.cv}
              </a>
            </div>
          </div>
          <figure className="ds-about-hero__photo ds-rise" style={{ '--d': 2 }}>
            <img
              src={`${process.env.PUBLIC_URL}/profile_pic.jpg`}
              alt={a.hero.photoAlt}
              width="420"
              height="420"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      {/* How I think */}
      <section className="ds-section ds-band" aria-labelledby="principles-title">
        <div className="ds-wrap">
          <SectionHeading id="principles-title" eyebrow={a.principles.eyebrow} title={a.principles.title} />
          <ul className="ds-principles">
            {a.principles.items.map((item, i) => (
              <li key={item.title} data-reveal style={{ '--d': i % 2 }}>
                <span className="ds-principles__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Experience and education */}
      <section className="ds-section" aria-labelledby="timeline-title">
        <div className="ds-wrap ds-split">
          <div className="ds-split__media">
            <SectionHeading id="timeline-title" eyebrow={a.timeline.eyebrow} title={a.timeline.title} />
          </div>
          <ol className="ds-timeline">
            {a.timeline.items.map((item, i) => (
              <li key={`${item.role}-${item.period}`} data-reveal style={{ '--d': i }}>
                <p className="ds-timeline__meta">
                  <span className="ds-chip ds-chip--tag">{item.tag}</span>
                  <span className="ds-timeline__period" dir="ltr">{item.period}</span>
                </p>
                <h3>{item.role}</h3>
                <p className="ds-timeline__org">{item.org}</p>
                <p className="ds-timeline__text">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Technology */}
      <section className="ds-section ds-band" aria-labelledby="about-tech-title">
        <div className="ds-wrap">
          <SectionHeading id="about-tech-title" eyebrow={a.capabilities.eyebrow} title={a.capabilities.title} />
          <dl className="ds-tech-groups" data-reveal>
            {a.capabilities.groups.map((group) => (
              <div key={group.label}>
                <dt className="ds-micro">{group.label}</dt>
                <dd>
                  <ul className="ds-chips">
                    {group.items.map((item) => (
                      <li key={item} className="ds-chip" dir="ltr">{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Working languages */}
      <section className="ds-section ds-section--tight" aria-labelledby="languages-title">
        <div className="ds-wrap ds-languages" data-reveal>
          <p className="ds-eyebrow">{a.languages.eyebrow}</p>
          <h2 id="languages-title" className="ds-h2">{a.languages.title}</h2>
          <p className="ds-lede">{a.languages.text}</p>
          <p className="ds-languages__row" aria-hidden="true">
            <span lang="en">English</span>
            <span lang="ar">العربية</span>
            <span lang="he">עברית</span>
          </p>
          <Link to={path('work')} className="ds-link">
            {a.languages.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CtaBand source="about" />
    </>
  );
};

export default About;
