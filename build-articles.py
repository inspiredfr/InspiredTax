#!/usr/bin/env python3
"""
Build articles from the articles/ folder.
Supports .txt and .md files with simple KEY: Value headers.
Auto-updates articles-data.json and generates HTML pages.
"""

import json
import re
from datetime import datetime
from pathlib import Path


def format_date(date_str):
    try:
        return datetime.fromisoformat(date_str).strftime("%B %d, %Y")
    except (ValueError, TypeError):
        return datetime.now().strftime("%B %d, %Y")


def parse_file(filepath):
    """Read article file. Extracts KEY: Value headers from the top, rest is content."""
    text = Path(filepath).read_text(encoding='utf-8')
    meta = {}
    content_lines = []
    in_header = True

    for line in text.splitlines():
        if in_header and re.match(r'^[A-Z_]+\s*:', line):
            key, _, value = line.partition(':')
            meta[key.strip().upper()] = value.strip()
        else:
            in_header = False
            content_lines.append(line)

    return meta, '\n'.join(content_lines).strip()


def to_html(text):
    """Convert simple text/markdown to HTML paragraphs and headings."""
    lines = text.split('\n')
    out = []
    in_ul = False
    in_ol = False

    def close_lists():
        nonlocal in_ul, in_ol
        if in_ul:
            out.append('</ul>')
            in_ul = False
        if in_ol:
            out.append('</ol>')
            in_ol = False

    def inline(s):
        s = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', s)
        s = re.sub(r'\*(.*?)\*', r'<em>\1</em>', s)
        return s

    for line in lines:
        if line.startswith('### '):
            close_lists()
            out.append(f'<h3>{inline(line[4:])}</h3>')
        elif line.startswith('## '):
            close_lists()
            out.append(f'<h2>{inline(line[3:])}</h2>')
        elif re.match(r'^[-*] ', line):
            if in_ol:
                out.append('</ol>')
                in_ol = False
            if not in_ul:
                out.append('<ul>')
                in_ul = True
            out.append(f'<li>{inline(line[2:])}</li>')
        elif re.match(r'^\d+\. ', line):
            if in_ul:
                out.append('</ul>')
                in_ul = False
            if not in_ol:
                out.append('<ol>')
                in_ol = True
            item = re.sub(r'^\d+\. ', '', line)
            out.append(f'<li>{inline(item)}</li>')
        elif line.strip() == '':
            close_lists()
        else:
            close_lists()
            out.append(f'<p>{inline(line)}</p>')

    close_lists()
    return '\n'.join(out)


def build_articles():
    with open('article-template.html') as f:
        template = f.read()

    with open('articles-data.json') as f:
        data = json.load(f)

    articles_dir = Path('articles')
    existing_ids = {a['id'] for a in data['articles']}
    new_articles_added = False

    # Find all .md and .txt content files
    content_files = sorted(
        [f for f in articles_dir.glob('*.md')] +
        [f for f in articles_dir.glob('*.txt')]
    )

    built = 0
    for filepath in content_files:
        slug = filepath.stem
        meta, raw_content = parse_file(filepath)

        title      = meta.get('TITLE',       slug.replace('-', ' ').title())
        description= meta.get('DESCRIPTION', '')
        category   = meta.get('CATEGORY',    'Tax Insights')
        date_iso   = meta.get('DATE',        datetime.now().strftime('%Y-%m-%d'))
        read_time  = meta.get('READ_TIME',   '5 min read')
        author     = meta.get('AUTHOR',      'Allan Lombard')
        hero_text  = meta.get('HERO_TEXT',   category)
        cat_color  = meta.get('COLOR',       'blue')

        # Auto-register new articles in articles-data.json
        if slug not in existing_ids:
            data['articles'].insert(0, {
                'id':            slug,
                'slug':          slug,
                'title':         title,
                'description':   description,
                'category':      category,
                'categoryColor': cat_color,
                'author':        author,
                'date':          date_iso,
                'featured':      True,
                'readTime':      read_time,
                'heroColor':     'navy-light',
                'heroText':      hero_text,
            })
            existing_ids.add(slug)
            new_articles_added = True
            print(f'  + Registered new article: {slug}')

        # Get category colour from data (may have been manually set)
        entry = next((a for a in data['articles'] if a['id'] == slug), {})
        category_color = entry.get('categoryColor', cat_color)

        content = to_html(raw_content)

        html = template
        for placeholder, value in {
            '{{TITLE}}':            title,
            '{{DESCRIPTION}}':      description,
            '{{CATEGORY}}':         category,
            '{{CATEGORY_COLOR}}':   category_color,
            '{{AUTHOR}}':           author,
            '{{DATE_ISO}}':         date_iso,
            '{{DATE_FORMATTED}}':   format_date(date_iso),
            '{{READ_TIME}}':        read_time,
            '{{CONTENT}}':          content,
            '{{SLUG}}':             slug,
        }.items():
            html = html.replace(placeholder, value)

        out_path = articles_dir / f'{slug}.html'
        out_path.write_text(html)
        built += 1
        print(f'✓ Built: {slug}.html')

    if new_articles_added:
        with open('articles-data.json', 'w') as f:
            json.dump(data, f, indent=2)
        print('  ✓ Updated articles-data.json')

    print(f'\nDone. {built} article(s) built.')


if __name__ == '__main__':
    build_articles()
