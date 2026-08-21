# Redesign Project Status

**Branch:** `claude/fintech-marketing-website-94nfe1`
**Phase:** v2 IMPLEMENTED — premium fintech rebuild of the marketing site
**Last updated:** 2026-08-21

## History
1. ✅ Site audit (HANDOVER.md §1)
2. ✅ Owner interview (DECISIONS.md)
3. ✅ Spec + handover (HANDOVER.md) — merged in PR #5
4. ✅ v1 implementation (navy/cyan, hand-written CSS, Tailwind CDN removed)
5. ✅ **v2 — premium fintech redesign (this branch)**, see below
6. ⬜ Owner review + supply of Formspree ID and any final copy

---

## v2 — what changed

The site is now **dark by default across every page**, using the InspiredTax app's own
design language at marketing scale: emissive canvas, category colour owning each section
(cyan / emerald / violet / amber / blue), semantic mint & red reserved for outcomes, and
Space Grotesk for headings and all tabular figures with Inter for body copy.

### `assets/site.css` (rewritten, ~1,000 lines)
Token layer (`--canvas`, `--surf*`, `--line*`, category + semantic colours) with the old
v1 names kept as aliases so every existing page repaints from the new system without markup
changes. Adds: hero device/screen system, scrollytelling tour, tax-year timeline, deduction
waterfall, cursor-spotlight cards, marquee ticker, security diagram, article typography,
and a full `prefers-reduced-motion` suppression block.

### `assets/site.js` (rewritten, ~640 lines, no dependencies)
- **Hero field** — canvas node lattice with travelling data pulses, DPR-capped, paused when
  offscreen or the tab is hidden, pointer parallax on fine pointers only.
- **Device controller** — phone screens shown one at a time; each activation replays that
  screen's bar fills, gauge arcs and number count-ups. Hero auto-cycles; the tour device is
  driven by scroll position.
- **Scrollytelling tour** — IntersectionObserver maps four panels to four app screens.
- **Tax-year clock** — computes the live SA provisional cycle (1 Mar → 31 Aug → last day of
  Feb → 30 Sep top-up) from today's date, positions a "today" marker, and counts down to the
  next deadline. Rolls over automatically; nothing is hard-coded.
- **Deduction waterfall** — animated build-up with a *With InspiredTax / No planning*
  scenario toggle. Figures reconcile on 2026/27 rates (see below).
- Kinetic headline word-swap, split-text heading reveals, spotlight cards, scroll progress
  bar, nav section highlighting, plus the v1 modal / waitlist / TOC behaviour preserved.

### `index.html` (rewritten)
Nav → hero (canvas + device) → figures ticker → tax-year clock → four-panel app tour →
deduction engine → capability strip → calculators → offline/POPIA section → stats →
articles → FAQ → waitlist → footer.

### Article pipeline
`templates/article-template.html` rewritten onto the shared shell (nav, dark article header
with breadcrumbs, prose column, sticky info/CTA sidebar, author bio, related cards, footer)
and all 13 article pages regenerated. `scripts/build-articles.py` now emits the FAQ block as
native `<details class="faq">` accordions and supports `> ` blockquote callouts.
`articles/salaried-tax-deductions.html` — previously an orphaned, unlinked, light-mode page
with no site chrome — was converted into `content/articles/sources/salaried-tax-deductions.md`
so the build pipeline owns it; it is now carded on the article index and in `sitemap.xml`.

### Inner pages
`faq/*`, `guides/*`, `privacy.html`, `terms.html`, `articles/index.html` (and their
`content/` twins) picked up the new system through the shared class names. Each also got the
new font pair, `theme-color` / `color-scheme` meta, the nav scroll-progress bar, and a
centred page-head bloom in place of the old off-centre corner glow.

## Worked example used on the page
Illustrative freelancer billing **R862,000** in 2026/27, medical credits for two members:

| | With InspiredTax | No planning |
|---|---|---|
| Deductions (s11F 180,000 · home office 38,400 · travel 41,200 · equipment 22,800) | R282,400 | R0 |
| Taxable income | R579,600 | R862,000 |
| Tax after primary rebate (R17,235) | R128,288 | R235,704 |
| Less medical scheme credits | R8,736 | R8,736 |
| **Provisional tax payable** | **R119,552** | **R226,968** |
| Effective rate | 13.9% | 26.3% |

Difference: **R107,416**. These figures live in one `SET` object at the top of the waterfall
IIFE in `assets/site.js` — update them there if SARS rates change.

## Verification done (headless Chromium, 1440px + 390px)
- 23 pages crawled: zero dead links, zero dead in-page anchors, zero JS errors.
- Zero horizontal overflow on both widths, every page.
- `prefers-reduced-motion: reduce`: canvas removed, marquee/float/sheen stopped, all figures
  and headings render at their final values.
- Accessibility tree: one `<h1>` per page; the rotating hero word is `aria-hidden` behind a
  stable `sr-only` phrase so the heading reads "Know your SARS bill before SARS does."
- Calculator modal: opens (dark by default), light/dark toggle, Escape + backdrop close,
  focus trap, focus returned to the opening card.

## BLOCKERS for the owner
1. **Formspree form ID** — replace `YOUR_FORM_ID` in the `index.html` waitlist form
   (`<!-- OWNER: ... -->` marks it). Until then submissions fail gracefully.
2. **Final copy** — `<!-- OWNER COPY -->` placeholders remain in `faq/tax-faq.html`,
   `faq/app-faq.html`, `guides/tax-guide.html`, `privacy.html`.
3. **Logo assets** — `assets/logos_lockups` is still a text file. Add the approved PNGs, then
   optionally swap the mark for a full lockup `<img>` (the `.brand` component wraps it).
4. **At app launch** — replace the "Coming soon on Google Play" badge with the official badge
   link; marked `<!-- SWAP AT LAUNCH -->` in `index.html`.

## Notes for any AI taking over
- No build step for the site itself; articles are generated by `scripts/build-articles.py`
  from `content/articles/sources/*` — **edit the template, not `articles/*.html`**, then
  rerun the script. `scripts/publish-scheduled.py --rebuild-index` regenerates index cards.
- Do not touch `calculators/*.html` (self-contained; still carry their own DM Sans + legacy
  palette by design) or `CNAME`.
- `examples/example-article.html` is a stale, unlinked dev artifact still on the old Tailwind
  template. Nothing references it and it is not in the sitemap — delete it or leave it.
- `overflow: hidden` on any ancestor of `.tour-sticky` breaks the sticky app tour; that
  section deliberately uses `overflow-x: clip`.
- HANDOVER.md remains the record of the v1 brief; this file describes the current build.
