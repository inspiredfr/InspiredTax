#!/usr/bin/env python3
"""
Build articles from articles-data.json and article content files.
Generates HTML files using article-template.html as the base.
"""

import json
import os
from datetime import datetime
from pathlib import Path


def format_date(date_str):
    """Format ISO date to readable format."""
    try:
        dt = datetime.fromisoformat(date_str)
        return dt.strftime("%B %d, %Y")
    except ValueError:
        return date_str


def read_article_content(article_id):
    """Read article content from a markdown or text file."""
    content_file = Path(f"articles/{article_id}.md")
    if content_file.exists():
        return content_file.read_text()

    # Fallback: try to extract from existing HTML
    html_file = Path(f"articles/{article_id}.html")
    if html_file.exists():
        content = html_file.read_text()
        # Extract just the article content (between <article> tags)
        start = content.find("<article>")
        end = content.find("</article>")
        if start != -1 and end != -1:
            raw = content[start + 9 : end].strip()
            # Remove h1 (it becomes the page title)
            raw = raw.replace("<h1>", "").replace("</h1>", "", 1)
            return raw

    return "<p>Content not found. Please add content to articles/{}.md</p>".format(
        article_id
    )


def build_articles():
    """Build all articles from data."""
    # Read articles data
    with open("articles-data.json") as f:
        data = json.load(f)

    # Read template
    with open("article-template.html") as f:
        template = f.read()

    articles_dir = Path("articles")
    articles_dir.mkdir(exist_ok=True)

    # Build each article
    for article in data["articles"]:
        article_id = article["id"]
        slug = article["slug"]

        # Read content
        content = read_article_content(article_id)

        # Format date
        date_iso = article["date"]
        date_formatted = format_date(date_iso)

        # Build category color class
        category_color = article.get("categoryColor", "blue")

        # Prepare substitutions
        substitutions = {
            "{{TITLE}}": article["title"],
            "{{DESCRIPTION}}": article["description"],
            "{{CATEGORY}}": article["category"],
            "{{CATEGORY_COLOR}}": category_color,
            "{{AUTHOR}}": article["author"],
            "{{DATE_ISO}}": date_iso,
            "{{DATE_FORMATTED}}": date_formatted,
            "{{READ_TIME}}": article["readTime"],
            "{{CONTENT}}": content,
        }

        # Apply substitutions
        html = template
        for placeholder, value in substitutions.items():
            html = html.replace(placeholder, value)

        # Write article file
        output_file = articles_dir / f"{slug}.html"
        output_file.write_text(html)
        print(f"✓ Built: {slug}.html")

    print(f"\nSuccessfully built {len(data['articles'])} articles!")


if __name__ == "__main__":
    build_articles()
