# InspiredTax Africa — Landing Site Redesign: Implementation Handover

Audience: the implementing AI (Sonnet/Opus). This document + DECISIONS.md is the complete
instruction set. Follow it exactly; where it is silent, choose the option that looks most
hand-crafted and least "AI template". Update STATUS.md after every batch.

---

## 1. Current-state audit (what you are changing and why)

Repo root (GitHub Pages static site, domain per CNAME = inspiredtax.co.za):

| Path | State | Action |
|---|---|---|
| `index.html` (539 lines) | Tailwind-CDN one-pager: navy/green palette, hero, calculator modal + 3 cards, 5 article cards, "Roadmap/AI" placeholder section, **no footer**, **no #download section** (CTAs point to a missing anchor), inline JS | Full rewrite (§4–§6) |
| `calculators/*-light.html`, `*-dark.html` | 3 working standalone calculators (home-office, medical, retirement) opened in a modal iframe | Keep files untouched; restyle cards + modal chrome only |
| `articles/*.html` + `articles-data.json` + `build-articles.py` + `article-template.html` | 8 published articles, python build script | Keep; add `articles/index.html`; restyle template in a later pass only if trivial (optional, §8) |
| `logo.png` | Old logo | Replace when owner adds new assets (§3) |
| `sitemap.xml`, `robots.txt` | Point at inspiredtax.africa | Update domain + new pages (§7) |
| `CNAME` | `inspiredtax.co.za` | Do not touch |

Key defects to fix: dead `#download` anchor, no footer, no FAQ/guide pages, placeholder
"roadmap" boxes that scream unfinished/AI, palette clashes with new logo, generic
Tailwind-default look, weak mobile hero (phone mockup hidden on mobile), no motion.

## 2. Brand system (derived from the attached logo artwork)

The new logo: an Africa-continent outline with a calculator, stroked in an
indigo→cyan gradient, on a very dark desaturated navy. Wordmark: "Inspired" in
near-black/white (theme dependent), "Tax Africa" in the blue gradient.

CSS custom properties — define once in `:root` and use everywhere (drop the Tailwind
config colors; see §6 for the Tailwind-vs-vanilla decision):

```css
--ink:        #10152B;  /* page dark background, from logo bg #1a1f37 family */
--ink-soft:   #181E38;  /* raised surfaces on dark */
--indigo:     #3B3BEF;  /* gradient start (logo top-left) */
--azure:      #2D6BFF;  /* gradient mid */
--cyan:       #37B6F0;  /* gradient end (logo bottom-right) */
--grad:       linear-gradient(135deg, var(--indigo), var(--azure) 55%, var(--cyan));
--paper:      #F7F8FC;  /* light section background */
--card:       #FFFFFF;
--text:       #1B2138;  /* body text on light */
--text-mute:  #5A6072;
--text-inv:   #EAECF6;  /* body text on dark */
--line:       #E4E7F0;  /* hairline borders on light */
--line-inv:   rgba(255,255,255,0.10);
```

Rules:
- **Green is gone.** All CTAs use `--grad` fill (or azure solid for small elements).
- Layout: alternating bands — dark hero (`--ink`), light content sections (`--paper`/white), dark footer. This mirrors the logo's two lockups (light + dark).
- Typography: system-premium stack, no Google Fonts request needed:
  `font-family: "Segoe UI Variable Display","Segoe UI",-apple-system,"SF Pro Display",Inter,Roboto,sans-serif;`
  Headings: weight 700–800, `letter-spacing:-0.02em`. The gradient text treatment
  (`background:var(--grad); -webkit-background-clip:text; color:transparent`) is used for ONE
  key phrase per section max — restraint is what reads premium.
- Radii: 16px cards, 12px buttons, 999px pills. Shadows: soft + colored, e.g.
  `0 12px 32px rgba(45,107,255,.18)` on primary CTA; hairline borders elsewhere. Never
  Tailwind's default gray `shadow-md` look.

## 3. Assets

Owner attached 5 brand images in chat; **they are not in the repo**. Expect the owner to add
them under `/assets/` with these names (put this exact list in your first commit message and
in STATUS.md so the owner knows what to upload):

- `assets/logo-horizontal-light.png` — full lockup, light background (~1500×760)
- `assets/logo-horizontal-dark.png`  — full lockup, dark background (~1500×760)
- `assets/icon-dark.png`   — square icon on dark (800×800)
- `assets/icon-transparent.png` — square icon, transparent bg (800×800)
- `assets/icon-large.png`  — tall large icon (~780×1170)

