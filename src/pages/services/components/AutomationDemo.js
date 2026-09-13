import React, { useEffect, useRef, useState } from 'react';
import { FiUser, FiClock, FiZap, FiCpu, FiUsers } from 'react-icons/fi';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { useServicesText } from '../i18n';
import SectionHeading from '../../../components/ui/SectionHeading';

const WHO_ICON = { auto: FiZap, ai: FiCpu, team: FiUsers };
const STEP_MS = 850;

// Before/after comparison of one workflow. The "after" lane plays through its steps once
// whenever it comes into view or the scenario changes (instantly with reduced motion).
// Steps run top to bottom, so the flow reads the same in LTR and RTL.
const AutomationDemo = () => {
  const { t, locale } = useServicesText();
  const demo = t.demo;
  const { scenarios } = demo;
  const [active, setActive] = useState(0);
  const [played, setPlayed] = useState(0);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const laneRef = useRef(null);
  const tabRefs = useRef([]);
  const scenario = scenarios[active];
  const rtl = locale !== 'en';

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), { threshold: 0.35 });
    io.observe(laneRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const total = scenario.after.length;
    if (reduced) {
      setPlayed(total);
      return undefined;
    }
    if (!inView) return undefined;
    setPlayed(0);
    let n = 0;
    const timer = setInterval(() => {
      n += 1;
      setPlayed(n);
      if (n >= total) clearInterval(timer);
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [active, inView, reduced, scenario.after.length]);

  // Arrow keys follow the visual order of the tabs, which is mirrored in RTL.
  const onTabKey = (e) => {
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    const dir = { [forward]: 1, ArrowDown: 1, [back]: -1, ArrowUp: -1 }[e.key];
    let next = null;
    if (dir) next = (active + dir + scenarios.length) % scenarios.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = scenarios.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="automation-demo" className="ds-section ds-band" aria-labelledby="demo-title">
      <div className="ds-wrap">
        <SectionHeading id="demo-title" eyebrow={demo.eyebrow} title={demo.title} intro={demo.intro} />

        <div className="ds-tabs" role="tablist" aria-label={demo.tabsLabel} data-reveal>
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => (tabRefs.current[i] = el)}
              id={`demo-tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="demo-panel"
              tabIndex={i === active ? 0 : -1}
              className="ds-tab"
              onClick={() => setActive(i)}
              onKeyDown={onTabKey}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={`demo-tab-${scenario.id}`}
          className="ds-demo"
          ref={laneRef}
          data-reveal
        >
          <div className="ds-lane ds-lane--before">
            <h3 className="ds-lane__title">
              <span className="ds-lane__tag">{demo.beforeTag}</span> {demo.beforeTitle}
            </h3>
            <ol className="ds-lane__steps">
              {scenario.before.map((text, i) => (
                <li key={text} className="ds-step ds-step--manual">
                  <span className="ds-step__icon" aria-hidden="true"><FiUser /></span>
                  <span className="ds-step__text">{text}</span>
                  {i < scenario.before.length - 1 && (
                    <span className="ds-step__wait"><FiClock aria-hidden="true" /> {demo.wait}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="ds-lane ds-lane--after">
            <h3 className="ds-lane__title">
              <span className="ds-lane__tag ds-lane__tag--on">{demo.afterTag}</span> {demo.afterTitle}
            </h3>
            <ol className="ds-lane__steps">
              {scenario.after.map((step, i) => {
                const Icon = WHO_ICON[step.who];
                return (
                  <li
                    key={step.text}
                    className={`ds-step ds-step--${step.who} ${i < played ? 'is-done' : ''} ${i === played - 1 ? 'is-current' : ''}`}
                  >
                    <span className="ds-step__icon" aria-hidden="true"><Icon /></span>
                    <span className="ds-step__text">{step.text}</span>
                    <span className="ds-step__who">{demo.who[step.who]}</span>
                  </li>
                );
              })}
            </ol>
            <p className="ds-lane__summary">{demo.summary}</p>
          </div>
        </div>
        <p className="ds-note">{demo.note}</p>
      </div>
    </section>
  );
};

export default AutomationDemo;
