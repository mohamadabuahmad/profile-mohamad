import React, { useEffect, useRef } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

// A slowly rotating sphere of connected nodes: the "connected systems" idea as one object.
// Deliberately a 2-D canvas projecting 3-D points rather than a WebGL library — same story,
// a few kilobytes instead of several hundred. It pauses when off screen or in a hidden tab,
// halves its detail on small screens and renders a single static frame with reduced motion.
const HeroCanvas = ({ label }) => {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    // No 2-D context (test environments, blocked canvas): leave the labelled element empty.
    if (!ctx) return undefined;
    let width = 0;
    let height = 0;
    let radius = 0;
    let frame = 0;
    let raf = 0;
    let visible = true;
    let colors = { node: '#3b9bff', line: 'rgba(120,160,255,0.5)', glow: 'rgba(59,155,255,0.25)' };

    const small = () => window.matchMedia('(max-width: 760px)').matches;
    const count = () => (small() ? 70 : 150);

    // Fibonacci sphere: evenly spread points, no clustering at the poles.
    let points = [];
    const build = () => {
      const n = count();
      const golden = Math.PI * (3 - Math.sqrt(5));
      points = Array.from({ length: n }, (_, i) => {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, pulse: Math.random() };
      });
    };

    const readColors = () => {
      const styles = getComputedStyle(canvas);
      colors = {
        node: styles.getPropertyValue('--hero-node').trim() || '#3b9bff',
        line: styles.getPropertyValue('--hero-line').trim() || 'rgba(120,160,255,0.45)',
        glow: styles.getPropertyValue('--hero-glow').trim() || 'rgba(59,155,255,0.22)',
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.36;
      build();
      readColors();
    };

    const draw = (t) => {
      const spin = reduced ? 0.6 : t * 0.00007;
      const tilt = -0.42;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Project every point once per frame.
      const projected = points.map((p) => {
        const cos = Math.cos(spin);
        const sin = Math.sin(spin);
        const x1 = p.x * cos - p.z * sin;
        const z1 = p.x * sin + p.z * cos;
        const y1 = p.y * Math.cos(tilt) - z1 * Math.sin(tilt);
        const z2 = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
        const depth = (z2 + 1.6) / 2.6; // 0 = far, 1 = near
        const scale = 0.65 + depth * 0.5;
        return { x: cx + x1 * radius * scale, y: cy + y1 * radius * scale, depth, pulse: p.pulse };
      });

      // Soft core glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
      gradient.addColorStop(0, colors.glow);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Links between neighbours, faded by distance and depth
      const limit = radius * 0.42;
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j += 1) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > limit) continue;
          const alpha = (1 - dist / limit) * 0.5 * Math.min(a.depth, b.depth);
          if (alpha < 0.02) continue;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = colors.line;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes, brighter towards the front; a few carry a travelling highlight
      projected.forEach((p, i) => {
        const beat = reduced ? 0 : (Math.sin(t * 0.0016 + p.pulse * 6.28) + 1) / 2;
        const size = (0.7 + p.depth * 1.5) * (i % 9 === 0 ? 1.7 + beat * 0.8 : 1);
        ctx.globalAlpha = 0.25 + p.depth * 0.75;
        ctx.fillStyle = colors.node;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      draw(t);
      frame += 1;
      if (frame % 120 === 0) readColors();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reduced) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(0);
    if (!reduced) start();

    const onResize = () => {
      resize();
      draw(performance.now());
    };
    const onVisibility = () => (document.hidden || !visible ? stop() : start());
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      onVisibility();
    });
    io.observe(canvas);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return <canvas className="ds-hero-canvas" ref={canvasRef} role="img" aria-label={label} />;
};

export default HeroCanvas;
