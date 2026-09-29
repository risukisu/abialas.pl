r"""Square GIFs of the marketing-skills tile for a LinkedIn post, three variants.

    keys  the keyboard (the live tile's art): keys light as the command types
    work  what each skill hands back, drawn as a wireframe that builds itself
    type  big type: the phrase, the command typing, and an index of the five

All three share the tile's loop: five "you say -> it runs" pairs, 2.6 s each,
13 s in all, every command in its own hue. Each scene is a 540 px page drawn
with the site's fonts and rendered at 2x (1080 x 1080). The page animates in
plain CSS, so it also plays in a browser; to render, every animation is
paused and seeked to the frame's time.

The work art is imported from the marketing-skills repo
(brand/source/gen_motion.py), so its README panels and these GIFs stay the
same drawing. The pixel squirrel signature comes from there too.

Run from the repo root with the machine Python:

    & "$env:CLAUDE_SYSTEM\tools\python\python.exe" scripts\skills-gifs\make.py

Writes public/dev/skills-tile/linkedin-{keys,work,type}.gif plus a .png still
of each. Pass variant names to build only those. MARKETING_SKILLS_BRAND
overrides where gen_motion.py lives (default D:/marketing-skills/brand/source).
"""
import math
import os
import shutil
import sys
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
OUT = REPO / "public" / "dev" / "skills-tile"
BRAND = Path(os.environ.get("MARKETING_SKILLS_BRAND", "D:/marketing-skills/brand/source"))
sys.path.insert(0, str(BRAND))
sys.dont_write_bytecode = True  # leave no __pycache__ in the other repo
import gen_motion as gm  # noqa: E402  (work_art(), its CSS, the pairs)

PAIRS = gm.PAIRS
HOLD = gm.HOLD
LOOP = gm.LOOP
S = 540  # CSS px; rendered at 2x
TAGLINE = 'A curated library of <strong>marketing skills</strong> for <span class="nw">high-performing</span> AI operators'
URL = "skillcraft.cloud/marketing-skills"
FONTS = REPO / "node_modules" / "@fontsource-variable"
SQUIRREL = BRAND / "risu-favicon.png"

# Frames sit on a 50 ms grid. Each beat is 52 slots: every other slot (100 ms)
# while things hold, every slot inside the variant's busy window.
BUSY = {"keys": (7, 23), "work": (2, 34), "type": (7, 23)}
# the still: s into the first beat, the pair typed, the art done, cursor on
STILL_AT = {"keys": 1.2, "work": 2.1, "type": 2.1}


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def f(n):
    return f"{n:.1f}"


# ── art: the keyboard (geometry and timing from nexus/MarketingSkillsTile) ──
def keys_art():
    K, P = 22, 26
    rows, offs = ["qwertyuiop-", "asdfghjkl", "zxcvbnm/"], [9, 16, 29]
    at = {}
    for r, row in enumerate(rows):
        for c, ch in enumerate(row):
            at[ch] = (offs[r] + c * P, 55 + r * P, K)
    enter = (16 + 9 * P, 55 + P, 44)
    space = (90, 55 + 3 * P, 120)
    parts = []
    for ch, (x, y, w) in list(at.items()) + [("⏎", enter), ("", space)]:
        parts.append(f'<rect class="k__key" x="{x}" y="{y}" width="{w}" height="{K}"/>')
        if ch:
            parts.append(f'<text class="k__lbl" x="{f(x + w / 2)}" y="{f(y + K / 2 + 3.8)}">{esc(ch)}</text>')
    # the readout types "› " + command + cursor in steps(14) from 3% to 8% of
    # the loop; a key lights as the clip reaches its character
    hits = []
    for i, (_, run, c) in enumerate(PAIRS):
        for j, ch in enumerate(run):
            if ch in at:
                step = math.ceil(14 * ((3 + j) / (3.3 + len(run))))
                hits.append((at[ch], ch, i, c, LOOP * (0.03 + step * 0.05 / 14)))
        hits.append((enter, "⏎", i, c, LOOP * 0.088))
    trails, flashes = [], []
    for (x, y, w), ch, i, c, d in hits:
        st = f"--i:{i}; --d:{d:.3f}s; --c:{c}"
        trails.append(f'<rect class="k__trail" style="{st}" x="{x}" y="{y}" width="{w}" height="{K}"/>')
        flashes.append(
            f'<g class="k__flash" style="{st}"><rect x="{x}" y="{y}" width="{w}" height="{K}"/>'
            f'<text class="k__lbl k__on" x="{f(x + w / 2)}" y="{f(y + K / 2 + 3.8)}">{esc(ch)}</text></g>'
        )
    return "".join(parts + trails + flashes)


