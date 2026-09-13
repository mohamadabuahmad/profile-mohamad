import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useSite } from '../app/SiteContext';

const LINKS = ['home', 'services', 'work', 'contact'];

const NotFound = () => {
  const { t, path } = useSite();
  const n = t.notfound;

  return (
    <section className="ds-section ds-notfound" aria-labelledby="notfound-title">
      <div className="ds-wrap ds-notfound__inner">
        <p className="ds-eyebrow ds-notfound__code" aria-hidden="true">{n.code}</p>
        <h1 id="notfound-title" className="ds-display ds-notfound__title">{n.title}</h1>
        <p className="ds-lede">{n.text}</p>
        <ul className="ds-notfound__links">
          {LINKS.map((id) => (
            <li key={id}>
              <Link to={path(id)} className="ds-link">
                {n.links[id]} <FiArrowRight className="ds-arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NotFound;
