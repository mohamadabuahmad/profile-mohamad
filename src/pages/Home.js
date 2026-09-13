import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiUser, FiZap } from 'react-icons/fi';
import { useSite } from '../app/SiteContext';
import { trackEvent } from '../analytics';
import SectionHeading from '../components/ui/SectionHeading';
import HeroCanvas from '../components/HeroCanvas';
import DeviceShot from '../components/DeviceShot';
import AutomationGraphic from '../components/AutomationGraphic';
import CtaBand from '../components/CtaBand';
import './home.css';

// Three projects lead the homepage; the rest live on the work page.
const FEATURED = ['car-info', 'social-platform', 'whatsapp-automation'];

const Home = ({ work }) => {
  const { t, path } = useSite();
  const h = t.home;
  const projects = FEATURED.map((id) => work.items.find((item) => item.id === id)).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="ds-hero-home" aria-labelledby="home-title">
        <div className="ds-wrap ds-hero-home__copy">
          <p className="ds-eyebrow ds-rise">{h.hero.eyebrow}</p>
          <h1 id="home-title" className="ds-display ds-rise" style={{ '--d': 1 }}>{h.hero.title}</h1>
          <p className="ds-lede ds-hero-home__lede ds-rise" style={{ '--d': 2 }}>{h.hero.lede}</p>
          <div className="ds-actions ds-hero-home__actions ds-rise" style={{ '--d': 3 }}>
            <Link
              to={path('contact')}
              className="ds-btn ds-btn--primary ds-btn--lg"
              onClick={() => trackEvent('Site', 'cta_click', 'home_hero_primary')}
            >
              {h.hero.primary} <FiArrowRight className="ds-arrow" aria-hidden="true" />
            </Link>
            <Link
              to={path('work')}
              className="ds-btn ds-btn--ghost ds-btn--lg"
              onClick={() => trackEvent('Site', 'cta_click', 'home_hero_secondary')}
            >
              {h.hero.secondary}
            </Link>
          </div>
        </div>

        <div className="ds-hero-home__stage ds-rise" style={{ '--d': 4 }}>
          <HeroCanvas label={h.hero.visualLabel} />
          <ul className="ds-hero-home__points">
            {h.hero.points.map((point) => (
              <li key={point}><FiCheck aria-hidden="true" /> {point}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* What I build */}
      <section className="ds-section" aria-labelledby="capabilities-title">
        <div className="ds-wrap">
          <SectionHeading
            id="capabilities-title"
            eyebrow={h.capabilities.eyebrow}
            title={h.capabilities.title}
            intro={h.capabilities.intro}
          />
          <ul className="ds-caps">
            {h.capabilities.items.map((item, i) => (
              <li key={item.id} className="ds-cap" data-reveal style={{ '--d': i % 3 }}>
                <Link to={`${path('services')}#solution-${item.id}`} className="ds-cap__link">
                  <span className="ds-cap__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="ds-cap__name">{item.name}</h3>
                  <p className="ds-cap__text">{item.text}</p>
                  <span className="ds-cap__more">
                    {h.capabilities.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problems → answer */}
      <section className="ds-section ds-band" aria-labelledby="home-problems-title">
        <div className="ds-wrap ds-problems-home">
          <div className="ds-problems-home__list" data-reveal>
            <p className="ds-eyebrow">{h.problems.eyebrow}</p>
            <ul>
              {h.problems.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="ds-problems-home__answer" data-reveal style={{ '--d': 1 }}>
            <h2 id="home-problems-title" className="ds-h2">{h.problems.title}</h2>
            <p className="ds-lede">{h.problems.answer}</p>
            <Link to={path('services')} className="ds-link">
              {h.problems.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Automation in one picture */}
      <section className="ds-section" aria-labelledby="home-automation-title">
        <div className="ds-wrap">
          <SectionHeading id="home-automation-title" eyebrow={h.automation.eyebrow} title={h.automation.title} intro={h.automation.text} />
          <div className="ds-flow" data-reveal>
            <div className="ds-flow__lane">
              <p className="ds-flow__label">{h.automation.beforeLabel}</p>
              <ol>
                {h.automation.before.map((step) => (
                  <li key={step}><FiUser aria-hidden="true" /> {step}</li>
                ))}
              </ol>
            </div>
            <div className="ds-flow__arrow" aria-hidden="true"><FiArrowRight className="ds-arrow" /></div>
            <div className="ds-flow__lane ds-flow__lane--after">
              <p className="ds-flow__label ds-flow__label--on">{h.automation.afterLabel}</p>
              <ol>
                {h.automation.after.map((step) => (
                  <li key={step}><FiZap aria-hidden="true" /> {step}</li>
                ))}
              </ol>
            </div>
          </div>
          <p className="ds-flow__cta" data-reveal>
            <Link to={`${path('services')}#automation-demo`} className="ds-link">
              {h.automation.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Selected work */}
      <section className="ds-section ds-band" aria-labelledby="home-work-title">
        <div className="ds-wrap">
          <SectionHeading id="home-work-title" eyebrow={h.work.eyebrow} title={h.work.title} intro={h.work.text} />
          <div className="ds-work-preview">
            {projects.map((project, i) => (
              <article key={project.id} className="ds-work-card" data-reveal style={{ '--d': i }}>
                <Link to={`${path('work')}#${project.id}`} className="ds-work-card__link">
                  <div className="ds-work-card__media">
                    {project.shots[0] ? (
                      <DeviceShot shot={project.shots[0]} />
                    ) : (
                      <AutomationGraphic steps={h.automation.after.slice(0, 3)} />
                    )}
                  </div>
                  <p className="ds-micro">{project.kind}</p>
                  <h3 className="ds-work-card__name">{project.name}</h3>
                  <p className="ds-work-card__text">{project.challenge}</p>
                  <span className="ds-link">
                    {work.labels.more} <FiArrowRight className="ds-arrow" aria-hidden="true" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
          <p className="ds-center" data-reveal>
            <Link to={path('work')} className="ds-btn ds-btn--ghost">
              {h.work.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="ds-section" aria-labelledby="home-process-title">
        <div className="ds-wrap">
          <SectionHeading id="home-process-title" eyebrow={h.process.eyebrow} title={h.process.title} />
          <ol className="ds-steps" data-reveal>
            {h.process.steps.map((step, i) => (
              <li key={step.title} style={{ '--d': i }}>
                <span className="ds-steps__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="ds-center" data-reveal>
            <Link to={`${path('services')}#process`} className="ds-link">
              {h.process.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="ds-section ds-band" aria-labelledby="home-why-title">
        <div className="ds-wrap ds-why-home">
          <SectionHeading id="home-why-title" eyebrow={h.why.eyebrow} title={h.why.title} />
          <ul className="ds-why-home__list">
            {h.why.items.map((item, i) => (
              <li key={item.title} data-reveal style={{ '--d': i }}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Technology */}
      <section className="ds-section ds-section--tight" aria-labelledby="home-tech-title">
        <div className="ds-wrap">
          <SectionHeading id="home-tech-title" eyebrow={h.tech.eyebrow} title={h.tech.title} />
          <ul className="ds-chips ds-tech-strip" data-reveal>
            {h.tech.items.map((item) => (
              <li key={item} className="ds-chip" dir="ltr">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand source="home" />
    </>
  );
};

export default Home;
