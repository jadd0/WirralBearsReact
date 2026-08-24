# Wirral Bears — Design System

The public site (`apps/web`, App Router group `(site)`) follows this. The admin
area behind `/admin` is deliberately excluded: it is authenticated, low
traffic, and full of working editor machinery that a visual pass would put at
risk for no visible gain.

Tokens live in `apps/web/src/app/globals.css` under `:root` and are exposed to
Tailwind v4 through `@theme inline`. There is no `tailwind.config.ts` — v4
reads the stylesheet.

## Brand

The identity already existed in the wordmark and kit: a collegiate red mark
with a dark outline on a warm ground. The system is built from that rather
than around it.

## Colour

Red is the **only** accent. Everything else is a warm neutral ramp, so red
always means emphasis: a call to action, an active nav item, a section label.

| Token | Value | Use |
| --- | --- | --- |
| `--brand` | `#be1e2d` | Primary actions, active state, eyebrows |
| `--brand-strong` | `#98151f` | Hover/pressed on brand surfaces |
| `--brand-soft` | `#f4e2e2` | Rare tinted wash |
| `--ink` | `#16130f` | Body text, dark sections, footer |
| `--ink-2` / `--ink-3` / `--ink-4` | | Secondary → tertiary text |
| `--line` / `--line-strong` | | Hairlines and borders |
| `--paper` | `#f7f4ef` | Page ground |
| `--paper-2` | `#efeae3` | Alternating band, sunken surfaces |
| `--surface` | `#ffffff` | Cards |

Rules:

- Never introduce a second accent hue. Green and red inside game results are
  semantic (win/loss), not decorative, and are the one exception.
- Greys are warm. Do not reach for Tailwind's default `gray-*`; use the ink and
  line tokens.
- The old `#d3d2d2` page grey and `#ff0000` are retired. Pure `#000` is never
  used — `--ink` is a warm near-black.

## Shadow

Shadows are warm-tinted, never black at low opacity:
`--shadow-sm`, `--shadow-md` (`shadow-card`), `--shadow-lg` (`shadow-lift`),
and `--shadow-brand` for red buttons. One light source, always from above.

## Type

**Archivo** (variable, weights 400–800) via `next/font`, exposed as
`--font-archivo` and used for both `font-sans` and `font-display`. A single
family across a wide weight range reads more deliberate here than a pairing,
and it sits beside the collegiate wordmark without competing.

- Display: `font-display`, weight 800, `tracking-[-0.03em]`, leading ~1.0.
  Sizes use `clamp()` so they scale without breakpoint steps.
- Body: 15–17px, generous leading, `text-ink-3`.
- Prose measure is capped at `68ch` (`.container-prose`).
- `.eyebrow` — 12px, 600, `0.18em` tracking, uppercase, brand red.
- Numbers in schedules and stats use `.tabular`
  (`font-variant-numeric: tabular-nums`) so columns line up.
- `text-wrap: balance` on headings, `pretty` on paragraphs.

## Layout

- `.container-page` — max `78rem` (1248px) with responsive gutters. The old
  site capped content at `max-w-2xl`, which left most of a desktop screen
  empty; that was the single biggest thing making it read as cheap.
- `.section` — the standard vertical rhythm, with slightly more padding at the
  bottom than the top (optical, not mathematical).
- Sections alternate `--paper` and `--paper-2` to separate bands. Full-`--ink`
  sections are used deliberately (hero, joining, footer), never as a one-off
  dark block dropped into a light page.
- Prefer asymmetry: the home page uses `1fr / 1.05fr` splits and an offset
  second image that breaks its column, rather than three equal cards.

## Components

- `PageHeader` — the standard opening for interior pages (eyebrow, title,
  optional lead). Every page uses it, so they all start on the same rhythm.
- `InfoBox` — a light panel. It owns its own background; call sites must not
  pass one.
- `SiteHeader` — sticky, two tier. A dark utility strip carries the values
  pages and the shop, the main bar carries the mark, primary nav and the join
  CTA. Active state is brand red plus an underline, and `aria-current="page"`.
- Cards are borders and warm shadows on `--surface`. Content is pinned so that
  titles and meta rows share a baseline across a row.

## States

Every interactive element defines rest, hover, active and focus.

- Hover: `-translate-y-px` (buttons) or `-translate-y-1` (cards), plus a colour
  or shadow shift, over 200–300ms.
- Active: `scale-[0.98]`.
- Focus: a single global `:focus-visible` outline in brand red. Never removed.
- Motion is `transform`/`opacity` only, and everything is disabled under
  `prefers-reduced-motion`.

## Empty states are the default state

Most content is CMS-driven and much of it is currently empty. **Design the
empty case first.** Blog previews, coach previews and the session schedule each
render a composed panel that explains what will appear and offers a next step —
never a bare "no results" line.

The ten Ball 4 All principles are club copy, not CMS content: they live in
`src/lib/ballForAll.ts` and always render. Photography is enhancement, and only
some of the ten have an image. The grid splits on that: the photographed ones
render as wide 4:3 photo cards, three up, and the rest as a compact text band,
five up, with no media slot at all. Two tile shapes rather than one shape with a
placeholder, so the imageless principles read as a different kind of tile rather
than as a failed image. Both bands are derived from the data, so the section
stays correct if the photo library grows.

## Imagery

Use the club's own photography in `public/images`. Never placeholder services.
Meaningful images need real `alt` text; decorative ones take `alt=""`.
