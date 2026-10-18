// Old Legends: Grim Awakening — hub site script. Plain ES module, no build step.
// Both pages load it; each part runs only when its markup is on the page.

/** Where the playtest build lives. Empty = builds are shared by hand. */
export const PLAY_URL = "../";

const RELEASES_URL = "data/releases.json";
const SHOTS_URL = "assets/shots/shots.json";
const SHOTS_DIR = "assets/shots/";

/**
 * The Unreleased entry's first New lines become its highlight cards: the
 * patch notes list the newest day first and what matters first within it, so
 * their order is the pick. Five fill the card grid exactly (one wide, one
 * tall, a row of three); fewer still lay out.
 */
const HIGHLIGHT_COUNT = 5;
const TEASER_COUNT = 4;

/** The five headings of the trade, in the order a Version shows them (tools/build-site-releases.mjs, KINDS). */
const KIND_ORDER = ["New", "Changes", "Balance", "Bug Fixes", "Known Issues"];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- helpers ---------------------------------------------------------------

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getJSON(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

/**
 * A bullet's lead is its first sentence. When a short phrase ends in a colon
 * before that ("Kills drop things: ..."), the phrase is the lead.
 */
export function splitLead(text) {
  const sentence = text.match(/^(.+?[.!?])\s+(?=[A-Z0-9"“‘'])/);
  const end = sentence ? sentence[1].length : text.length;
  const colon = text.indexOf(": ");
  if (colon > 0 && colon < end && colon <= 60) {
    return { lead: text.slice(0, colon + 1), body: text.slice(colon + 2) };
  }
  if (sentence) return { lead: sentence[1], body: text.slice(sentence[0].length) };
  return { lead: text, body: "" };
}

function line(text) {
  const { lead, body } = splitLead(text);
  // A long line that is one sentence has no lead to pull out; bolding all of it shouts.
  if (!body && lead.length > 70) return esc(lead);
  return `<b>${esc(lead)}</b>${body ? ` ${esc(body)}` : ""}`;
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

const releaseId = (r) => (r.unreleased ? "unreleased" : `v${r.version}`);
/** "Bug Fixes" → "bug-fixes": the heading as an id and a class name. */
const kindSlug = (kind) => kind.toLowerCase().replace(/\s+/g, "-");
const kindClass = (kind) => `k-${kindSlug(kind)}`;

function sortedSections(release) {
  return [...release.sections]
    .filter((s) => s.items.length)
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}

/** Splits the Unreleased lines into the highlights (the first New lines, in order) and the rest; a known issue is never one. */
function pickHighlights(release) {
  const all = release.sections.flatMap((s) => s.items.map((text) => ({ kind: s.kind, text })));
  const fresh = all.filter((it) => it.kind === "New");
  const rest = all.filter((it) => it.kind !== "Known Issues");
  const picked = (fresh.length ? fresh : rest).slice(0, HIGHLIGHT_COUNT);
  return { picked, isPicked: (text) => picked.some((p) => p.text === text) };
}

const lineCount = (release) => release.sections.reduce((n, s) => n + s.items.length, 0);

// --- shared: version strings, play button, fade-up --------------------------

function renderPlay() {
  const slot = $("[data-play]");
  if (!slot) return;
  if (PLAY_URL) {
    slot.outerHTML = `<a class="btn" href="${esc(PLAY_URL)}" rel="noopener"><span class="arrow" aria-hidden="true"></span>Play the playtest build</a>`;
  } else {
    slot.outerHTML = `<p class="quiet-play"><span class="candle-mini" aria-hidden="true"></span><span>Playtest builds are shared by hand for now — ask risu.</span></p>`;
  }
}

function setVersion(data) {
  const current = data.current;
  if (!current) return;
  for (const el of $$("[data-version]")) el.textContent = `v${current}`;
  const cut = data.releases.find((r) => r.version === current)?.date;
  if (cut) for (const el of $$("[data-version-date]")) el.textContent = cut;
}

function initFadeUp() {
  const items = $$(".fade-up");
  if (!("IntersectionObserver" in window) || reducedMotion) {
    for (const el of items) el.classList.add("in");
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  for (const el of items) io.observe(el);
}

// --- hub: the descent ------------------------------------------------------

function initDescent() {
  const shaft = $(".shaft");
  if (!shaft) return;
  const lantern = $(".lantern", shaft);
  const halo = $(".lantern-halo", shaft);
  const strata = $$(".stratum", shaft);
  let queued = false;

  const update = () => {
    queued = false;
    const rect = shaft.getBoundingClientRect();
    const focus = window.innerHeight * 0.55;
    const y = Math.max(40, Math.min(rect.height - 20, focus - rect.top));
    lantern.style.top = `${y}px`;
    halo.style.top = `${y}px`;
    for (const s of strata) {
      const node = $(".node", s);
      const top = node.getBoundingClientRect().top - rect.top + 36;
      s.classList.toggle("lit", top <= y + 8);
    }
  };
  const onScroll = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

// --- hub: screenshots gallery ---------------------------------------------

/** "full" (whole page), "stage" (tight canvas crop) or "panel" (a dialog), from the file name. */
const shotKind = (s) =>
  /-full\.png$/i.test(s.file) ? "full" : /-stage\.png$/i.test(s.file) ? "stage" : "panel";

async function initGallery() {
  const section = $("#screenshots");
  const grid = $("#gallery");
  if (!section || !grid) return;
  let shots;
  try {
    shots = await getJSON(SHOTS_URL);
  } catch {
    shots = [];
  }
  if (!Array.isArray(shots) || !shots.length) {
    section.hidden = true;
    for (const a of $$('a[href="#screenshots"]')) a.hidden = true;
    return;
  }
  // One whole-page shot leads (the first in shots.json, which lists the newest first),
  // then the tight crops, minus the hero shot and the lead's own state.
  const heroFile = section.dataset.heroFile || "";
  const isFull = (s) => /-full\.png$/i.test(s.file);
  const lead = shots.find(isFull);
  const crops = shots.filter((s) => !isFull(s) && s.file !== heroFile && s.state !== lead?.state);
  let list = lead && crops.length >= 2 ? [lead, ...crops] : shots.filter((s) => s.file !== heroFile);
  if (!list.length) list = shots;

  grid.innerHTML = list
    .map(
      (s, i) => `
      <button class="g fade-up ${shotKind(s)}" type="button" data-i="${i}" aria-label="Open screenshot: ${esc(s.caption || s.state || s.file)}">
        <span class="shot-frame"><img src="${SHOTS_DIR}${esc(s.file)}" alt="${esc(s.caption || s.state || "")}" width="${s.width || ""}" height="${s.height || ""}" loading="lazy" decoding="async"></span>
        ${s.caption ? `<span class="cap">${esc(s.caption)}</span>` : ""}
      </button>`
    )
    .join("");

  const dialog = $("#lightbox");
  let at = 0;
  // The tile is the crop; the lightbox opens the whole capture of the same state when there is one.
  const fullOf = (s) => (isFull(s) ? s : shots.find((o) => isFull(o) && o.state === s.state)) || s;
  const render = (s) => {
    $("img", dialog).src = SHOTS_DIR + s.file;
    $("img", dialog).alt = s.caption || s.state || "";
    $("p", dialog).textContent = s.caption || "";
  };
  const show = (i) => {
    at = (i + list.length) % list.length;
    render(fullOf(list[at]));
  };
  // The hero's shot is not a tile, but its whole capture opens the same lightbox.
  const heroShot = shots.find((s) => s.file === heroFile);
  const heroOpen = $("[data-hero-open]");
  if (heroShot && heroOpen && dialog?.showModal) {
    heroOpen.addEventListener("click", () => {
      render(fullOf(heroShot));
      dialog.showModal();
    });
  }
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".g");
    if (!btn || !dialog?.showModal) return;
    show(Number(btn.dataset.i));
    dialog.showModal();
  });
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    if (e.target.closest("[data-next]")) show(at + 1);
  });
  dialog?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(at + 1);
    if (e.key === "ArrowLeft") show(at - 1);
  });
  initFadeUp();
}