# ── the readout, as on the tile ─────────────────────────────────────────
def readout():
    say = "".join(f'<span class="ro__line" style="--i:{i}">{esc(s)}</span>' for i, (s, _, _) in enumerate(PAIRS))
    run = "".join(
        f'<span class="ro__line ro__line--cmd" style="--i:{i}; --c:{c}"><span class="ro__prompt">›</span> {esc(r)}'
        f'<span class="ro__cursor"></span></span>'
        for i, (_, r, c) in enumerate(PAIRS)
    )
    return (
        '<div class="ro"><span class="ro__k">you say</span>'
        f'<span class="ro__cycle">{say}</span><span class="ro__k">it runs</span>'
        f'<span class="ro__cycle">{run}</span></div>'
    )


# ── the big-type block and its index ────────────────────────────────────
def big():
    say = "".join(f'<span class="bg__say" style="--i:{i}">{esc(s)}</span>' for i, (s, _, _) in enumerate(PAIRS))
    run = "".join(
        f'<span class="bg__cmd" style="--i:{i}; --c:{c}"><span class="ro__prompt">›</span> {esc(r)}'
        f'<span class="ro__cursor"></span></span>'
        for i, (_, r, c) in enumerate(PAIRS)
    )
    rows = "".join(
        f'<li class="ix__row" style="--i:{i}; --c:{c}"><span class="ix__sq"></span>'
        f'<span class="ix__cmd">{esc(r)}</span><span class="ix__bar"><span class="ix__fill"></span></span></li>'
        for i, (_, r, c) in enumerate(PAIRS)
    )
    return (
        '<div class="bg"><span class="bg__k">you say</span>'
        f'<span class="bg__cycle">{say}</span><span class="bg__k">it runs</span>'
        f'<span class="bg__cycle">{run}</span></div>'
        f'<ol class="ix">{rows}</ol>'
    )


