// One-shot generator for the branded default OG image (1200×630).
// Drafting Table palette: mist ground, faint blueprint grid, ink wordmark,
// one plain line, a single vermilion registration mark. No new dependency —
// sharp is already in the tree. Re-run after changing the wordmark/line:
//   node scripts/make-og.mjs
import sharp from "sharp";

const W = 1200;
const H = 630;

const BG = "#E9EDF2"; // mist
const INK = "#15324E"; // ink-blue
const MUTED = "#5F7384";
const ACCENT = "#DE3C26"; // vermilion
const LINE = "rgba(21,50,78,0.16)";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0 H0 V28" fill="none" stroke="${LINE}" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- registration marks in opposite corners (drafting feel) -->
  <g stroke="${INK}" stroke-opacity="0.42" stroke-width="2">
    <path d="M64 64 h22 M64 64 v22"/>
    <path d="M${W - 64} ${H - 64} h-22 M${W - 64} ${H - 64} v-22"/>
  </g>

  <!-- mono coordinate label -->
  <text x="90" y="250" font-family="Consolas, 'Courier New', monospace"
        font-size="24" letter-spacing="3" fill="${MUTED}">ABIALAS.PL</text>

  <!-- wordmark -->
  <text x="88" y="345" font-family="Georgia, 'Times New Roman', serif"
        font-size="92" font-weight="500" fill="${INK}">Andrzej Białaś</text>

  <!-- one plain line -->
  <text x="90" y="410" font-family="'Segoe UI', Arial, sans-serif"
        font-size="34" fill="${INK}">Marketing systems, plainly.</text>

  <!-- single vermilion registration mark -->
  <g stroke="${ACCENT}" stroke-width="3">
    <path d="M90 470 h34 M107 453 v34"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og-default.png");
const meta = await sharp("public/og-default.png").metadata();
console.log(`og-default.png written: ${meta.width}×${meta.height}`);
