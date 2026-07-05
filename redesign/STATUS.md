# Redesign Project Status

**Branch:** `claude/tax-app-landing-page-nagnwi`
**Phase:** SPEC COMPLETE — awaiting implementation
**Last updated:** 2026-07-05 (spec-authoring AI)

## Workflow
1. ✅ Site audit (see HANDOVER.md §1)
2. ✅ Owner interview (see DECISIONS.md)
3. ✅ Spec + handover written (HANDOVER.md)
4. ⬜ IMPLEMENTATION — done by a separate AI following HANDOVER.md exactly
5. ⬜ Owner review + supply of FAQ/guide copy and Formspree ID
6. ⬜ Merge/deploy (GitHub Pages, domain inspiredtax.co.za)

## For the implementing AI
- Read DECISIONS.md then HANDOVER.md top-to-bottom before touching code.
- Work on this same branch. Commit in the batches listed in HANDOVER.md §9.
- Update this file after each batch: tick the checklist in §9 and note anything skipped/blocked.
- BLOCKERS the owner must resolve (do not wait — use placeholders as specced):
  - Formspree form ID (placeholder `YOUR_FORM_ID` in waitlist form)
  - Final copy for tax-faq.html, app-faq.html, tax-guide.html (build pages with clearly-marked placeholder copy)
  - Logo image assets: owner attached 5 brand images in chat (see HANDOVER.md §3). They are NOT in the repo yet. Owner must add them to /assets/. Until then keep using existing logo.png and build the inline-SVG fallbacks specced in §3.

## Open items / notes
- CNAME = inspiredtax.co.za is canonical; all metadata currently says inspiredtax.africa → must be updated (§7).
- Calculators exist as separate light/dark HTML files in /calculators/ — keep as-is, only restyle the landing-page cards/modal chrome.
- articles-data.json + build-articles.py generate article pages; landing page article cards are hand-written HTML. Do not break the article build.
