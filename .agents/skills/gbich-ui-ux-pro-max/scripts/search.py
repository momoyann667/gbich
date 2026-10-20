#!/usr/bin/env python3
"""GBICH'APP — Design System & Motion Intelligence Search Engine.

Allows querying design tokens, components, colors, and motion presets locally.
Usage:
    python search.py "primary color"
    python search.py "button variants"
    python search.py "framer 3d flip"
    python search.py "gsap shockwave"
"""

import sys
import json
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
REFERENCES_DIR = BASE_DIR / "references"


def load_tokens():
    tokens_path = REFERENCES_DIR / "design-tokens.json"
    if tokens_path.exists():
        with open(tokens_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def search_references(query: str):
    query_lower = query.lower().strip()
    results = []

    # 1. Search in JSON tokens
    tokens = load_tokens()
    if query_lower in ["color", "colors", "couleur", "primary", "secondary", "tertiary", "neutral"]:
        results.append(("🎨 Design Tokens — Couleurs", json.dumps(tokens.get("colors", {}), indent=2)))
    elif query_lower in ["font", "fonts", "typography", "typo", "police", "anton", "inter", "space"]:
        results.append(("✍️ Design Tokens — Typographie", json.dumps(tokens.get("typography", {}), indent=2)))
    elif query_lower in ["anim", "animation", "motion", "easing"]:
        results.append(("⚡ Design Tokens — Animation & Easing", json.dumps(tokens.get("animation", {}), indent=2)))

    # 2. Search in Markdown reference files
    for md_file in REFERENCES_DIR.glob("*.md"):
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
                lines = content.splitlines()
                matching_sections = []
                current_section = []
                capturing = False

                for line in lines:
                    if line.startswith("#"):
                        if capturing and current_section:
                            matching_sections.append("\n".join(current_section))
                            current_section = []
                            capturing = False
                        if any(q in line.lower() for q in query_lower.split()):
                            capturing = True
                            current_section.append(line)
                    elif capturing:
                        current_section.append(line)

                if capturing and current_section:
                    matching_sections.append("\n".join(current_section[:40]))

                if matching_sections:
                    results.append((f"📄 {md_file.name}", "\n\n---\n\n".join(matching_sections[:2])))
                elif query_lower in content.lower():
                    # Fallback snippet
                    idx = content.lower().find(query_lower)
                    snippet = content[max(0, idx - 100):min(len(content), idx + 300)]
                    results.append((f"📄 {md_file.name} (Extrait)", f"...{snippet}..."))
        except Exception as e:
            continue

    return results


def main():
    if len(sys.argv) < 2:
        print("Usage: python search.py <recherche>")
        print("Exemples: 'colors', 'buttons', 'flip card', 'gsap', 'typography'")
        sys.exit(0)

    query = " ".join(sys.argv[1:])
    print(f"\n🔍 Recherche dans le Design System GBICH'APP pour : '{query}'\n" + "=" * 60)

    results = search_references(query)
    if not results:
        print("Aucun résultat direct trouvé. Essayez 'colors', 'components', 'framer', 'gsap'.")
        return

    for title, snippet in results:
        print(f"\n### {title}\n")
        print(snippet[:1200] + ("\n... [tronqué]" if len(snippet) > 1200 else ""))
        print("\n" + "-" * 60)


if __name__ == "__main__":
    main()
