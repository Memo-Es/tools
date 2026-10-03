# Animated Orb

An ambient background effect — soft glowing orbs that drift, breathe, and fuse together — reverse-engineered from ElevenLabs and rebuilt as a fully customizable, self-contained HTML file.

---

## How it works

Colored blobs are drawn on a `<canvas>` and passed through a multi-step SVG filter pipeline:

1. **Gaussian blur** — softens each blob
2. **Alpha threshold** — pushes overlapping blobs to fuse with sharp edges (the "goo" effect)
3. **Flood + composite matte** — isolates the fused shape
4. **Restore source colors** — original blob colors are painted back inside the fused shape
5. **Final blur** — re-softens everything into a bloom glow

A grain texture tile and an overlay tint layer sit on top for depth.

---

## Customize

Open `index.html` and edit the `:root` block at the top — that's the only place you need to touch:

```css
:root {
  --bg:    #09090f;   /* background */
  --orb-1: #5b3fff;   /* purple-blue */
  --orb-2: #1a7cff;   /* electric blue */
  --orb-3: #00c2c7;   /* cyan */
  --orb-4: #b03fff;   /* violet */
  --orb-5: #ff3fa4;   /* pink */
}
```

- **Add orbs** — define `--orb-6` through `--orb-12`
- **Remove orbs** — delete a variable
- **Change palette** — swap any hex value

Motion, size, and timing are randomized on each load for natural variety.

---

## Usage

No build step, no dependencies. Just open `index.html` in a browser.

To embed as a background in another project, drop the `<div class="scene">` block, the SVG filter, and the `<script>` into your page and point the CSS variables at your own palette.

---

## Credits

Built by [Guillermo Esparza](https://github.com/Memo-Es) · Claude-assisted
