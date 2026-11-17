// 030's player: one Title screen concept at a time, live, at whole-number scale.
// It draws the concept's layers (build.py writes them) onto a 480 x 270 canvas: the scene, each
// animation's frame, a cameo when one is out (031), the menu, the selected item's overlay. The
// arrow keys walk the menu, Enter or a click picks a row and the line under the stage says what it
// opens. The tab pressed in the page's HTML is shown first. Nothing here is the game.
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
  // A cameo (031's squirrel) shows itself now and then: first a few seconds after its screen
  // shows, then every 20 to 40 s, counted from one appearance's start to the next's; never with
  // reduced motion, and a few seconds after motion comes back. A click while it is out drops its
  // picture (an acorn), which falls, bounces once, rests and goes.
  const FIRST = [4000, 8000];
  const EVERY = [20000, 40000];
  const GRAVITY = 0.0006; // px per ms squared
  const BOUNCE = 180;
  const REST = 5000;
  const BLINK = 900;
  const MAX_DROPS = 3;
  let peeks = [];
  let drops = [];
  let reducedLast = motion.matches; // reduced motion was on at the last frame drawn
  const within = ([lo, hi]) => lo + Math.random() * (hi - lo);

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
    const cameos = data.cameos?.length ? await image(`${dir}cameos.png`) : null;
    const c = { data, scene, ui, anims, select, sky, cameos };
    cache.set(id, c);
    return c;
  }

  // The frame a cameo is on, or -1 while it is away.
  function peekFrame(p, now) {
    if (p.at === null) return -1;
    let at = now - p.at;
    const d = p.cm.durations;
    for (let i = 0; i < d.length; i++) {
      if (at < d[i]) return i;
      at -= d[i];
    }
    return -1;
  }

  // Where a dropped picture is (y), or null once it has gone; `on` is false in a blink.
  function dropAt(a, now) {
    const t = now - a.t0;
    const fall = Math.sqrt((2 * (a.ground - a.y0)) / GRAVITY);
    if (t < fall) return { y: a.y0 + 0.5 * GRAVITY * t * t, on: true };
    const u = (t - fall) / BOUNCE;
    if (u < 1) return { y: a.ground - 2 * Math.sin(Math.PI * u), on: true };
    const r = t - fall - BOUNCE;
    if (r < REST) return { y: a.ground, on: true };
    if (r < REST + BLINK) return { y: a.ground, on: Math.floor((r - REST) / 150) % 2 === 1 };
    return null;
  }

  function drawCameos(now) {
    if (motion.matches) {
      reducedLast = true;
      return;
    }
    if (reducedLast) {
      // Motion is back: a cameo waits its first few seconds again, rather than coming out at once
      // because its time passed while it could not show. (Read here, not on the query's change
      // event: a list whose `matches` is read every frame may never get one.)
      reducedLast = false;
      for (const p of peeks) {
        p.at = null;
        p.next = now + within(FIRST);
      }
    }
    if (!cur.cameos) return;
    for (const p of peeks) {
      if (p.at === null && now >= p.next) {
        p.at = now;
        // the next one is counted from this one's start (a click moves `at`, never `next`)
        p.next = now + within(EVERY);
      }
      const i = peekFrame(p, now);
      if (i < 0) {
        p.at = null;
        continue;
      }
      const { cm } = p;
      ctx.drawImage(cur.cameos, i * cm.w, cm.sy, cm.w, cm.h, cm.x, cm.y, cm.w, cm.h);
    }
    drops = drops.filter((a) => {
      const at = dropAt(a, now);
      if (!at) return false;
      const d = a.cm.drop;
      if (at.on) ctx.drawImage(cur.cameos, d.sx, d.sy, d.w, d.h, d.at[0], Math.round(at.y), d.w, d.h);
      return true;
    });
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
    drawCameos(now);
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
    const when = it.when && it.when !== "always" ? ` Shown ${it.when}.` : "";
    readout.textContent = pickedNow ? `${it.label}: ${it.say}.${when}` : `${it.label}.${when}`;
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
    const now = performance.now();
    peeks = (cur.data.cameos || []).map((cm) => ({ cm, at: null, next: now + within(FIRST) }));
    drops = [];
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

  function onScreen(e) {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  }

  function point(e) {
    const [x, y] = onScreen(e);
    return cur?.data.items.find((i) => x >= i.box[0] && x < i.box[2] && y >= i.box[1] && y < i.box[3]);
  }

  // The cameo under the pointer, if it is out and in a frame a click catches it in.
  function caught(e) {
    if (!cur?.cameos || motion.matches) return null;
    const [x, y] = onScreen(e);
    const now = performance.now();
    return peeks.find((p) => {
      const h = p.cm.hit;
      return p.cm.shows.includes(peekFrame(p, now)) && x >= h[0] && x < h[2] && y >= h[1] && y < h[3];
    });
  }

  canvas.addEventListener("pointermove", (e) => {
    const p = caught(e);
    const it = p ? null : point(e);
    canvas.style.cursor = p || it ? "pointer" : "default";
    if (it && it.id !== sel) choose(it.id);
  });
  canvas.addEventListener("click", (e) => {
    const p = caught(e);
    if (p) {
      // It drops what it holds and dashes back: the peek jumps to its flee frame.
      const now = performance.now();
      const d = p.cm.drop;
      if (drops.length >= MAX_DROPS) drops.shift();
      drops.push({ cm: p.cm, t0: now, y0: d.at[1], ground: d.ground });
      p.at = now - p.cm.durations.slice(0, p.cm.flee).reduce((a, b) => a + b, 0);
    } else {
      const it = point(e);
      if (it) choose(it.id, true);
    }
    stage.focus({ preventScroll: true });
  });
  stage.addEventListener("keydown", (e) => {
    if (!cur) return;
    // leave the browser's own shortcuts alone (Ctrl+F finds, Alt+Left goes back)
    if (e.ctrlKey || e.metaKey || e.altKey) return;
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

  const first = tabs.find((t) => t.getAttribute("aria-pressed") === "true") || tabs[0];
  show(first?.dataset.concept || "a").catch(() => {
    if (readout) readout.textContent = "The live screens did not load; the pictures above are the stills.";
  });
})();
