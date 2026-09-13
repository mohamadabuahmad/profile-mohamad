import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiInstagram, FiArrowUpRight } from 'react-icons/fi';
import { SITE } from '../i18n/locales';
import { useSite } from '../app/SiteContext';
import { trackEvent } from '../analytics';
import LanguageSwitcher from './LanguageSwitcher';
import { Mark } from './brand/Logo';

const SOCIAL = [
  { id: 'linkedin', Icon: FiLinkedin, href: SITE.social.linkedin },
  { id: 'github', Icon: FiGithub, href: SITE.social.github },
  { id: 'instagram', Icon: FiInstagram, href: SITE.social.instagram },
];

const SiteFooter = () => {
  const { t, path } = useSite();
  const f = t.footer;

  return (
    <footer className="ds-footer">
      <div className="ds-wrap ds-footer__top">
        <div className="ds-footer__brand">
          <Link to={path('home')} className="ds-footer__logo" aria-label={t.nav.home}>
            <span className="ds-footer__mark" aria-hidden="true"><Mark size={26} /></span>
            <span dir="ltr">Mohamad<span>Dev</span></span>
          </Link>
          <p className="ds-footer__tagline">{f.tagline}</p>
          <div className="ds-footer__social">
            {SOCIAL.map(({ id, Icon, href }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={f.social[id]}
                onClick={() => trackEvent('Site', 'social_click', id)}
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav className="ds-footer__col" aria-label={f.columns.site}>
          <h2 className="ds-micro">{f.columns.site}</h2>
          {['home', 'services', 'work', 'about', 'contact'].map((id) => (
            <Link key={id} to={path(id)}>{t.nav.links[id]}</Link>
          ))}
        </nav>

        <div className="ds-footer__col">
          <h2 className="ds-micro">{f.columns.solutions}</h2>
          {f.solutions.map((label) => (
            <Link key={label} to={path('services')}>{label}</Link>
          ))}
        </div>

        <div className="ds-footer__col ds-footer__col--contact">
          <h2 className="ds-micro">{f.columns.contact}</h2>
          <a href={`mailto:${SITE.email}`} onClick={() => trackEvent('Site', 'contact_click', 'email')}>
            <FiMail aria-hidden="true" /> <bdi dir="ltr">{SITE.email}</bdi>
          </a>
          <a href={SITE.phone.href} onClick={() => trackEvent('Site', 'contact_click', 'phone')}>
            <FiPhone aria-hidden="true" /> <bdi dir="ltr">{SITE.phone.label}</bdi>
          </a>
          <Link to={path('contact')} className="ds-link ds-footer__cta">
            {f.cta} <FiArrowUpRight className="ds-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="ds-wrap ds-footer__bottom">
        <p>
          &copy; {new Date().getFullYear()} <bdi>Mohamad Abu Ahmad.</bdi> {f.rights}
        </p>
        <LanguageSwitcher variant="footer" />
      </div>
    </footer>
  );
};

export default SiteFooter;