// --- hub: latest teaser ----------------------------------------------------

/**
 * The newest lines a friend has not seen: what is on main beyond the last
 * Version, or — right after a cut, when nothing is yet — that Version's own
 * lines, so the box never opens on "nothing new" the day there is most to show.
 */
function renderTeaser(data) {
  const box = $("#latest-lines");
  if (!box) return;
  const next = data.releases.find((r) => r.unreleased);
  const prev = data.releases.find((r) => !r.unreleased);
  const onMain = Boolean(next && lineCount(next));
  const fresh = onMain ? next : prev;
  if (!fresh || !lineCount(fresh)) {
    box.innerHTML = `<li><p>Nothing new on main since ${prev ? `v${esc(prev.version)}` : "the last Version"} yet.</p></li>`;
    return;
  }
  const { picked } = pickHighlights(fresh);
  const total = lineCount(fresh);
  const shown = picked.slice(0, TEASER_COUNT);
  const rest = total - shown.length;
  const href = `releases.html#${releaseId(fresh)}`;
  // The side's button opens the same block as the box's own link, not an empty Unreleased.
  $("#latest-all")?.setAttribute("href", href);
  const where = onMain ? (prev ? ` since v${esc(prev.version)}` : "") : ` in v${esc(fresh.version)}`;
  box.innerHTML =
    shown.map((it) => `<li><p>${line(it.text)}</p></li>`).join("") +
    (rest
      ? `<a class="more" href="${href}">+ ${rest} more line${rest === 1 ? "" : "s"}${where}</a>`
      : `<a class="more" href="${href}">All patch notes</a>`);
  const since = $("#latest-since");
  if (since && prev)
    since.textContent = `${onMain ? "Since" : "In"} v${prev.version}, cut ${formatDate(prev.date)}.`;
}

