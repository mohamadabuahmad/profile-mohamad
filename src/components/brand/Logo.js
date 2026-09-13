import React from 'react';

// The approved MohamadDev mark — "Monolith". A full square with the M cut out
// of it: the form is what remains after the complexity is removed.
//
// Drawn on the 100-unit field from the identity: leg width 30, crown depth 24,
// apex at 64, axis at 50. The geometry is fixed — do not redraw this path.
// See docs/brand-identity.md.
export const MARK_PATH = 'M0 0 H100 V100 H70 V24 L50 64 30 24 V100 H0 Z';

/**
 * The mark is monochrome and paints with `currentColor`, so one component covers
 * every context: white inside the brand gradient tile in the navbar and footer,
 * accent-coloured when it sits bare on a page ground, and correct in both
 * themes without a second copy of the SVG.
 */
export const Mark = ({ size = 24, className = '', title }) => (
  <svg
    className={`ds-mark ${className}`.trim()}
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    role={title ? 'img' : 'presentation'}
    aria-hidden={title ? undefined : true}
    aria-label={title}
    focusable="false"
  >
    <path d={MARK_PATH} />
  </svg>
);

export default Mark;
