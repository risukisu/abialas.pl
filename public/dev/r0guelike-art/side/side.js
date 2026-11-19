/* 035's section: three concepts for the space round the game view. Each is one still; the page
   shows it at the largest whole-number scale that fits and names whatever a pointer rests on
   (or the arrow keys reach), from the concept's data.json. No dependencies. */

(() => {
  const root = document.querySelector("[data-side-concepts]");
  if (!root) return;
  const base = root.dataset.base || "side/";
  const tabs = [...root.querySelectorAll(".sp-tab")];
  const stage = root.querySelector(".sp-stage");
  const box = root.querySelector(".sp-box");
  const still = root.querySelector(".sp-still");
  const mark = root.querySelector(".sp-mark");
  const readout = root.querySelector(".sp-readout");
  const nameEl = root.querySelector(".sp-name");
  const aboutEl = root.querySelector(".sp-about");
  const fullBtn = root.querySelector(".sp-full");
  const HINT = "Point at anything on the screen, or use the arrow keys, to see what it is.";

  let data = null;
  let current = -1;
  let scale = 1;
  const cache = new Map();

  function load(id) {
    if (!cache.has(id)) {
      cache.set(
        id,
        fetch(`${base}${id}/data.json`).then((r) => r.json()),
      );
    }
    return cache.get(id);
  }

  function fit() {
    if (!data) return;
    const full = document.fullscreenElement === stage;
    const room = full ? window.innerWidth : stage.clientWidth;
    const roomH = full ? window.innerHeight : Number.POSITIVE_INFINITY;
    const k = Math.floor(Math.min(room / data.w, roomH / data.h));
    // Narrower than the picture (a phone): fit it, pixelated, at whatever it takes.
    scale = k >= 1 ? k : room / data.w;
    box.style.width = `${data.w * scale}px`;
    box.style.height = `${data.h * scale}px`;
    show(current);
  }

  function show(i) {
    current = i;
    if (!data || i < 0) {
      mark.hidden = true;
      readout.textContent = HINT;
      return;
    }
    const r = data.regions[i];
    const [x0, y0, x1, y1] = r.box;
    mark.hidden = false;
    mark.style.left = `${x0 * scale}px`;
    mark.style.top = `${y0 * scale}px`;
    mark.style.width = `${(x1 - x0) * scale}px`;
    mark.style.height = `${(y1 - y0) * scale}px`;
    readout.textContent = r.label;
  }

  function at(ev) {
    const rect = still.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * data.w;
    const y = ((ev.clientY - rect.top) / rect.height) * data.h;
    // The smallest region under the pointer wins, so a Slot beats the panel round it.
    let best = -1;
    let area = Number.POSITIVE_INFINITY;
    data.regions.forEach((r, i) => {
      const [x0, y0, x1, y1] = r.box;
      if (x >= x0 && x < x1 && y >= y0 && y < y1) {
        const a = (x1 - x0) * (y1 - y0);
        if (a < area) {
          area = a;
          best = i;
        }
      }
    });
    return best;
  }

  async function pick(tab) {
    const id = tab.dataset.concept;
    for (const t of tabs) t.setAttribute("aria-pressed", String(t === tab));
    data = await load(id);
    still.src = `${base}${id}/still.png`;
    still.alt = data.alt;
    nameEl.textContent = data.name;
    aboutEl.textContent = data.about;
    stage.setAttribute("aria-label", `${data.name}: a concept for the play screen. Arrow keys walk what is on it.`);
    current = -1;
    fit();
  }

  for (const t of tabs) t.addEventListener("click", () => pick(t));
  still.addEventListener("pointermove", (ev) => {
    if (data) show(at(ev));
  });
  still.addEventListener("pointerleave", () => show(-1));
  stage.addEventListener("keydown", (ev) => {
    if (!data) return;
    const n = data.regions.length;
    if (ev.key === "ArrowRight" || ev.key === "ArrowDown") {
      show((current + 1) % n);
      ev.preventDefault();
    } else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") {
      show((current - 1 + n) % n);
      ev.preventDefault();
    } else if (ev.key === "Escape") {
      show(-1);
    } else if (ev.key === "f" || ev.key === "F") {
      toggleFull();
    }
  });

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else stage.requestFullscreen?.();
  }
  fullBtn?.addEventListener("click", toggleFull);
  document.addEventListener("fullscreenchange", fit);
  new ResizeObserver(fit).observe(stage);

  const first = tabs.find((t) => t.getAttribute("aria-pressed") === "true") || tabs[0];
  if (first) pick(first);
})();
