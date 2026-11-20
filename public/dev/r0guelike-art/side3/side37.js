/* 037's section: concept A, round 3. Four switches (the gear, Furia's state, the figure's size,
   the background) pick one still; a Furia still carries two loops (the figure and the Main hand
   Slot) played over it on a canvas. The page shows the canvas at the largest whole-number scale
   that fits, names whatever a pointer rests on (or the arrow keys reach), and in full screen the
   keys G, T, S and B switch it and a bar says what is shown. No dependencies. */

(() => {
  const root = document.querySelector("[data-side-round3]");
  if (!root) return;
  const base = root.dataset.base || "side3/";
  const stage = root.querySelector(".sp-stage");
  const box = root.querySelector(".sp-box");
  const canvas = root.querySelector(".sp3-canvas");
  const ctx = canvas.getContext("2d");
  const mark = root.querySelector(".sp-mark");
  const readout = root.querySelector(".sp-readout");
  const fsbar = root.querySelector(".sp3-fsbar");
  const fullBtn = root.querySelector(".sp3-full");
  const groups = [...root.querySelectorAll("[data-switch]")];
  const furiaOnly = root.querySelector("[data-furia-only]");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const HINT = "Point at anything on the screen, or use the arrow keys, to see what it is.";
  const ORDER = {
    gear: ["kit", "furia"],
    state: ["dormant", "ignited", "raging"],
    size: ["32", "64"],
    bg: ["plain", "bg"],
  };
  const state = { gear: "furia", state: "ignited", size: "64", bg: "plain" };

  let cur = null; // { data, still, sheets }
  let current = -1;
  let scale = 1;
  let shownAt = performance.now();
  const cache = new Map();

  const keyOf = () =>
    `${state.gear}-${state.size}-${state.bg}` + (state.gear === "furia" ? `-${state.state}` : "");

  const image = (src) =>
    new Promise((ok, fail) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = fail;
      im.src = src;
    });

  function load(k) {
    if (!cache.has(k)) {
      cache.set(
        k,
        fetch(`${base}${k}/data.json`)
          .then((r) => r.json())
          .then(async (data) => ({
            data,
            still: await image(`${base}${k}/still.png`),
            sheets: await Promise.all(data.anims.map((a) => image(`${base}${k}/${a.src}`))),
          })),
      );
    }
    return cache.get(k);
  }

  function frameAt(a, t) {
    const total = a.durations.reduce((s, d) => s + d, 0);
    let left = t % total;
    for (let i = 0; i < a.n; i++) {
      if (left < a.durations[i]) return i;
      left -= a.durations[i];
    }
    return 0;
  }

  function draw(now) {
    if (cur) {
      ctx.drawImage(cur.still, 0, 0);
      if (!motion.matches) {
        cur.data.anims.forEach((a, i) => {
          const f = frameAt(a, now - shownAt);
          ctx.drawImage(cur.sheets[i], 0, f * a.h, a.w, a.h, a.x, a.y, a.w, a.h);
        });
      }
    }
    requestAnimationFrame(draw);
  }

  function fit() {
    if (!cur) return;
    const { w, h } = cur.data;
    const full = document.fullscreenElement === stage;
    const room = full ? window.innerWidth : stage.clientWidth;
    const roomH = full ? window.innerHeight : Number.POSITIVE_INFINITY;
    const k = Math.floor(Math.min(room / w, roomH / h));
    scale = k >= 1 ? k : room / w;
    box.style.width = `${w * scale}px`;
    box.style.height = `${h * scale}px`;
    show(current);
  }

  // An item's card, beside the item under the pointer, at the screen's own scale.
  const card = document.createElement("img");
  card.className = "sp3-card";
  card.alt = "";
  card.hidden = true;
  box.append(card);

  function showCard(r) {
    if (!r || !r.card) {
      card.hidden = true;
      return;
    }
    const place = () => {
      if (!cur || cur.data.regions[current] !== r) return; // the pointer has moved on
      const w = card.naturalWidth * scale;
      const h = card.naturalHeight * scale;
      const [x0, y0, x1, y1] = r.box.map((v) => v * scale);
      const bw = cur.data.w * scale;
      const bh = cur.data.h * scale;
      let x = x1 + 4 * scale;
      if (x + w > bw) x = x0 - 4 * scale - w; // no room to the right: the left
      let y = Math.min(Math.max(0, y0), bh - h);
      if (x < 0) {
        x = Math.min(Math.max(0, x0), bw - w);
        y = y1 + 4 * scale <= bh - h ? y1 + 4 * scale : Math.max(0, y0 - 4 * scale - h);
      }
      card.style.width = `${w}px`;
      card.style.height = `${h}px`;
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.hidden = false;
    };
    const src = `${base}${r.card}`;
    if (card.getAttribute("src") !== src) {
      card.hidden = true;
      card.onload = place;
      card.setAttribute("src", src);
    } else if (card.complete) place();
  }

  function download() {
    const blob = new Blob([`${cur.data.log.join("\n")}\n`], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "log-mines-2-turn-1412.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function show(i) {
    current = i;
    const regions = cur ? cur.data.regions : [];
    showCard(regions[i]);
    if (i < 0 || i >= regions.length) {
      mark.hidden = true;
      readout.textContent = HINT;
    } else {
      const [x0, y0, x1, y1] = regions[i].box;
      mark.hidden = false;
      mark.style.left = `${x0 * scale}px`;
      mark.style.top = `${y0 * scale}px`;
      mark.style.width = `${(x1 - x0) * scale}px`;
      mark.style.height = `${(y1 - y0) * scale}px`;
      readout.textContent = regions[i].label;
    }
    if (fsbar && cur) fsbar.textContent = `${cur.data.switchWords} · ${i >= 0 ? readout.textContent : "G gear · T Furia · S size · B background · F leave"}`;
  }

  function at(ev) {
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * cur.data.w;
    const y = ((ev.clientY - rect.top) / rect.height) * cur.data.h;
    let best = -1;
    let area = Number.POSITIVE_INFINITY;
    cur.data.regions.forEach((r, i) => {
      const [x0, y0, x1, y1] = r.box;
      if (x >= x0 && x < x1 && y >= y0 && y < y1 && (x1 - x0) * (y1 - y0) < area) {
        area = (x1 - x0) * (y1 - y0);
        best = i;
      }
    });
    return best;
  }

  function mirror() {
    for (const g of groups) {
      for (const b of g.querySelectorAll("button")) {
        b.setAttribute("aria-pressed", String(b.dataset.value === state[g.dataset.switch]));
      }
    }
    if (furiaOnly) furiaOnly.toggleAttribute("data-off", state.gear !== "furia");
  }

  async function refresh() {
    mirror();
    const k = keyOf();
    const next = await load(k);
    if (k !== keyOf()) return; // a later switch won
    cur = next;
    shownAt = performance.now();
    canvas.setAttribute("aria-label", cur.data.alt);
    stage.setAttribute("aria-label", `${cur.data.name}: ${cur.data.switchWords}. Arrow keys walk what is on it.`);
    fit();
  }

  function set(name, value) {
    state[name] = value;
    if (name === "state") state.gear = "furia";
    refresh();
  }

  function cycle(name) {
    const list = ORDER[name];
    set(name, list[(list.indexOf(state[name]) + 1) % list.length]);
  }

  for (const g of groups) {
    for (const b of g.querySelectorAll("button")) {
      b.addEventListener("click", () => set(g.dataset.switch, b.dataset.value));
    }
  }
  canvas.addEventListener("pointermove", (ev) => {
    if (cur) show(at(ev));
  });
  canvas.addEventListener("pointerleave", () => show(-1));
  canvas.addEventListener("click", (ev) => {
    if (!cur) return;
    const i = at(ev);
    if (i >= 0 && cur.data.regions[i].id === "log-download") download();
  });
  stage.addEventListener("keydown", (ev) => {
    if (!cur) return;
    const n = cur.data.regions.length;
    const k = ev.key.toLowerCase();
    if (ev.key === "ArrowRight" || ev.key === "ArrowDown") show((current + 1) % n);
    else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") show((current - 1 + n) % n);
    else if (ev.key === "Escape") show(-1);
    else if (ev.key === "Enter" && current >= 0 && cur.data.regions[current].id === "log-download") download();
    else if (k === "f") toggleFull();
    else if (k === "g") cycle("gear");
    else if (k === "t") cycle("state");
    else if (k === "s") cycle("size");
    else if (k === "b") cycle("bg");
    else return;
    ev.preventDefault();
  });

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else stage.requestFullscreen?.().then(() => stage.focus());
  }
  fullBtn?.addEventListener("click", toggleFull);
  document.addEventListener("fullscreenchange", fit);
  new ResizeObserver(fit).observe(stage);

  for (const g of groups) {
    const on = g.querySelector('button[aria-pressed="true"]');
    if (on) state[g.dataset.switch] = on.dataset.value;
  }
  refresh().catch(() => {
    readout.textContent = "The live screen did not load.";
  });
  requestAnimationFrame(draw);
})();
