# Article & Calculator Publishing System

This document explains how to add articles and calculators to the InspiredTax website.

## Overview

The publishing system uses:
- **`articles-data.json`** - Central metadata store for all articles and calculators
- **Markdown files** in `articles/` - Article content
- **`article-template.html`** - Professional HTML template
- **`build-articles.py`** - Build script that generates HTML from data

This system is designed to be:
- ✓ Easy to maintain (edit JSON + markdown)
- ✓ Automatable (single Python script)
- ✓ Consistent (all articles use same template)
- ✓ Scalable (add unlimited articles)

## Adding a New Article

### 1. Add Article Metadata

Edit `articles-data.json` and add an entry to the `"articles"` array:

```json
{
  "id": "unique-slug",
  "slug": "unique-slug",
  "title": "Article Title",
  "description": "Short description for the card",
  "category": "Compliance",
  "categoryColor": "blue",
  "author": "Allan Lombard",
  "date": "2026-03-15",
  "featured": true,
  "readTime": "8 min read",
  "heroColor": "navy-light",
  "heroText": "Subtitle text"
}
```

**Fields explained:**
- `id` and `slug`: Unique identifier (use hyphens, e.g., `my-article`)
- `title`: Article title (appears in browser tab and header)
- `description`: Short summary (appears on homepage card)
- `category`: Article category (Compliance, Deductions, Technology, etc.)
- `categoryColor`: Tailwind color class (navy, blue, green, blue-light, accent)
- `author`: Author name
- `date`: ISO 8601 format (YYYY-MM-DD)
- `featured`: Whether to show on homepage (true/false)
- `readTime`: Estimated reading time ("8 min read", "10 min read", etc.)
- `heroColor`: Background color for article header card
- `heroText`: Text displayed over the hero background

### 2. Create Article Content

Create a markdown file at `articles/SLUG.md` where SLUG matches your article's slug:

```markdown
## Section Title

This is paragraph content. Use markdown formatting:
- Bullet points
- **bold text**
- *italic text*

## Another Section

More content here.

### Subsection

Even more detailed content.
```

**Markdown support:**
- `##` = h2 (section headers)
- `###` = h3 (subsection headers)  
- `**text**` = bold
- `*text*` = italic
- `-` or `*` = bullet lists
- `1.` = numbered lists
- Links: `[text](url)`

### 3. Build Article HTML

Run the build script:

```bash
python3 build-articles.py
```

This generates HTML files in the `articles/` directory:
- `articles/unique-slug.html` - Your article page

### 4. Update Homepage (Optional)

If your article is featured, it automatically appears on the homepage. To change which articles appear:
1. Edit `articles-data.json`
2. Set `"featured": true` to show on homepage
3. Re-run `python3 build-articles.py`
4. Rebuild homepage (or articles are auto-linked)

## Adding a Calculator

Similar to articles, calculators are stored in `articles-data.json` under the `"calculators"` array:

```json
{
  "id": "calculator-id",
  "slug": "calculator-slug",
  "title": "Calculator Name",
  "description": "What this calculator does",
  "category": "Calculation",
  "year": "2026/27",
  "status": "coming-soon"
}
```

**Statuses:**
- `coming-soon` - Shows "Coming Soon" badge
- `available` - Shows "Available" badge (for future use)

Calculators currently display on the homepage with a status indicator. To make them interactive, create calculator-specific HTML files or link to an interactive web application.

## Article File Structure

```
InspiredTax/
├── articles-data.json          # Metadata for all articles
├── article-template.html       # Template (do not edit frequently)
├── build-articles.py           # Build script (one-time setup)
├── articles/
│   ├── freelancers-provisional-tax.md
│   ├── freelancers-provisional-tax.html      (auto-generated)
│   ├── paragraph-20-threshold.md
│   ├── paragraph-20-threshold.html           (auto-generated)
│   ├── offline-first-security.md
│   └── offline-first-security.html           (auto-generated)
├── index.html                  # Homepage (links to articles)
└── PUBLISHING.md               # This file
```

## Customizing Article Appearance

### Change Category Colors

Available Tailwind colors in `article-template.html`:
- `navy` - Dark navy blue
- `navy-light` - Lighter navy
- `blue` - Primary blue
- `blue-light` - Lighter blue
- `green` - Accent green
- `accent` - Green accent color

To add new colors, edit the Tailwind config in `article-template.html` and `index.html`.

### Change Hero Section

The article header has a colored background with text. Customize:
- `heroColor`: Background color
- `heroText`: Text displayed (e.g., "Navigating Paragraph 20")

### Modify Template

To change the article layout, HTML structure, or styling:
1. Edit `article-template.html`
2. Re-run `python3 build-articles.py`
3. All articles will regenerate with new template

## Automation & CI/CD

This system is ready for automation. You can:

### GitHub Actions Example

```yaml
name: Build Articles
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run build script
        run: python3 build-articles.py
      - name: Commit changes
        run: |
          git config user.name "Article Bot"
          git config user.email "bot@example.com"
          git add articles/*.html
          git commit -m "Rebuild articles" || true
          git push
```

This automatically regenerates articles whenever you push to the repository.

## Troubleshooting

### Articles not appearing

1. Check `articles-data.json` is valid JSON (use jsonlint.com)
2. Verify markdown file exists at `articles/SLUG.md`
3. Run `python3 build-articles.py` again
4. Check `articles/SLUG.html` was created

### Template not updating

1. Edit `article-template.html`
2. Run `python3 build-articles.py`
3. Clear browser cache (hard refresh with Ctrl+Shift+R or Cmd+Shift+R)

### Styling looks wrong

1. Check Tailwind CSS is loading (view page source)
2. Verify color classes match defined colors
3. Check `categoryColor` matches available colors
4. Rebuild with `python3 build-articles.py`

## Best Practices

1. **Keep descriptions under 150 characters** for homepage cards
2. **Use clear headings** (##, ###) in markdown
3. **Test on mobile** by viewing generated HTML on phone
4. **Proofread articles** before building
5. **Use consistent date format** (YYYY-MM-DD)
6. **Name files descriptively** (e.g., `s11f-deductions.md`)
7. **Update PUBLISHING.md** if you change the system

## Next Steps

1. Create new markdown file in `articles/`
2. Add metadata to `articles-data.json`
3. Run `python3 build-articles.py`
4. Test the generated HTML file
5. Commit to git: `git add articles-data.json articles/*.md articles/*.html`
6. Push to your branch

That's it! Your article is now live on the website.
