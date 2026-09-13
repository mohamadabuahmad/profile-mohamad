import React from 'react';

// Eyebrow + H2 + optional intro, used by every section on the site.
const SectionHeading = ({ id, eyebrow, title, intro, align = 'start', children }) => (
  <header className={`ds-heading ds-heading--${align}`} data-reveal>
    {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
    <h2 id={id} className="ds-h2">{title}</h2>
    {intro && <p className="ds-intro">{intro}</p>}
    {children}
  </header>
);

export default SectionHeading;