Until they exist:
- Nav + footer logo: recreate the wordmark in styled HTML text — "Inspired" (white on dark)
  + "Tax Africa" with gradient-clip text — beside a 32px inline SVG mark (simplified Africa
  outline + calculator, stroked with an SVG `linearGradient` indigo→cyan). This SVG is also
  the permanent favicon (`<link rel="icon" type="image/svg+xml">` with the SVG inlined as a
  data URI or `/assets/favicon.svg` file you create).
- Reference the PNGs only for `og:image` (point at `assets/logo-horizontal-dark.png`; it will
  404 until owner uploads — acceptable, note in STATUS.md).
- Build so that swapping text-lockup → `<img>` is trivial (wrap in `.brand` component).

## 4. Page architecture

```
index.html            one-page landing (sections below)
articles/index.html   NEW — all-articles listing
faq/tax-faq.html      NEW — placeholder copy
faq/app-faq.html      NEW — placeholder copy
guides/tax-guide.html NEW — placeholder copy
privacy.html          NEW — short, real privacy statement (offline app, no data collected;
                      site: no cookies except Formspree submission). Write honest minimal
                      copy, mark for owner review. Needed so footer has no dead links.
```

### index.html section order (nothing else — cut everything not listed)
1. **Nav** (sticky, dark, blurs on scroll)
2. **Hero** — headline + subhead + waitlist CTA + phone mockup
3. **Feature strip** — 3–4 concise app value props (replaces nothing currently on page; new, small)
4. **Free calculators** — 3 cards, keep the modal system
5. **Featured articles** — exactly 3 cards + "All articles →" link to articles/index.html
6. **Waitlist / download band** (`id="download"` — fixes the dead anchor)
7. **Footer**

### Section specs

**Nav.** Dark `--ink`, `position:sticky`, `backdrop-filter:blur(12px)` + translucency once
scrolled (toggle a `.scrolled` class via JS). Left: brand. Right (desktop): Features,
Calculators, Articles, FAQ (dropdown or direct link to tax-faq), Tax Guide, and a gradient
pill button "Get the app". Mobile: hamburger → full-height slide-in panel (translateX
transition, not display-toggle), large tap targets (min 48px), closes on link tap. "Get the
app" scrolls to `#download`.

**Hero.** Dark band. Left column: small pill badge "🇿🇦 Built for SA provisional taxpayers ·
Launching soon on Google Play" (no alpha wording). H1 ~ "Know your SARS bill before SARS
does." — one gradient-clipped phrase. Subhead: offline, private, penalty-avoiding provisional
tax planning for freelancers & contractors. CTAs: primary gradient button "Notify me at
launch" → `#download`; secondary ghost button "Try the free calculators" → `#calculators`.
Below CTAs a quiet trust row: "Offline-first · POPIA-aligned · 2026/27 SARS tables".
Right column: **CSS phone mockup** (visible on mobile too — below the copy, scaled ~0.85):
rounded-[44px] dark frame, subtle gradient edge-light, screen shows a plausible app screen:
"2026/27 · Period 1" header, big "R 71,272" liability figure, a small horizontal bar
(taxable income vs deductions) drawn with divs, rows "s11F deduction — applied ✓",
"Penalty risk — low", bottom pill "Saved locally · encrypted". Give the phone a slow
`transform: translateY` float animation (6s ease-in-out infinite alternate, ±8px) and a
gradient glow blob behind it (`filter:blur(80px)`, low opacity). Background: very subtle
radial gradient + faint dot-grid or topographic texture via CSS only — no big pattern noise.

**Feature strip.** Light band. 4 compact items in a responsive grid (2×2 on mobile):
Provisional tax (IRP6) planning · 11 deduction calculators incl. s11F · Penalty & audit-risk
checks · 100% offline & encrypted. Each: small gradient-tinted icon chip (inline SVG, stroke
style consistent set — use Lucide-style paths), bold 1-line title, 1 sentence. No dashed
borders anywhere on the site.

**Calculators.** Keep existing modal + iframe mechanism and the 3 cards' content, restyle:
white cards, 16px radius, hairline `--line` border, icon chips using gradient tint, hover =
`translateY(-4px)` + colored shadow + border-color shift (200ms cubic-bezier(.2,.8,.2,1)).
Modal toolbar recolored to `--ink`; keep light/dark iframe toggle exactly as it works now
(JS at the bottom of current index.html — port it unchanged apart from styling). Cards keep
real `href` fallbacks for no-JS/SEO (as now).

