// 030's player: one Title screen concept at a time, live, at whole-number scale.
// It draws the concept's layers (build.py writes them) onto a 480 x 270 canvas: the scene, each
// animation's frame, the menu, the selected item's overlay. The arrow keys walk the menu, Enter or
// a click picks a row and the line under the stage says what it opens. Nothing here is the game.
(() => {
  const root = document.querySelector("[data-title-concepts]");
  if (!root) return;
  const base = root.dataset.base || "";
  const W = 480;
  const H = 270;
  const stage = root.querySelector(".tc-stage");
  const canvas = root.querySelector(".tc-canvas");
  const ctx = canvas.getContext("2d");
  const readout = root.querySelector(".tc-readout");
  const nameEl = root.querySelector(".tc-name");
  const aboutEl = root.querySelector(".tc-about");
  const tabs = [...root.querySelectorAll(".tc-tab")];
  const full = root.querySelector(".tc-full");
  const still = root.querySelector(".tc-still");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cache = new Map();
  let cur = null;
  let sel = null;
  let picked = 0;
  let start = performance.now();

  const image = (src) =>
    new Promise((ok, fail) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = fail;
      im.src = src;
    });

  async function load(id) {
    if (cache.has(id)) return cache.get(id);
    const dir = `${base}${id}/`;
    const data = await (await fetch(`${dir}data.json`)).json();
    const [scene, ui, anims, select] = await Promise.all(
      ["scene", "ui", "anims", "select"].map((n) => image(`${dir}${n}.png`)),
    );
    // The sky under each sparkle, read once, so a sparkle can go dark and come back.
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const octx = off.getContext("2d");
    octx.drawImage(scene, 0, 0);
    const sky = data.twinkle.map(([x, y]) => {
      const px = octx.getImageData(Math.min(W - 1, x + 3), y, 1, 1).data;
      const arm = octx.getImageData(x + 1, y, 1, 1).data;
      return { x, y, sky: `rgb(${px[0]},${px[1]},${px[2]})`, arm: `rgb(${arm[0]},${arm[1]},${arm[2]})` };
    });
    // Each sparkle rests for a few seconds, then dims for a moment, out of step with the others.
    for (const s of sky) {
      s.period = 2400 + Math.random() * 5200;
      s.phase = Math.random() * s.period;
    }
    const c = { data, scene, ui, anims, select, sky };
    cache.set(id, c);
    return c;
  }

  function frameOf(anim, t) {
    const total = anim.durations.reduce((a, b) => a + b, 0);
    let at = t % total;
    for (let i = 0; i < anim.durations.length; i++) {
      if (at < anim.durations[i]) return i;
      at -= anim.durations[i];
    }
    return 0;
  }

  function draw(now) {
    if (!cur) return;
    const t = motion.matches ? 0 : now - start;
    const { data, scene, ui, anims, select, sky } = cur;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(scene, 0, 0);
    for (const a of data.anims) {
      if (a.follows) continue;
      const i = motion.matches ? 0 : frameOf(a, t);
      ctx.drawImage(anims, i * a.w, a.sy, a.w, a.h, a.x, a.y, a.w, a.h);
    }
    if (!motion.matches) {
      for (const s of sky) {
        const p = (t + s.phase) % s.period;
        if (p < 260) {
          ctx.fillStyle = s.sky;
          ctx.fillRect(s.x - 1, s.y, 3, 1);
          ctx.fillRect(s.x, s.y - 1, 1, 3);
          ctx.fillStyle = s.arm;
          ctx.fillRect(s.x, s.y, 1, 1);
        }
      }
    }
    ctx.drawImage(ui, 0, 0);
    const it = data.items.find((i) => i.id === sel);
    if (it?.sel) {
      const s = it.sel;
      // A picked row blinks twice, as a game confirms a choice.
      const blink = !motion.matches && picked && now - picked < 360 && Math.floor((now - picked) / 90) % 2 === 1;
      if (!blink) ctx.drawImage(select, s.sx, s.sy, s.w, s.h, s.x, s.y, s.w, s.h);
    }
    // A marker that moves with the selection flickers where the selected item is.
    for (const a of data.anims) {
      const at = a.follows?.[sel];
      if (!at || motion.matches) continue;
      ctx.drawImage(anims, frameOf(a, t) * a.w, a.sy, a.w, a.h, at[0], at[1], a.w, a.h);
    }
    requestAnimationFrame(draw);
  }

  function say(it, pickedNow) {
    if (!readout || !it) return;
    const when = it.when && it.when !== "always" ? ` Shown when ${it.when}.` : "";
    readout.textContent = pickedNow ? `${it.label}: opens ${it.say}.${when}` : `${it.label}.${when}`;
  }

  function choose(id, pickedNow = false) {
    sel = id;
    if (pickedNow) picked = performance.now();
    say(
      cur.data.items.find((i) => i.id === id),
      pickedNow,
    );
  }

  function step(by) {
    const items = cur.data.items;
    const at = items.findIndex((i) => i.id === sel);
    choose(items[(at + by + items.length) % items.length].id);
  }

  function fit() {
    const fs = document.fullscreenElement === stage;
    const room = fs ? Math.min(window.innerWidth / W, window.innerHeight / H) : stage.clientWidth / W;
    const k = room >= 1 ? Math.floor(room) : room;
    canvas.style.width = `${Math.round(W * k)}px`;
    canvas.style.height = `${Math.round(H * k)}px`;
  }

  async function show(id) {
    const first = !cur;
    cur = await load(id);
    sel = cur.data.default;
    picked = 0;
    for (const t of tabs) t.setAttribute("aria-pressed", String(t.dataset.concept === id));
    if (nameEl) nameEl.textContent = cur.data.name;
    if (aboutEl) aboutEl.textContent = cur.data.about;
    stage.setAttribute("aria-label", `${cur.data.name}: a Title screen concept. Arrow keys walk the menu, Enter picks.`);
    choose(sel);
    if (first) {
      if (still) still.hidden = true;
      canvas.hidden = false;
      fit();
      requestAnimationFrame(draw);
    }
  }

  function point(e) {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    return cur?.data.items.find((i) => x >= i.box[0] && x < i.box[2] && y >= i.box[1] && y < i.box[3]);
  }

  canvas.addEventListener("pointermove", (e) => {
    const it = point(e);
    canvas.style.cursor = it ? "pointer" : "default";
    if (it && it.id !== sel) choose(it.id);
  });
  canvas.addEventListener("click", (e) => {
    const it = point(e);
    if (it) choose(it.id, true);
    stage.focus({ preventScroll: true });
  });
  stage.addEventListener("keydown", (e) => {
    if (!cur) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
    else if (e.key === "Home") choose(cur.data.items[0].id);
    else if (e.key === "End") choose(cur.data.items[cur.data.items.length - 1].id);
    else if (e.key === "Enter" || e.key === " ") choose(sel, true);
    else if (e.key === "f" || e.key === "F") toggleFull();
    else return;
    e.preventDefault();
  });
  for (const t of tabs) t.addEventListener("click", () => show(t.dataset.concept));

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else stage.requestFullscreen?.();
  }
  full?.addEventListener("click", toggleFull);
  document.addEventListener("fullscreenchange", fit);
  new ResizeObserver(fit).observe(stage);

  show(tabs[0]?.dataset.concept || "a").catch(() => {
    if (readout) readout.textContent = "The live screens did not load; the pictures above are the stills.";
  });
})();
