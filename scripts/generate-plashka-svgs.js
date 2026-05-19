/**
 * Generates 12 clean plashka SVG files (3 styles × 4 colors).
 * Output: assets/plashkas/plashka-[a|b|c]-[cyan|green|purple|gold].svg
 *
 * Style A — filled plashka + pill below  (maps to: filled style + line3)
 * Style B — filled plashka only          (maps to: filled style, no line3)
 * Style C — bordered/outline plashka     (maps to: bordered style)
 *
 * Run: node scripts/generate-plashka-svgs.js
 */

const fs   = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'plashkas');
fs.mkdirSync(OUT_DIR, { recursive: true });

const COLORS = {
  cyan:   '#00d4ff',
  green:  '#00e676',
  purple: '#8b5cf6',
  gold:   '#ffd700',
};

const DARK = '#111118';

// Dimensions (optimised for 1024px wide image canvas)
const W  = 750;   // plashka width
const H  = 100;   // plashka height
const R  = 14;    // plashka corner radius
const PW = 460;   // pill width
const PH = 68;    // pill height
const PR = 34;    // pill corner radius
const GAP = 12;   // gap between plashka bottom and pill top

// --- SVG builders ---

function svgA(hex) {
  const totalH = H + GAP + PH;
  const px = (W - PW) / 2;
  const py = H + GAP;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${totalH}">
  <rect x="0" y="0" width="${W}" height="${H}" rx="${R}" ry="${R}" fill="${hex}"/>
  <rect x="${px}" y="${py}" width="${PW}" height="${PH}" rx="${PR}" ry="${PR}" fill="${DARK}" stroke="${hex}" stroke-width="3"/>
</svg>`;
}

function svgB(hex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="0" y="0" width="${W}" height="${H}" rx="${R}" ry="${R}" fill="${hex}"/>
</svg>`;
}

function svgC(hex) {
  const sw = 4;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="${sw/2}" y="${sw/2}" width="${W - sw}" height="${H - sw}" rx="${R}" ry="${R}" fill="${DARK}" stroke="${hex}" stroke-width="${sw}"/>
</svg>`;
}

const builders = { a: svgA, b: svgB, c: svgC };

let count = 0;
for (const [style, builder] of Object.entries(builders)) {
  for (const [name, hex] of Object.entries(COLORS)) {
    const filename = `plashka-${style}-${name}.svg`;
    fs.writeFileSync(path.join(OUT_DIR, filename), builder(hex), 'utf8');
    console.log(`✅ ${filename}`);
    count++;
  }
}

console.log(`\nГотово: ${count} SVG файлов в assets/plashkas/`);