// --- releases page ---------------------------------------------------------

/**
 * One kind's list. `id` is the block's own id (the tally links to it);
 * inside a day group the kind heading steps down to an h4 under the day's h3.
 */
function renderKind(section, { id, skip, heading = "h3" }) {
  const items = skip ? section.items.filter((t) => !skip(t)) : section.items;
  const pulled = section.items.length - items.length;
  if (!items.length) return "";
  return `
    <div class="kind ${kindClass(section.kind)}" id="${id}">
      <div class="kind-head">
        <${heading}>${esc(section.kind)}</${heading}><span class="count">${items.length}</span>
        ${pulled ? `<span class="note">and ${pulled} in the highlights above</span>` : ""}
      </div>
      <ul class="lines">${items.map((t) => `<li><p>${line(t)}</p></li>`).join("")}</ul>
    </div>`;
}

function renderTally(release, idPrefix) {
  return `<div class="tally">${sortedSections(release)
    .map(
      (s) =>
        `<a class="${kindClass(s.kind)}" href="#${idPrefix}-${kindSlug(s.kind)}"><b>${s.items.length}</b>${esc(s.kind)}</a>`
    )
    .join("")}</div>`;
}

/**
 * The Unreleased lines by the day they merged, newest day first, each day's
 * kinds in the Version's order. The tally's link for a kind lands on its
 * first day; a later day's block of the same kind carries the day in its id.
 */
function renderBuilds(release, idPrefix, skip) {
  const seen = new Set();
  return release.builds
    .map((b) => {
      const kinds = sortedSections(b)
        .map((s) => {
          const slug = kindSlug(s.kind);
          const id = seen.has(slug) ? `${idPrefix}-${b.date}-${slug}` : `${idPrefix}-${slug}`;
          const html = renderKind(s, { id, skip, heading: "h4" });
          if (html) seen.add(slug);
          return html;
        })
        .join("");
      if (!kinds) return "";
      return `
    <section class="build" aria-labelledby="${idPrefix}-${b.date}-h">
      <h3 class="build-date" id="${idPrefix}-${b.date}-h"><span class="candle-mini" aria-hidden="true"></span><time datetime="${esc(b.date)}">${formatDate(b.date)}</time></h3>${kinds}
    </section>`;
    })
    .join("");
}

