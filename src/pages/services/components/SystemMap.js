import React from 'react';
import useReducedMotion from '../../../hooks/useReducedMotion';
import { useServicesText } from '../i18n';

const W = 520;
const H = 480;
const CX = W / 2;
const CY = H / 2;

// Node positions are symmetric, so the diagram reads the same in LTR and RTL.
const NODES = [
  { id: 'ai', x: 118, y: 62 },
  { id: 'automation', x: 402, y: 62 },
  { id: 'integrations', x: 440, y: 240 },
  { id: 'web', x: 402, y: 418 },
  { id: 'webapp', x: 118, y: 418 },
  { id: 'mobile', x: 80, y: 240 },
];

const pathTo = ({ x, y }) => {
  const mx = (CX + x) / 2;
  return `M${CX},${CY} C${mx},${CY} ${mx},${y} ${x},${y}`;
};

// Hero visual: the business in the middle, the systems it can be connected to around it,
// with small data pulses travelling along the connections.
const SystemMap = () => {
  const reduced = useReducedMotion();
  const { t } = useServicesText();
  const { label, center, nodes } = t.map;

  return (
    <figure className="ds-map" aria-label={label}>
      <svg className="ds-map__lines" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <circle className="ds-map__orbit" cx={CX} cy={CY} r="150" />
        {NODES.map((n) => (
          <path key={n.id} className="ds-map__line" d={pathTo(n)} />
        ))}
        {!reduced &&
          NODES.map((n, i) => (
            <circle key={`p-${n.id}`} className="ds-map__pulse" r="3.5">
              <animateMotion
                dur="3.6s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
                path={pathTo(n)}
                keyPoints={i % 2 ? '1;0' : '0;1'}
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          ))}
      </svg>

      <div className="ds-map__center" style={{ left: '50%', top: '50%' }}>
        <span className="ds-map__mark" aria-hidden="true">M</span>
        <strong>{center.title}</strong>
        <span className="ds-map__sub">{center.sub}</span>
      </div>

      <ul className="ds-map__nodes">
        {NODES.map((n, i) => (
          <li
            key={n.id}
            className="ds-map__node"
            style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%`, '--d': i }}
          >
            <strong>{nodes[n.id].title}</strong>
            <span className="ds-map__sub">{nodes[n.id].sub}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
};

export default SystemMap;
