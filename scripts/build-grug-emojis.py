r"""Build /grug/ — the Grug Brained Marketer emoji page, emojis only.

    & "$env:CLAUDE_SYSTEM\tools\python\python.exe" scripts\build-grug-emojis.py

Reads the emoji kit in the sibling grug-brained-marketer repo (override the
path with GRUG_KIT) and writes public/grug/index.html: the kit's own page
(shell, template, runtime, script) minus the brand kit — no logos, colors,
type, or usage-rules sections, no brand-kit download. The sticker lid, the
emoji cards, the Slack preview, and the upload steps stay as the kit ships
them. Assets are embedded, same as the kit page; the coffee badge stays
only as the Slack-preview avatar.

Every cut is an exact, single match, so a kit change that moves one of
them stops this script instead of shipping a half-cut page. Re-run after
each kit release (the version comes from the kit's VERSION file).
"""
import base64
import io
import json
import os
import re
import zipfile

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
KIT = os.environ.get("GRUG_KIT") or os.path.normpath(
    os.path.join(ROOT, "..", "grug-brained-marketer", "brand", "kit")
)
PAGE = os.path.join(KIT, "src", "page")
OUT = os.path.join(ROOT, "public", "grug", "index.html")


def read(*parts):
    return io.open(os.path.join(*parts), encoding="utf8").read()


def one(text, old, new):
    if text.count(old) != 1:
        raise SystemExit(f"expected one {old[:70]!r}, found {text.count(old)}")
    return text.replace(old, new)


def cut(text, start, end):
    """Drop text[start:end) where both markers occur exactly once; keep `end`."""
    for m in (start, end):
        if text.count(m) != 1:
            raise SystemExit(f"expected one {m[:70]!r}, found {text.count(m)}")
    a, b = text.index(start), text.index(end)
    if a >= b:
        raise SystemExit(f"{start[:40]!r} is not before {end[:40]!r}")
    return text[:a] + text[b:]


def fbytes(*parts):
    with open(os.path.join(KIT, *parts), "rb") as fh:
        return fh.read()


def main():
    version = read(KIT, "VERSION").strip()
    spec = json.loads(read(KIT, "kit-spec.json"))
    if spec["version"] != version:
        raise SystemExit(f"kit-spec.json is {spec['version']}, VERSION is {version}: rebuild the kit first")

    # The emoji pack's README, exactly as the kit's own pack ships it.
    with zipfile.ZipFile(os.path.join(KIT, "packs", "grug-slack-emojis-128px.zip")) as z:
        readme = z.read("README.md").decode("utf8")

    # Template: header names this page; the brand kit sections and buttons go.
    template = read(PAGE, "kit.html").replace("{{VERSION}}", version)
    template = one(template, "<span>/ the kit</span>", "<span>/ grug emojis</span>")
    template = one(template, '<button class="btn" data-pack="brand">Brand kit <span aria-hidden="true">↓</span></button>', "")
    template = cut(template, '<section class="wrap" aria-labelledby="v3-brand">', '<section class="wrap" aria-labelledby="v3-slack">')
    if 'data-pack="brand"' in template:
        raise SystemExit("a brand-kit button survived the cut")

    # Script: no lockup, no brand pack, no logo/color rendering.
    kit_js = read(PAGE, "kit.js")
    kit_js = one(kit_js, "  $('v3-lock').src = Kit.url('logo-badge');\n", "")
    kit_js = cut(kit_js, "    brand: () => zipUp([", "    stickers: async () => {")
    kit_js = cut(kit_js, "  /* brand */\n", "  Promise.all(E.map((e) => dieCut(e.name)))")
    for gone in ("KIT.logos", "KIT.colors", "T.tokens", "T.license"):
        if gone in kit_js:
            raise SystemExit(f"{gone} survived the cut")
    script = read(PAGE, "runtime.js") + "\n" + kit_js
    if "</script" in template + script:
        raise SystemExit("page sources must not contain a closing script tag")

    names = [e["name"] for e in spec["emojis"]]
    assets = {}
    for n in names:
        for size, fname in (("128", n + ".png"), ("512", n + "-512px.png")):
            assets[f"{n}-{size}"] = {
                "data": base64.b64encode(fbytes("emoji", size, n + ".png")).decode("ascii"),
                "mime": "image/png",
                "filename": fname,
            }
    assets["logo-badge"] = {  # the Slack-preview avatar only
        "data": base64.b64encode(fbytes("logos", "grug-logo-badge.png")).decode("ascii"),
        "mime": "image/png",
        "filename": "grug-logo-badge.png",
    }
    data = {"assets": assets, "version": version, "emojis": spec["emojis"]}
    texts = {"readme": readme}

    license_note = re.search(
        r"<!-- SerenityOS squirrel source notice.*?-->", read(KIT, "src", "kit-01-original.html"), re.S
    ).group(0)

    page = read(PAGE, "shell.html")
    page = one(
        page,
        '<meta name="description" content="The Grug Brained Marketer emoji kit v{{VERSION}}: six custom Slack emojis, logos, colors and a small guide to keeping things grug.">',
        '<meta name="description" content="Six custom Slack emojis from the Grug Brained Marketer, plus die-cut stickers and a laptop lid to stick them on.">\n'
        '<link rel="canonical" href="https://abialas.pl/grug/">\n'
        '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
    )
    page = one(page, "<title>Grug Brained Marketer / The Kit</title>", "<title>Grug Brained Marketer / Slack emojis</title>")
    page = one(
        page,
        "<!-- GENERATED by src/build.py, kit v{{VERSION}}. Edit the sources in src/, then rebuild. -->",
        "<!-- GENERATED by abialas.pl scripts/build-grug-emojis.py from the Grug Brained Marketer emoji kit v{{VERSION}}"
        " (brand kit removed). Rebuild from the kit, never edit by hand. -->",
    )
    for key, value in {
        "{{TEMPLATE}}": template,
        "{{KIT_DATA}}": '<script id="kit-data" type="application/json">' + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "</script>",
        "{{KIT_TEXTS}}": '<script id="kit-texts" type="application/json">' + json.dumps(texts, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>",
        "{{SCRIPT}}": script,
        "{{LICENSE}}": license_note,
    }.items():
        page = one(page, key, value)
    page = page.replace("{{VERSION}}", version)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    io.open(OUT, "w", encoding="utf8", newline="\n").write(page)
    print(f"grug emojis v{version}: {OUT} ({os.path.getsize(OUT) / 1e6:.2f} MB)")


if __name__ == "__main__":
    main()