**Articles.** 3 featured: `how-to-reduce-tax-south-africa`, `tax-deductions-south-africa-freelancers`,
`freelancers-provisional-tax`. Replace the fake "text-on-color-block" card headers with a
CSS gradient cover per card (each a different angle/stop mix of the brand gradient + a large
faint inline-SVG glyph — coins, home, calendar). Category tag pill, title, 1-line excerpt,
read-time. "All articles →" goes to `articles/index.html`, which lists all 8 articles from
the repo (hand-write the list; read titles/descriptions out of `articles-data.json`) in the
same card style, with the shared nav/footer.

**Waitlist band (`#download`).** Dark band, gradient edge-glow. H2 "Be first on Google Play."
Line: launching soon; early subscribers get launch pricing. Formspree form:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="waitlist">
  <input type="email" name="email" required placeholder="you@email.co.za" autocomplete="email">
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" aria-hidden="true">
  <button type="submit">Notify me</button>
</form>
```

Inline JS: intercept submit with `fetch` (`Accept: application/json`), swap form for a
success message ("You're on the list ✓") with a little scale-in; on error fall back to
normal POST. Next to the form, a disabled-style "Google Play — coming soon" badge: draw it
as HTML/CSS (play triangle SVG + "GET IT ON / Google Play" text) so the owner can later
replace with the official badge `<a>` in one edit — leave a `<!-- SWAP AT LAUNCH -->` comment.

**Footer.** Dark. 3 columns (stack on mobile): (1) brand + one-liner + "Made in South
Africa 🇿🇦"; (2) Explore: Calculators, Articles, Tax FAQ, App FAQ, Tax Guide; (3) Contact:
founder@inspiredtax.co.za (mailto), Privacy. Bottom row: © 2026 InspiredTax Africa ·
"Information on this site is general guidance, not tax advice." **Every link must resolve** —
no `#` stubs, no social icons for accounts that don't exist.

## 5. New content pages (FAQ ×2, Guide, Privacy, Articles index)

Shared shell: same nav + footer as index (copy-paste; this is a no-build static site — keep
them byte-identical across pages so future edits are mechanical). Content column
`max-width:760px`. Dark compact page-header band with H1 + one-line description, then light
body.

- `faq/tax-faq.html` — "South African Tax FAQ". 8–10 `<details>` accordions (native element,
  styled: hairline dividers, animated chevron via `details[open] summary svg {rotate:180deg}`,
  smooth open using a small JS height-animation helper or `interpolate-size: allow-keywords`
  with graceful fallback). Questions as placeholders the owner will fill, but write REAL
  question titles (Who must pay provisional tax? When are IRP6 deadlines? What is s11F? What
  is the paragraph 20 penalty? etc.) with body text `<!-- OWNER COPY: ... -->` + 1-sentence
  stub so the page never looks broken. Add FAQPage JSON-LD matching the questions.
- `faq/app-faq.html` — "Using the InspiredTax App": install/early access, offline & where data
  is stored, encryption, price/launch pricing, updates for new tax years, support contact.
  Same treatment.
- `guides/tax-guide.html` — "The Provisional Tax Guide": a long-form page with a sticky (desktop)
  table of contents, sections: What is provisional tax → Who qualifies → IRP6 P1/P2 deadlines →
  Estimating income → Deductions overview → Penalties → How the app helps (funnel CTA to
  `#download` on index). Structured placeholder copy as above; end with the waitlist band.
- `privacy.html` — real short copy (see §4 list).
- `articles/index.html` — per §4.

All new pages: full SEO head (title, description, canonical on inspiredtax.co.za, OG) and
must be added to `sitemap.xml`.

## 6. Tech & motion spec

**Drop the Tailwind CDN.** It's a render-blocking 100KB+ script, flashes unstyled config,
and is the #1 "AI-generated" tell. Rewrite with a single hand-written `assets/site.css`
(vanilla CSS, custom properties from §2, ~400–600 lines) shared by all pages, plus one small
`assets/site.js`. **Do not modify the calculator pages** — they are self-contained.

Motion (this is the "fancy" the owner asked for — do all of it, nothing more):
1. **Scroll-reveal**: one `IntersectionObserver` adds `.in` to `[data-reveal]` elements —
   `opacity 0→1, translateY 16px→0, 500ms, cubic-bezier(.2,.8,.2,1)`, stagger siblings via
   `transition-delay` set from `data-reveal-delay` or nth-child. Apply to section headings,
   cards, feature items.
2. Hero entrance: copy fades/rises on load (CSS animation, no JS), phone floats (§4).
3. Card hovers per §4; buttons: gradient CTA gets `transform:translateY(-2px)` + shadow
   bloom on hover, `:active` presses down; add a subtle animated sheen on the primary CTA
   (pseudo-element gradient sweep on hover only).
