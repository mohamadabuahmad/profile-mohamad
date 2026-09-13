# MohamadDev — the mark (source of truth)

The symbol is taken from `MohamadDev Identity.html` (the approved identity
presentation). **The geometry in this file is the contract.** Everything else —
palette, typography, layout — comes from the website's own design system, which
is the one that predates the identity presentation and is the one in use.

## Idea

**Complex technology. Simple result.**

The mark begins as a complete square — the whole problem, undifferentiated.
Everything unnecessary is removed, and what remains is an M: a form defined
entirely by subtraction. The mark is the *result*, not the process.

## The mark — "Monolith"

Drawn on a 100 × 100 unit field. Four decisions, no curves.

```
viewBox="0 0 100 100"
d="M0 0 H100 V100 H70 V24 L50 64 30 24 V100 H0 Z"
```

- leg width **30**, crown depth **24**, apex at **64**, axis at **50**
- clear space **25 units** on all sides — nothing enters this field
- holds at 16 px because there is only one interior event

**Do not redraw this path.** Size, colour and placement may change; the geometry
and its negative space may not.

It lives in `src/components/brand/Logo.js` as a single component that paints with
`currentColor`, so one SVG serves every context rather than a copy per colour.

## How the mark is coloured on this website

The identity presentation shows the mark in ink on warm white. The website does
not use that palette, so the mark takes the site's own brand colours instead:

| Context | Treatment |
|---|---|
| Navbar | White mark inside the site's 34px brand tile (`--accent-grad`, 10px radius) |
| Footer | White mark inside the same tile at 40px, 12px radius |
| Loading | Bare mark in `--accent` |
| Favicon / app icons | White mark knocked out of the gradient tile |
| Anywhere bare | Inherits `currentColor`, so it is correct in both themes |

The tile is the previous design's existing brand device — the mark simply
replaced the letter "M" that used to sit inside it, which is why the new symbol
reads as though it was always part of this site.

The mark occupies roughly two thirds of its tile, which is the identity's
25-unit clear space expressed as a ratio.

## Wordmark

The wordmark uses the **website's** typography, not the presentation's:

- Space Grotesk 700, matching every other heading on the site
- "Mohamad" in `--ds-ink`, "Dev" in `--accent` — the same accent treatment the
  previous wordmark used for its full stop
- `dir="ltr"` so it stays a locked Latin unit on Arabic and Hebrew pages

## Where it appears

Navbar, mobile menu, footer, page-transition loading state, favicon,
apple-touch-icon, PWA icons (192/512), the web manifest, and the Open Graph
social cards. There is no remaining use of the old logo anywhere in the
repository.