CSS = """
:root { --ground:#0e100d; --panel:#151813; --line:#262b23; --ink:#e9ebe3; --muted:#b4bab0;
  --dim:#5b6156; --dim-text:#7d8478; --green:#3fd68c; --blue:#7c8cf0; }
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--ground); }
.stage { position: relative; width: 540px; height: 540px; overflow: hidden; background: var(--ground);
  color: var(--muted); font-family: "Geist Variable", sans-serif; }
.grid { position: absolute; inset: 0; opacity: .5; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='27' height='27'%3E%3Crect width='1.5' height='1.5' fill='%235b6156'/%3E%3C/svg%3E"); }
.body { position: absolute; inset: 34px 36px 26px; display: flex; flex-direction: column; }
.head { display: flex; align-items: center; gap: 12px; }
.sq { width: 12px; height: 12px; background: var(--green); flex: none; }
.wm { font-weight: 800; font-size: 32px; letter-spacing: -0.025em; line-height: 1.1; color: var(--ink); }
.tag { margin: 12px 0 0; font-size: 20px; line-height: 1.42; color: var(--muted); max-width: 25em; }
.tag strong { font-weight: 700; color: var(--ink); }
.nw { white-space: nowrap; }
.foot { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 12px;
  border-top: 1px solid var(--line); font-family: "Geist Mono Variable", monospace; font-size: 13px; color: var(--dim-text); }
.sig { display: inline-flex; align-items: center; gap: 8px; }
.sig img { width: 28px; height: 28px; image-rendering: pixelated; }

/* readout (the tile's): one pair owns 20% of the loop */
.ro { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 16px; row-gap: 5px; align-items: baseline;
  margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--line);
  font-family: "Geist Mono Variable", monospace; font-size: 17px; line-height: 1.5; }
.ro__k { color: var(--dim-text); letter-spacing: 0.04em; }
.ro__cycle, .bg__cycle { display: grid; justify-items: start; min-width: 0; }
.ro__line { grid-area: 1 / 1; white-space: nowrap; color: var(--ink); opacity: 0;
  animation: say var(--loop) ease-out infinite; animation-delay: calc(var(--i) * var(--hold)); }
.ro__line--cmd, .bg__cmd { width: max-content; color: var(--c); animation-name: type; }
.ro__prompt { color: var(--blue); }
@keyframes type {
  0% { opacity: 0; clip-path: inset(0 100% 0 0); }
  3% { opacity: 1; clip-path: inset(0 100% 0 0); animation-timing-function: steps(14, end); }
  8% { clip-path: inset(0 -2px 0 0); }
  18.6% { opacity: 1; clip-path: inset(0 -2px 0 0); }
  20% { opacity: 0; clip-path: inset(0 -2px 0 0); }
  100% { opacity: 0; clip-path: inset(0 -2px 0 0); }
}
.ro__cursor { display: inline-block; width: 0.5em; height: 0.95em; margin-left: 0.3em; vertical-align: -0.12em;
  background: currentColor; animation: blink 1s steps(2, end) infinite; }

/* art panels */
.art { display: block; margin: auto 0; }
.art--keys { width: 468px; height: 175px; }
.art--work { width: 340px; height: 253px; align-self: center; }
.k__lbl { font-family: "Geist Mono Variable", monospace; }
.k__on { fill: var(--ground); font-weight: 600; }
.w__flow { animation-duration: var(--loop), 1.625s; }  /* 8 dashes per loop, so it closes */

/* big type */
.bg { display: grid; grid-template-columns: minmax(0, 1fr); margin-top: 30px; }
.bg__k { font-family: "Geist Mono Variable", monospace; font-size: 13px; letter-spacing: 0.06em; color: var(--dim-text); margin: 0 0 6px; }
.bg__cycle + .bg__k { margin-top: 18px; }
.bg__say { grid-area: 1 / 1; white-space: nowrap; font-size: 30px; font-weight: 500; letter-spacing: -0.01em;
  line-height: 1.2; color: var(--ink); opacity: 0; animation: say var(--loop) ease-out infinite;
  animation-delay: calc(var(--i) * var(--hold)); }
.bg__cmd { grid-area: 1 / 1; white-space: nowrap; font-family: "Geist Mono Variable", monospace; font-size: 34px;
  font-weight: 600; line-height: 1.25; opacity: 0; animation: type var(--loop) ease-out infinite;
  animation-delay: calc(var(--i) * var(--hold)); }
.ix { list-style: none; margin: auto 0 0; padding: 0; display: grid; gap: 9px;
  font-family: "Geist Mono Variable", monospace; font-size: 15px; }
.ix__row { display: grid; grid-template-columns: 10px auto minmax(0, 1fr); align-items: center; column-gap: 12px;
  color: #6b7266; animation: ix-ink var(--loop) linear infinite; animation-delay: calc(var(--i) * var(--hold)); }
.ix__sq { position: relative; width: 10px; height: 10px; background: #2a2f27; }
.ix__sq::after { content: ""; position: absolute; inset: 0; background: var(--c); opacity: 0;
  animation: in var(--loop) linear infinite; animation-delay: calc(var(--i) * var(--hold)); }
.ix__bar { position: relative; height: 2px; background: var(--line); }
.ix__fill { position: absolute; inset: 0; background: var(--c); transform-origin: left center; opacity: 0;
  animation: ix-fill var(--loop) linear infinite; animation-delay: calc(var(--i) * var(--hold)); }
@keyframes ix-ink { 0% { color: #e9ebe3; } 19% { color: #e9ebe3; } 20% { color: #6b7266; } 100% { color: #6b7266; } }
@keyframes ix-fill {
  0% { opacity: 1; transform: scaleX(0); }
  19% { opacity: 1; transform: scaleX(1); }
  20% { opacity: 0; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(1); }
}
"""


