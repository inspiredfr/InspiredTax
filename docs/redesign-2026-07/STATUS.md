# Redesign Project Status

**Branch:** `claude/tax-app-landing-page-nagnwi`
**Phase:** IMPLEMENTED — legal docs added, awaiting owner review + final copy
**Last updated:** 2026-07-08

## Workflow
1. ✅ Site audit (HANDOVER.md §1)
2. ✅ Owner interview (DECISIONS.md)
3. ✅ Spec + handover written (HANDOVER.md) — merged in PR #5
4. ✅ IMPLEMENTATION — done per HANDOVER.md (see "What was built" below)
5. ⬜ Owner review + supply of FAQ/guide copy and Formspree ID
6. ⬜ Merge/deploy (GitHub Pages, domain inspiredtax.co.za)

## What was built (this branch)
- `assets/site.css` — hand-written design system (indigo→cyan brand, dark/light bands,
  buttons, cards, nav, modal, FAQ accordions, guide TOC, reveal animations,
  prefers-reduced-motion support). Tailwind CDN removed entirely.
- `assets/site.js` — nav blur/elevate, mobile slide-in panel, IntersectionObserver
  scroll-reveal with stagger, phone count-up + bar fills + pointer tilt, calculator
  modal (light/dark iframe toggle preserved), Formspree fetch submit with success
  animation, guide TOC active-state.
- `assets/favicon.svg` — gradient Africa+calculator mark (also used as inline brand mark).
- `index.html` — full rewrite: hero (CSS phone mockup, visible on mobile), 4-feature strip,
  3 calculator cards + restyled modal, 3 featured articles, `#download` waitlist band
  (fixes old dead anchor), full footer. Roadmap/AI section and alpha wording removed.
- New pages, shared shell: `faq/tax-faq.html` (8 Q accordions + FAQPage JSON-LD),
  `faq/app-faq.html` (7 Q + JSON-LD), `guides/tax-guide.html` (7 sections, sticky TOC),
  `privacy.html` (with SARS disclaimer C-E4 integrated), `terms.html` (full Terms of Service C-E5),
  `articles/index.html` (all 8 articles).
- Legal docs: `privacy.html` now includes "Not Affiliated with SARS" disclaimer from C-E4.
  `terms.html` new page with full Terms of Service (C-E5, 8 sections). All footers updated with
  Legal links (Privacy, Terms of Service, Contact). Sitemap.xml includes new terms page.
- SEO: all canonical/OG/schema/sitemap URLs migrated inspiredtax.africa → inspiredtax.co.za
  site-wide (email addresses in schema left as-is pending owner review). sitemap.xml: +6 new pages.
- Verified headless (Chromium): desktop 1280px + mobile 360px screenshots, zero console
  errors, zero horizontal scroll, local link crawl clean.

## BLOCKERS for the owner
1. **Formspree form ID** — replace `YOUR_FORM_ID` in index.html waitlist form
   (`<!-- OWNER: ... -->` comment marks it). Until then submissions fail gracefully.
2. **Final copy** — placeholders marked `<!-- OWNER COPY -->` + visible "Placeholder" chips
   in faq/tax-faq.html, faq/app-faq.html, guides/tax-guide.html, privacy.html.
3. **Logo assets** — assets/logos_lockups is currently a text file, not the images. Add the
   approved PNGs; then optionally swap the SVG/text brand lockup for `<img>` in nav/footer
   (the `.brand` component wraps it) and update og:image (currently old logo.png).
4. **Email domain** — site uses founder@inspiredtax.africa (existing address). Confirm
   whether it should become @inspiredtax.co.za.
5. **At app launch** — replace the "Coming soon on Google Play" badge with the official
   badge link; marked `<!-- SWAP AT LAUNCH -->` in index.html.

## Notes for any AI taking over
- No build step: pure static HTML/CSS/JS. Inner pages share a byte-identical nav/footer
  shell — edit all of them together (a generator script existed only in a scratchpad;
  regenerating by hand-editing each file is fine).
- Do not touch: `calculators/*.html` (self-contained), `build-articles.py`,
  `article-template.html` (old Tailwind styling — restyling article pages is a possible
  future pass), `CNAME`.
- HANDOVER.md remains the design reference for any further UI work.