4. Nav blur/elevate on scroll (§4).
5. Waitlist success micro-animation (§4).
6. Smooth scroll (`scroll-behavior:smooth`) + `scroll-margin-top` on anchored sections.
7. **`@media (prefers-reduced-motion: reduce)`: disable all of the above.** Non-negotiable.

No animation libraries, no GSAP, no AOS — everything above is ~60 lines of JS max.

Mobile-first requirements (primary audience is on phones):
- Author CSS mobile-first; test 360px width. No horizontal scroll anywhere.
- Hero mockup visible on mobile (below copy), CTAs full-width, min 48px height.
- Slide-in nav panel per §4; `100dvh` not `100vh`.
- Calculator modal on small screens: full-screen sheet (100dvh, no rounded corners),
  iframe `min-height` adjusted so inputs aren't cramped.
- Tap targets ≥44px, base font ≥16px (prevents iOS zoom on the email input).
- Performance: no webfont downloads, inline critical hero CSS is unnecessary if site.css is
  small — just keep total CSS+JS under ~40KB. Lazy-load nothing critical; no images above
  the fold except inline SVG.

Accessibility: semantic landmarks, one `<h1>` per page, focus-visible styles on the gradient
buttons (2px azure outline offset 2px), modal traps Escape (already does) — also return focus
to the opening card on close; `aria-expanded` on hamburger.

## 7. SEO / metadata migration

- Global find: `inspiredtax.africa` → `https://inspiredtax.co.za` in index.html head
  (canonical, og:url, og:image, twitter, all three JSON-LD blocks), `sitemap.xml`, and any
  article/calculator pages that reference it (grep the whole repo).
- JSON-LD: keep SoftwareApplication (availability stays ComingSoon — correct for pre-launch),
  Organization (email → founder@inspiredtax.co.za; confirm with owner if unsure, note in
  STATUS.md), ItemList for calculators. Add FAQPage schema on both FAQ pages.
- sitemap.xml: add the 5 new pages + articles/index.html, current lastmod dates.
- Update title/description to match new copy; keep keyword substance (provisional tax
  calculator South Africa, IRP6, s11F, SARS).

## 8. Explicitly out of scope
- Rewriting article page contents or article-template.html (optional: only align template's
  nav/footer/colors if it takes <1 file edit; otherwise leave and note in STATUS.md).
- Touching calculator HTML files, `build-articles.py`, `CNAME`, `PUBLISHING.md`.
- Building real FAQ/guide copy (owner supplies), Play Store links, analytics, cookie banners.

## 9. Implementation batches (commit after each; update STATUS.md each time)

1. **Assets & CSS foundation** — `assets/site.css`, `assets/site.js`, favicon SVG, brand
   component. Commit: "Add brand system, shared CSS/JS for redesign".
2. **index.html rewrite** — full page per §4, dead Tailwind removed, all sections, modal JS
   ported. Verify: open in browser (headless screenshot at 360px and 1280px), click every
   link, open each calculator modal, toggle theme, submit form (expect Formspree 404 with
   placeholder ID — fine).
3. **New pages** — FAQ ×2, guide, privacy, articles/index. Same shell, placeholder copy.
4. **SEO pass** — domain migration, sitemap, JSON-LD, robots check.
5. **QA pass** — checklist below, fix findings, final screenshots committed to
   `redesign/screenshots/` for owner review.

### QA checklist (must all pass before finishing)
- [ ] Zero dead links/anchors site-wide (crawl all hrefs incl. footer, both FAQs, guide)
- [ ] No green (#1FAF73 family) or Tailwind CDN reference remains
- [ ] 360px width: no horizontal scroll, mockup visible, nav panel works
- [ ] Calculators open, both themes, close on Escape/backdrop, full-screen on mobile
- [ ] prefers-reduced-motion disables animations
- [ ] All pages: valid canonical on inspiredtax.co.za, in sitemap
- [ ] Lighthouse (or equivalent) mobile: perf ≥ 90, a11y ≥ 95 on index
- [ ] STATUS.md updated; blockers-for-owner list refreshed

## 10. Copy tone guide (anti-AI-generated)
Short, confident, specific, South African. Use real numbers (R350,000 cap, 27.5%, 31 August,
IRP6) instead of adjectives. Ban list: "unlock", "seamless", "empower", "revolutionize",
"journey", "effortless", em-dash chains, exclamation marks, emoji outside the two specced
(🇿🇦 badge, ✓ success). Every sentence must survive "would a Joburg accountant say this?".
