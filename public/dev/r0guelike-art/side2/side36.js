/* 036's section: concept A, round 2, with three switches (the figure's size, the gear, the
   background). Each switch picks one of eight stills; the page shows it at the largest
   whole-number scale that fits and names whatever a pointer rests on (or the arrow keys reach),
   from that still's data.json. No dependencies. */

(() => {
  const root = document.querySelector("[data-side-round2]");
  if (!root) return;
  const base = root.dataset.base || "side2/";
  const stage = root.querySelector(".sp-stage");
  const box = root.querySelector(".sp-box");
  const still = root.querySelector(".sp-still");
  const mark = root.querySelector(".sp-mark");
  const readout = root.querySelector(".sp-readout");
  const fullBtn = root.querySelector(".sp-full");
  const groups = [...root.querySelectorAll("[data-switch]")];
  const HINT = "Point at anything on the screen, or use the arrow keys, to see what it is.";
  const state = { gear: "kit", size: "64", bg: "plain" };

  let data = null;
  let current = -1;
  let scale = 1;
  const cache = new Map();

  const keyOf = () => `${state.gear}-${state.size}-${state.bg}`;

  function load(k) {
    if (!cache.has(k)) cache.set(k, fetch(`${base}${k}/data.json`).then((r) => r.json()));
    return cache.get(k);
  }

  function fit() {
    if (!data) return;
    const full = document.fullscreenElement === stage;
    const room = full ? window.innerWidth : stage.clientWidth;
    const roomH = full ? window.innerHeight : Number.POSITIVE_INFINITY;
    const k = Math.floor(Math.min(room / data.w, roomH / data.h));
    scale = k >= 1 ? k : room / data.w;
    box.style.width = `${data.w * scale}px`;
    box.style.height = `${data.h * scale}px`;
    show(current);
  }

  function show(i) {
    current = i;
    if (!data || i < 0 || i >= data.regions.length) {
      mark.hidden = true;
      readout.textContent = HINT;
      return;
    }
    const [x0, y0, x1, y1] = data.regions[i].box;
    mark.hidden = false;
    mark.style.left = `${x0 * scale}px`;
    mark.style.top = `${y0 * scale}px`;
    mark.style.width = `${(x1 - x0) * scale}px`;
    mark.style.height = `${(y1 - y0) * scale}px`;
    readout.textContent = data.regions[i].label;
  }

  function at(ev) {
    const rect = still.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * data.w;
    const y = ((ev.clientY - rect.top) / rect.height) * data.h;
    let best = -1;
    let area = Number.POSITIVE_INFINITY;
    data.regions.forEach((r, i) => {
      const [x0, y0, x1, y1] = r.box;
      if (x >= x0 && x < x1 && y >= y0 && y < y1 && (x1 - x0) * (y1 - y0) < area) {
        area = (x1 - x0) * (y1 - y0);
        best = i;
      }
    });
    return best;
  }

  async function refresh() {
    const k = keyOf();
    const d = await load(k);
    if (k !== keyOf()) return; // a later switch won
    data = d;
    still.src = `${base}${k}/still.png`;
    still.alt = data.alt;
    stage.setAttribute("aria-label", `${data.name}: ${data.switchWords}. Arrow keys walk what is on it.`);
    fit();
  }

  for (const g of groups) {
    for (const b of g.querySelectorAll("button")) {
      b.addEventListener("click", () => {
        state[g.dataset.switch] = b.dataset.value;
        for (const o of g.querySelectorAll("button")) o.setAttribute("aria-pressed", String(o === b));
        refresh();
      });
    }
  }
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

  for (const g of groups) {
    const on = g.querySelector('button[aria-pressed="true"]');
    if (on) state[g.dataset.switch] = on.dataset.value;
  }
  refresh();
})();
