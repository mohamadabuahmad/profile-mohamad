import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../App';
import { useSite } from '../app/SiteContext';
import { trackEvent } from '../analytics';
import LanguageSwitcher from './LanguageSwitcher';
import { Mark } from './brand/Logo';

const LINKS = ['services', 'work', 'about'];

const SiteNav = () => {
  const { t, page, path } = useSite();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // While the menu is open: lock scrolling, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    const panel = panelRef.current;
    panel?.querySelector('a, button')?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const focusable = panel.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // While the panel is open the rest of the page is inert, so assistive tech
  // can't reach behind it even though the visual focus trap already holds.
  useEffect(() => {
    const main = document.getElementById('main');
    const footer = document.querySelector('.ds-footer');
    [main, footer].forEach((el) => {
      if (!el) return;
      if (open) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
    return () => {
      [main, footer].forEach((el) => el && el.removeAttribute('inert'));
    };
  }, [open]);

  const navLinks = LINKS.map((id) => (
    <Link key={id} to={path(id)} className={`ds-nav__link ${page === id ? 'is-active' : ''}`} aria-current={page === id ? 'page' : undefined}>
      {t.nav.links[id]}
    </Link>
  ));

  return (
    <header className={`ds-nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="ds-nav__bar">
        <Link to={path('home')} className="ds-nav__logo" aria-label={t.nav.home}>
          <span className="ds-nav__mark" aria-hidden="true"><Mark size={22} /></span>
          <span className="ds-nav__word" dir="ltr">Mohamad<span>Dev</span></span>
        </Link>

        <nav className="ds-nav__links" aria-label={t.nav.primary}>{navLinks}</nav>

        <div className="ds-nav__actions">
          <LanguageSwitcher variant="nav" />
          <button type="button" className="ds-icon-btn" onClick={toggleTheme} aria-label={t.nav.theme}>
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <Link
            to={path('contact')}
            className="ds-btn ds-btn--primary ds-nav__cta"
            onClick={() => trackEvent('Site', 'nav_cta_click', page)}
          >
            {t.nav.cta} <FiArrowRight className="ds-arrow" aria-hidden="true" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="ds-icon-btn ds-nav__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.close : t.nav.menu}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div id="site-menu" className="ds-nav__panel" ref={panelRef} hidden={!open}>
        <nav className="ds-nav__panel-links" aria-label={t.nav.primary}>
          {[...LINKS, 'contact'].map((id, i) => (
            <Link key={id} to={path(id)} className="ds-nav__panel-link" style={{ '--d': i }}>
              <span>{t.nav.links[id]}</span>
              <FiArrowRight className="ds-arrow" aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="ds-nav__panel-foot">
          <LanguageSwitcher variant="panel" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default SiteNav;
