# Editorial Calendar

Scheduled articles live in `content/articles/queue/` and are published
automatically on their `DATE:` by `.github/workflows/publish-scheduled.yml`
(see `docs/ARTICLE-AUTOMATION.md`). One article publishes every 10 days.

## Scheduled queue (2026/27 season)

| # | Publish date | Category | Title | Slug |
|---|--------------|----------|-------|------|
| 1 | 2026-07-28 | Compliance | Filing Season 2026: What Provisional Taxpayers Need to Know Before Touching Their ITR12 | `tax-filing-season-2026-provisional-taxpayers` |
| 2 | 2026-08-07 | Compliance | How to Estimate Irregular Freelance Income for Your August IRP6 | `estimating-freelance-income-irp6` |
| 3 | 2026-08-17 | Compliance | Seven IRP6 Mistakes That Cost Provisional Taxpayers Money | `common-irp6-mistakes` |
| 4 | 2026-08-27 | Compliance | The Final Stretch: Your 31 August IRP6 Checklist | `irp6-deadline-checklist-august` |
| 5 | 2026-09-06 | Compliance | Missed the August IRP6 Deadline? Penalties, Interest, and How to Limit the Damage | `missed-irp6-deadline-what-now` |
| 6 | 2026-09-16 | Tax Planning | The Voluntary Third Provisional Payment: Who Should Top Up Before 30 September | `voluntary-third-provisional-payment` |
| 7 | 2026-09-26 | Compliance | Record-Keeping for Freelancers: What SARS Expects You to Keep for Five Years | `freelancer-record-keeping-sars` |
| 8 | 2026-10-06 | Deductions | The Home Office Deduction: How Freelancers Qualify Under Section 23(b) | `home-office-deduction-south-africa` |
| 9 | 2026-10-16 | Deductions | Medical Aid Credits for the Self-Employed: Sections 6A and 6B Explained | `medical-aid-credits-self-employed` |
| 10 | 2026-10-26 | Tax Planning | Why October Is the Right Time to Plan Your Retirement Annuity Top-Up | `retirement-annuity-planning-october` |
| 11 | 2026-11-05 | Business | VAT and the Freelancer: When You Must Register — and When You Shouldn't | `vat-registration-freelancers-south-africa` |
| 12 | 2026-11-15 | Business | Sole Proprietor or Company? How Freelancers Should Think About Incorporating | `sole-proprietor-vs-company-south-africa` |
| 13 | 2026-11-25 | Deductions | Buying Equipment Before Year-End: Wear-and-Tear Allowances Under Section 11(e) | `equipment-wear-and-tear-deductions` |
| 14 | 2026-12-05 | Tax Planning | The Festive Season Cash-Flow Trap: Managing Tax on Irregular Income | `freelancer-cash-flow-december` |
| 15 | 2026-12-15 | Deductions | Client Gifts and Entertainment: What Freelancers Can Actually Deduct | `client-gifts-entertainment-tax` |
| 16 | 2026-12-25 | Compliance | Crypto and SARS: How Digital Asset Gains Are Taxed in South Africa | `crypto-tax-south-africa` |
| 17 | 2027-01-04 | Compliance | The January ITR12 Deadline: Provisional Taxpayers' Last Call for 2025/26 | `itr12-deadline-january-provisional` |
| 18 | 2027-01-14 | Compliance | The February IRP6: Why Your Second Provisional Payment Is the One That Matters | `second-provisional-payment-february` |
| 19 | 2027-01-24 | Tax Planning | The February RA Top-Up: Worked Examples of What a Lump Sum Actually Saves | `february-ra-top-up-worked-examples` |
| 20 | 2027-02-03 | Compliance | The Basic Amount: When You Can Rely on It — and When You Can't | `basic-amount-second-period` |
| 21 | 2027-02-13 | Tax Planning | Budget Week: What South African Freelancers Should Actually Watch For | `budget-2027-freelancers-watchlist` |
| 22 | 2027-02-23 | Tax Planning | The 28 February Checklist: Eight Things to Do Before the Tax Year Closes | `tax-year-end-checklist` |
| 23 | 2027-03-05 | Tax Planning | New Tax Year, Clean Slate: Setting Up 2027/28 in the First Two Weeks of March | `new-tax-year-setup-2027-28` |
| 24 | 2027-03-15 | Compliance | Do You Actually Need to Be a Provisional Taxpayer? | `who-is-a-provisional-taxpayer` |
| 25 | 2027-03-25 | Tax Planning | Your First Year of Freelancing: The Complete Tax Setup | `first-year-freelancer-tax-guide` |

## The seasonal logic

Topics track the South African tax calendar so each article lands when its
subject is timely:

- **Jul–Aug** — filing season opens; first IRP6 (31 Aug) build-up and deadline
- **Sep** — post-deadline recovery; voluntary third payment (30 Sep); records
- **Oct–Nov** — deduction deep-dives and planning season (home office, medical,
  RA planning, VAT, entity choice, equipment before year-end)
- **Dec** — cash flow through the festive slowdown; gifts/entertainment; crypto
- **Jan–Feb** — ITR12 deadline; second IRP6 build-up (estimate accuracy,
  basic amount, RA top-up); Budget week; year-end checklist
- **Mar** — new tax year setup; who must be provisional; first-year guide

## Topic guidance for future articles

When adding to the queue (manually or via the Claude routine):

1. **Date** = last queued article's date + 10 days. Keep the cadence unbroken.
2. **Seasonal first** — pick the topic a provisional taxpayer needs at that
   point in the tax calendar (see the logic above; deadline-adjacent dates get
   deadline content).
3. **No duplicates** — check `content/articles/sources/` and this calendar.
   A fresh angle on a covered subject is fine; a rehash is not.
4. **Site canon** — keep figures consistent with the site: s11F cap
   **R430,000** (27.5%), paragraph 20 threshold **R1.8m** (2026/27). For
   annually-changing figures the site doesn't state (brackets, credits),
   describe the mechanism and point readers to the current SARS tables.
5. **Format** — the KEY: header block from `docs/PUBLISHING.md`, 2–3 single-line
   `FAQ: Question|Answer` pairs, `##`/`###` sections, ~900–1,400 words, no
   inline markdown links (the builder doesn't convert them).
6. **Voice** — practical, precise, section-references (s11F, paragraph 20),
   worked examples with plausible rand figures, no fluff, general-guidance
   tone (the site footer carries the disclaimer).

Evergreen backlog (use when no seasonal topic fits): ring-fencing of assessed
losses (s20A), invoicing & accrual timing, foreign clients & source rules,
tax clearance status for tenders, interest & TFSA planning for freelancers,
UIF/COIDA obligations when hiring, turnover tax vs standard system.
