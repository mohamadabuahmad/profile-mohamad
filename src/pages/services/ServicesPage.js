import React, { useCallback, useMemo, useState } from 'react';
import {
  FiArrowRight, FiArrowDown, FiCheck, FiClock, FiLayers, FiSmile, FiTrendingUp, FiZap, FiCpu, FiMail, FiPhone,
} from 'react-icons/fi';
import useReducedMotion from '../../hooks/useReducedMotion';
import { trackEvent } from '../../analytics';
import { SITE } from '../../i18n/locales';
import { ServicesTextProvider } from './i18n';
import SectionHeading from '../../components/ui/SectionHeading';
import SystemMap from './components/SystemMap';
import SolutionSection from './components/SolutionSection';
import AutomationDemo from './components/AutomationDemo';
import CaseStudy from './components/CaseStudy';
import BuildExplorer from './components/BuildExplorer';
import Faq from './components/Faq';
import LeadForm from '../../components/LeadForm';
import StickyCta from './components/StickyCta';
import './services.css';

const OUTCOME_ICONS = [FiClock, FiLayers, FiSmile, FiTrendingUp, FiZap, FiCpu];

const ServicesPage = ({ locale = 'en', content: t }) => {
  const [preset, setPreset] = useState(null);
  const reduced = useReducedMotion();
  const text = useMemo(() => ({ t, locale }), [t, locale]);

  // Every "talk to me" CTA funnels here: remember what was clicked, scroll to the form,
  // and move focus to its heading so keyboard and screen-reader users land in the right place.
  const requestService = useCallback(
    (e, { need, note, source }) => {
      e.preventDefault();
      trackEvent('Services', source === 'hero' || source === 'sticky' ? 'cta_click' : 'service_cta_click', source);
      if (need || note) setPreset({ need, note, source, nonce: Date.now() });
      document.getElementById('start')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      document.getElementById('start-form-title')?.focus({ preventScroll: true });
    },
    [reduced]
  );

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  const labelFor = Object.fromEntries(t.solutions.map((s) => [s.id, s.label]));

  return (
    <ServicesTextProvider value={text}>
      <>
        {/* Hero */}
        <section id="ds-hero" className="ds-hero" aria-labelledby="ds-h1">
          <div className="ds-wrap ds-hero__grid">
            <div className="ds-hero__copy">
              <p className="ds-eyebrow ds-rise">{t.hero.eyebrow}</p>
              <h1 id="ds-h1" className="ds-h1 ds-rise" style={{ '--d': 1 }}>{t.hero.title}</h1>
              <p className="ds-lede ds-rise" style={{ '--d': 2 }}>{t.hero.lede}</p>
              <div className="ds-hero__actions ds-rise" style={{ '--d': 3 }}>
                <a href="#start" className="ds-btn ds-btn--primary ds-btn--lg" onClick={(e) => requestService(e, { source: 'hero' })}>
                  {t.hero.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
                </a>
                <a
                  href="#solutions"
                  className="ds-btn ds-btn--ghost ds-btn--lg"
                  onClick={(e) => {
                    trackEvent('Services', 'cta_click', 'hero_explore');
                    scrollTo('solutions')(e);
                  }}
                >
                  {t.hero.ctaSecondary} <FiArrowDown aria-hidden="true" />
                </a>
              </div>
              <ul className="ds-hero__points ds-rise" style={{ '--d': 4 }}>
                {t.hero.points.map((p) => (
                  <li key={p}><FiCheck aria-hidden="true" /> {p}</li>
                ))}
              </ul>
            </div>
            <div className="ds-hero__visual ds-rise" style={{ '--d': 2 }}>
              <SystemMap />
            </div>
          </div>
        </section>

        {/* Problems */}
        <section className="ds-section" aria-labelledby="problems-title">
          <div className="ds-wrap">
            <SectionHeading id="problems-title" eyebrow={t.problems.eyebrow} title={t.problems.title} intro={t.problems.intro} />
            <ul className="ds-problems">
              {t.problems.items.map((p, i) => (
                <li key={p.quote} className="ds-problem" data-reveal style={{ '--d': i % 4 }}>
                  <p className="ds-problem__quote">{p.quote}</p>
                  <a href={`#solution-${p.target}`} className="ds-problem__fix" onClick={scrollTo(`solution-${p.target}`)}>
                    <span>{p.fix}</span>
                    <span className="ds-problem__via">{labelFor[p.target]} <FiArrowRight className="ds-arrow" aria-hidden="true" /></span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="ds-answer" data-reveal>
              <h3 className="ds-answer__title">{t.problems.answerTitle}</h3>
              <p>{t.problems.answer}</p>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="ds-section ds-solutions" aria-labelledby="solutions-title">
          <div className="ds-wrap">
            <SectionHeading
              id="solutions-title"
              eyebrow={t.solutionsIntro.eyebrow}
              title={t.solutionsIntro.title}
              intro={t.solutionsIntro.intro}
            />
            <nav className="ds-toc" aria-label={t.solutionsIntro.tocLabel} data-reveal>
              {t.solutions.map((s, i) => (
                <a key={s.id} href={`#solution-${s.id}`} onClick={scrollTo(`solution-${s.id}`)}>
                  <span>{String(i + 1).padStart(2, '0')}</span> {s.label}
                </a>
              ))}
            </nav>
            {t.solutions.map((s, i) => (
              <SolutionSection key={s.id} solution={s} index={i} reverse={i % 2 === 1} onRequest={requestService} />
            ))}
          </div>
        </section>

        <AutomationDemo />

        {/* Outcomes */}
        <section className="ds-section" aria-labelledby="outcomes-title">
          <div className="ds-wrap">
            <SectionHeading id="outcomes-title" eyebrow={t.outcomes.eyebrow} title={t.outcomes.title} />
            <ul className="ds-outcomes">
              {t.outcomes.items.map((o, i) => {
                const Icon = OUTCOME_ICONS[i];
                return (
                  <li key={o.title} className="ds-outcome" data-reveal style={{ '--d': i % 3 }}>
                    <Icon className="ds-outcome__icon" aria-hidden="true" />
                    <h3>{o.title}</h3>
                    <p>{o.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="ds-section ds-band" aria-labelledby="process-title">
          <div className="ds-wrap">
            <SectionHeading id="process-title" eyebrow={t.process.eyebrow} title={t.process.title} intro={t.process.intro} />
            <ol className="ds-process" data-reveal>
              {t.process.steps.map((s, i) => (
                <li key={s.title} className="ds-process__step" style={{ '--d': i }}>
                  <span className="ds-process__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
            <ul className="ds-assure" data-reveal>
              {t.process.assurances.map((a) => (
                <li key={a}><FiCheck aria-hidden="true" /> {a}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Selected work */}
        <section className="ds-section" aria-labelledby="work-title">
          <div className="ds-wrap">
            <SectionHeading id="work-title" eyebrow={t.work.eyebrow} title={t.work.title} intro={t.work.intro} />
            <div className="ds-cases">
              {t.work.items.map((p, i) => (
                <CaseStudy key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* What can I build? */}
        <section className="ds-section ds-band" aria-labelledby="ideas-title">
          <div className="ds-wrap">
            <SectionHeading id="ideas-title" eyebrow={t.explorer.eyebrow} title={t.explorer.title} intro={t.explorer.intro} />
            <BuildExplorer onRequest={requestService} />
          </div>
        </section>

        {/* Why */}
        <section className="ds-section" aria-labelledby="why-title">
          <div className="ds-wrap ds-why">
            <SectionHeading id="why-title" eyebrow={t.why.eyebrow} title={t.why.title} />
            <ol className="ds-why__list">
              {t.why.items.map((w, i) => (
                <li key={w.title} data-reveal style={{ '--d': i }}>
                  <span className="ds-why__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Technology */}
        <section className="ds-section ds-section--tight" aria-labelledby="tech-title">
          <div className="ds-wrap">
            <SectionHeading id="tech-title" eyebrow={t.tech.eyebrow} title={t.tech.title} intro={t.tech.intro} />
            <dl className="ds-tech" data-reveal>
              {t.tech.groups.map((g) => (
                <div key={g.label} className="ds-tech__group">
                  <dt>{g.label}</dt>
                  {g.items.map((item) => (
                    <dd key={item} className="ds-chip" dir="ltr">{item}</dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section className="ds-section" aria-labelledby="faq-title">
          <div className="ds-wrap ds-faq-wrap">
            <SectionHeading id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />
            <Faq />
          </div>
        </section>

        {/* Closing CTA + lead form */}
        <section id="start" className="ds-section ds-closing" aria-labelledby="closing-title">
          <div className="ds-wrap ds-closing__grid">
            <div className="ds-closing__copy" data-reveal>
              <p className="ds-eyebrow">{t.closing.eyebrow}</p>
              <h2 id="closing-title" className="ds-h2 ds-closing__title">{t.closing.title}</h2>
              <p className="ds-lede">{t.closing.text}</p>
              <h3 className="ds-micro">{t.closing.nextTitle}</h3>
              <ol className="ds-next">
                {t.closing.next.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ol>
              <div className="ds-direct">
                <p className="ds-micro">{t.closing.directTitle}</p>
                <a href={`mailto:${SITE.email}`} onClick={() => trackEvent('Services', 'contact_click', 'email')}>
                  <FiMail aria-hidden="true" /> <bdi dir="ltr">{SITE.email}</bdi>
                </a>
                <a href={SITE.phone.href} onClick={() => trackEvent('Services', 'contact_click', 'phone')}>
                  <FiPhone aria-hidden="true" /> <bdi dir="ltr">{SITE.phone.label}</bdi>
                </a>
              </div>
            </div>
            <div className="ds-closing__form" data-reveal>
              <h3 id="start-form-title" className="ds-form__heading" tabIndex={-1}>{t.closing.formTitle}</h3>
              <LeadForm preset={preset} headingId="start-form-title" source="services" />
            </div>
          </div>
        </section>

        <StickyCta heroId="ds-hero" formId="start" onRequest={requestService} />
      </>
    </ServicesTextProvider>
  );
};

export default ServicesPage;