def page(variant):
    if variant == "keys":
        middle = readout() + f'<svg class="art art--keys" viewBox="4 50 294 110">{keys_art()}</svg>'
    elif variant == "work":
        middle = readout() + f'<svg class="art art--work" viewBox="26 12 250 186">{"".join(gm.work_art())}</svg>'
    else:
        middle = big()
    fonts = "".join(
        f'<link rel="stylesheet" href="{(FONTS / n / "index.css").as_uri()}">' for n in ("geist", "geist-mono")
    )
    return (
        f'<!doctype html><html><head><meta charset="utf-8">{fonts}<style>{gm.CSS}{CSS}</style></head><body>'
        f'<div class="stage"><div class="grid"></div><div class="body">'
        f'<div class="head"><span class="sq"></span><span class="wm">marketing-skills</span></div>'
        f'<p class="tag">{TAGLINE}</p>{middle}'
        f'<div class="foot"><span>{URL}</span><span class="sig">risu<img src="{SQUIRREL.as_uri()}" alt=""></span></div>'
        f"</div></div>"
        # seek every animation to t seconds into a steady-state loop
        f"<script>window.seek = (t) => {{ for (const a of document.getAnimations()) {{ a.pause(); "
        f"a.currentTime = ({LOOP} + t) * 1000; }} }};</script></body></html>"
    )


def times(variant):
    lo, hi = BUSY[variant]
    slots = [i * 52 + j for i in range(len(PAIRS)) for j in range(52) if j % 2 == 0 or lo <= j <= hi]
    return [s * 0.05 for s in slots], [((b if b > a else b + 260) - a) * 50 for a, b in zip(slots, slots[1:] + slots[:1])]


def render(variant, tmp):
    from playwright.sync_api import sync_playwright

    html = tmp / f"{variant}.html"
    html.write_text(page(variant), encoding="utf-8")
    ts, durs = times(variant)
    paths = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": S, "height": S}, device_scale_factor=2)
        pg.goto(html.as_uri())
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(300)
        for k, t in enumerate(ts):
            pg.evaluate(f"seek({t:.3f})")
            path = tmp / f"{variant}-{k:03d}.png"
            pg.screenshot(path=str(path))
            paths.append(path)
        pg.evaluate(f"seek({STILL_AT[variant]})")
        still = tmp / f"{variant}-still.png"
        pg.screenshot(path=str(still))
        b.close()
    return paths, durs, still


def encode(variant, paths, durs, still):
    # one palette for the whole loop, taken from a frame every half second,
    # so every command's hue is in it; no dither (flat art)
    sample = paths[:: max(1, len(paths) // 26)]
    first = Image.open(sample[0])
    w, h = first.size
    strip = Image.new("RGB", (w, h * len(sample)))
    for k, sp in enumerate(sample):
        strip.paste(Image.open(sp).convert("RGB"), (0, k * h))
    pal = strip.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    frames = [Image.open(sp).convert("RGB").quantize(palette=pal, dither=Image.Dither.NONE) for sp in paths]
    gif = OUT / f"linkedin-{variant}.gif"
    frames[0].save(gif, save_all=True, append_images=frames[1:], duration=durs, loop=0, optimize=False)
    shutil.copyfile(still, OUT / f"linkedin-{variant}.png")
    with Image.open(gif) as g:
        n = g.n_frames
    print(f"{gif.name}: {gif.stat().st_size / 1e6:.2f} MB, {n} frames, {sum(durs) / 1000:.1f} s loop, {w}x{h}")


def main():
    variants = sys.argv[1:] or ["keys", "work", "type"]
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="skills-gifs-"))
    for v in variants:
        encode(v, *render(v, tmp))
    print("frames kept in", tmp)


if __name__ == "__main__":
    main()
