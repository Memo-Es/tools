// The pixelation engine, shared by the playground (index.html) and the embed
// (embed/index.html). A plain script with no dependencies: it defines
// EASINGS, EASING_NAMES, clearPixelCache() and renderPixelatedFrame() as globals.

// ─────────────────────────────────────────────────────────────────────────────
// Easing library (subset — what the UI exposes)
// ─────────────────────────────────────────────────────────────────────────────
const EASINGS = {
  linear:        (t) => t,
  easeOutQuad:   (t) => t * (2 - t),
  easeOutCubic:  (t) => (--t) * t * t + 1,
  easeOutQuart:  (t) => 1 - (--t) * t * t * t,
  easeOutExpo:   (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutCubic:(t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeOutBack:   (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};
const EASING_NAMES = Object.keys(EASINGS);

// ─────────────────────────────────────────────────────────────────────────────
// The pixelation engine (extracted).
//
//   renderPixelatedText(dst, opts) paints a frame of text into `dst` canvas
//   with the requested pixelation level.
//
//   - `progress` 0..1 : 0 is maximally blocky, 1 is crisp
//   - `maxCell`       : starting block size in CSS px
//   - `minCell`       : terminal block size (1 = pixel-perfect)
//   - We cache the source text render keyed by its inputs so re-renders
//     during scrubbing don't redraw + re-sample the text every frame.
// ─────────────────────────────────────────────────────────────────────────────

let _srcCache = null; // { key, canvas, imgData }

// Call when the text, its style or the canvas size changes.
function clearPixelCache() { _srcCache = null; }

function getSourceCanvas({
  text, font, weight, italic, size, color, letterSpacing, align,
  width, height, dpr,
}) {
  const key = [
    text, font, weight, italic, size, color, letterSpacing, align, width, height, dpr,
  ].join('|');
  if (_srcCache && _srcCache.key === key) return _srcCache;

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  const style = italic ? 'italic' : 'normal';
  ctx.font = `${style} ${weight} ${size}px ${font}`;

  // Manual letter-spacing pass.
  const chars = Array.from(text);
  const widths = chars.map(ch => ctx.measureText(ch).width);
  const trackPx = letterSpacing * size;
  let total = widths.reduce((a, b) => a + b, 0) + trackPx * Math.max(0, chars.length - 1);
  let x;
  if (align === 'center') x = width / 2 - total / 2;
  else if (align === 'right') x = width - total - 20;
  else x = 20;
  ctx.textAlign = 'left';
  const cy = height / 2;
  chars.forEach((ch, i) => {
    ctx.fillText(ch, x, cy);
    x += widths[i] + trackPx;
  });

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  _srcCache = { key, canvas, imgData, w: canvas.width, h: canvas.height };
  return _srcCache;
}

function renderPixelatedFrame(dst, opts) {
  const {
    progress,
    maxCell = 56,
    minCell = 1,
    threshold = 0.08, // alpha cutoff below which we skip a cell
    width, height, dpr,
  } = opts;

  const src = getSourceCanvas({ ...opts, dpr });

  const ctx = dst.getContext('2d');
  dst.width = Math.floor(width * dpr);
  dst.height = Math.floor(height * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, dst.width, dst.height);
  ctx.scale(dpr, dpr);

  const p = Math.max(0, Math.min(1, progress));
  const ratio = Math.max(0.0001, minCell / maxCell);
  // Exponential falloff for natural-feeling shrink from blocky → crisp.
  const cellSize = Math.max(minCell, Math.round(maxCell * Math.pow(ratio, p)));

  if (cellSize <= 1 && p >= 0.995) {
    ctx.drawImage(src.canvas, 0, 0, width, height);
    return;
  }

  const imgData = src.imgData;
  const sw = src.w;
  const sh = src.h;
  const cellSrc = cellSize * dpr;
  ctx.imageSmoothingEnabled = false;

  for (let gy = 0; gy < height; gy += cellSize) {
    for (let gx = 0; gx < width; gx += cellSize) {
      const sx = Math.min(sw - 1, Math.floor((gx + cellSize / 2) * dpr));
      const sy = Math.min(sh - 1, Math.floor((gy + cellSize / 2) * dpr));
      const idx = (sy * sw + sx) * 4;
      if (imgData[idx + 3] < 12) continue;

      let rAcc = imgData[idx], gAcc = imgData[idx+1], bAcc = imgData[idx+2], aAcc = imgData[idx+3];
      let n = 1;
      if (cellSrc > 4) {
        const offs = [
          [-cellSrc/3, -cellSrc/3],
          [ cellSrc/3, -cellSrc/3],
          [-cellSrc/3,  cellSrc/3],
          [ cellSrc/3,  cellSrc/3],
        ];
        for (const [dx, dy] of offs) {
          const xx = Math.max(0, Math.min(sw-1, Math.floor(sx + dx)));
          const yy = Math.max(0, Math.min(sh-1, Math.floor(sy + dy)));
          const ii = (yy * sw + xx) * 4;
          rAcc += imgData[ii];
          gAcc += imgData[ii+1];
          bAcc += imgData[ii+2];
          aAcc += imgData[ii+3];
          n++;
        }
      }
      const rr = Math.round(rAcc / n);
      const gg = Math.round(gAcc / n);
      const bb = Math.round(bAcc / n);
      const aa = (aAcc / n) / 255;
      if (aa < threshold) continue;
      ctx.fillStyle = `rgba(${rr},${gg},${bb},${aa})`;
      ctx.fillRect(gx, gy, cellSize, cellSize);
    }
  }
}
