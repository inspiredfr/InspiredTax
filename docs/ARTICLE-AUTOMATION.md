# Automated Article Publishing

The site publishes one tax article every 10 days, automatically. Two systems
work together:

1. **The scheduler** (in this repo) — publishes pre-written articles from a
   queue on their scheduled dates.
2. **The writer** (a Claude routine) — tops up the queue with a new seasonal
   article when it runs low, so the cadence never breaks.

## 1. The scheduler

```
content/articles/queue/*.md         ← pre-written articles, DATE: = go-live date
        │
        │  .github/workflows/publish-scheduled.yml
        │  (daily, 03:20 UTC / 05:20 SAST — also runnable manually
        │   from the Actions tab via "Run workflow")
        ▼
scripts/publish-scheduled.py
        │  moves due articles → content/articles/sources/
        │  runs scripts/build-articles.py  → articles/<slug>.html
        │                                  → registers in articles-data.json
        │  regenerates the card grid in articles/index.html
        │  adds the URL to sitemap.xml
        ▼
commit + push to main  →  GitHub Pages redeploys  →  article is live
```

Because queued articles are dated 10 days apart, the daily workflow is a
no-op most days and publishes exactly one article every 10th day.

### Day-to-day operations

- **See what's queued** — `docs/EDITORIAL-CALENDAR.md`, or list
  `content/articles/queue/`.
- **Add an article** — drop a source file (format in `docs/PUBLISHING.md`)
  into the queue with a future `DATE:`. Keep the 10-day cadence: last queued
  date + 10.
- **Edit a queued article** — edit the file in the queue any time before its
  date. After it publishes, edit the copy in `content/articles/sources/` and
  the normal build workflow regenerates the page.
- **Reschedule / pull an article** — change its `DATE:`, or move the file out
  of the queue. Files starting with `_` are ignored.
- **Publish something early** — set its `DATE:` to today and run the
  "Publish Scheduled Articles" workflow from the Actions tab (or wait for the
  next morning run).
- **Pause everything** — disable the workflow in the Actions tab.
- **Test locally** —
  `python3 scripts/publish-scheduled.py --date 2026-08-07 --dry-run`

### Notes

- The homepage's four featured article cards are curated by hand and are NOT
  touched by automation; the articles index page (`articles/index.html`) is
  regenerated automatically between its `AUTO-CARDS` markers, newest first.
- Article pages still use `templates/article-template.html` (old Tailwind
  styling — restyling is a known future pass; see
  `docs/redesign-2026-07/STATUS.md`).

## 2. The writer (Claude routine)

A scheduled Claude Code routine fires roughly every 10 days (cron
`0 5 */10 * *`, i.e. the 1st/11th/21st/31st at ~07:00 SAST). Each run:

1. Counts queue articles with a future `DATE:`.
2. **If 3 or more remain → does nothing.** (With 25 articles queued, runs
   are no-ops until early 2027.)
3. Otherwise writes the next article — next 10-day date, seasonal topic per
   the guidance in `docs/EDITORIAL-CALENDAR.md`, site-canon figures — adds it
   to the queue, updates the calendar, and commits.

The routine only ever adds files to `content/articles/queue/` and updates
`docs/EDITORIAL-CALENDAR.md`; the scheduler above remains the only thing that
publishes to the live site. To review articles before they go live, watch
commits touching the queue — every article sits in the queue at least 10 days
before publication, which is the review window.

The routine is managed from Claude (claude.ai/code → Routines). Pause or
delete it there; the scheduler keeps working through whatever remains queued.

## Content standards for generated articles

- South African provisional tax focus, aimed at freelancers/contractors —
  the app's audience.
- Seasonal relevance per the calendar in `docs/EDITORIAL-CALENDAR.md`.
- Figures consistent with the site (s11F cap R430,000; paragraph 20 threshold
  R1.8m). Mechanisms over memorised numbers for anything that changes
  annually — point readers to current SARS tables.
- General guidance tone; the site's footer disclaimer ("not tax advice")
  applies to every article.