function renderUnreleased(r, prev) {
  const id = releaseId(r);
  const head = `
    <span class="onmain"><span class="candle-mini" aria-hidden="true"></span>On main now · next Version</span>
    <h2 id="${id}-h">Unreleased</h2>
    ${prev ? `<span class="since">since <b>v${esc(prev.version)}</b> (${esc(prev.date)})</span>` : ""}`;
  // Right after a Version is cut the entry is empty; say so instead of drawing an empty grid.
  if (!lineCount(r)) {
    return `
  <section class="release unreleased fade-up" id="${id}" aria-labelledby="${id}-h">${head}
    <p class="rel-summary">Nothing on main beyond ${prev ? `v${esc(prev.version)}` : "the last Version"} yet.</p>
  </section>`;
  }
  const { picked, isPicked } = pickHighlights(r);
  return `
  <section class="release unreleased fade-up" id="${id}" aria-labelledby="${id}-h">${head}
    ${r.summary ? `<p class="rel-summary">${esc(r.summary)}</p>` : ""}
    ${renderTally(r, id)}
    <div class="highlights">
      ${picked
        .map((it, i) => {
          const { lead, body } = splitLead(it.text);
          // As a card heading, a lead that ends in a colon loses it and the body starts a sentence.
          const colon = lead.endsWith(":");
          const head = colon ? lead.slice(0, -1) : lead;
          const text = colon && body ? body[0].toUpperCase() + body.slice(1) : body;
          return `<article class="hl"><span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(head)}</h3>${text ? `<p>${esc(text)}</p>` : ""}</article>`;
        })
        .join("")}
    </div>
    ${
      r.builds?.length
        ? renderBuilds(r, id, isPicked)
        : sortedSections(r)
            .map((s) => renderKind(s, { id: `${id}-${kindSlug(s.kind)}`, skip: isPicked }))
            .join("")
    }
  </section>`;
}

function renderReleased(r, current) {
  const id = releaseId(r);
  return `
  <section class="release fade-up" id="${id}" aria-labelledby="${id}-h">
    <span class="vlabel">${r.version === current ? "Current Version" : "Version"}</span>
    <div class="rel-head">
      <h2 class="vtitle" id="${id}-h">v${esc(r.version)}</h2>
      ${r.date ? `<time datetime="${esc(r.date)}">${formatDate(r.date)}</time>` : ""}
    </div>
    ${r.summary ? `<p class="rel-summary">${esc(r.summary)}</p>` : ""}
    ${renderTally(r, id)}
    ${sortedSections(r)
      .map((s) => renderKind(s, { id: `${id}-${kindSlug(s.kind)}` }))
      .join("")}
  </section>`;
}

function renderReleases(data) {
  const root = $("#releases");
  const nav = $("#vnav-list");
  if (!root) return;
  const prev = data.releases.find((r) => !r.unreleased);
  root.innerHTML = data.releases
    .map((r) => (r.unreleased ? renderUnreleased(r, prev) : renderReleased(r, data.current)))
    .join("");
  if (nav) {
    nav.innerHTML = data.releases
      .map(
        (r) =>
          `<li><a href="#${releaseId(r)}"><span class="v">${r.unreleased ? "Unreleased" : `v${esc(r.version)}`}</span><span class="d">${r.unreleased ? "on main now" : formatDate(r.date)}</span></a></li>`
      )
      .join("");
    const links = $$("a", nav);
    const setActive = (id) => {
      for (const a of links) a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
    };
    // The active Version is the last one whose top has passed a line a third of the way down.
    const sections = $$(".release", root);
    let queued = false;
    const update = () => {
      queued = false;
      const line = window.innerHeight * 0.35;
      let current = sections[0];
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
      if (current) setActive(current.id);
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }
  initFadeUp();
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      target.classList.add("in");
      requestAnimationFrame(() => target.scrollIntoView());
    }
  }
}

// --- boot ------------------------------------------------------------------

async function boot() {
  renderPlay();
  initFadeUp();
  initDescent();
  initGallery();

  const needsReleases = $("#releases") || $("#latest-lines");
  if (!needsReleases) return;
  try {
    const data = await getJSON(RELEASES_URL);
    setVersion(data);
    renderReleases(data);
    renderTeaser(data);
  } catch (err) {
    const msg = `<p class="failed"><b>The release notes did not load.</b> ${esc(err.message)}</p>`;
    if ($("#releases")) $("#releases").innerHTML = msg;
    if ($("#latest-lines"))
      $("#latest-lines").innerHTML =
        `<li><p>The latest changes did not load. <a href="releases.html">Open the releases page.</a></p></li>`;
  }
}

boot();
