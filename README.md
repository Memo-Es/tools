# Kinematic Type Playground

Type a glyph and watch it swing on its own axis, cut into horizontal bands
that each run a little behind the one above, so the motion breaks into steps,
with a heat trail that fades through a four-stop palette. A browser-based
experiment with live controls for every parameter and export support.

## Features

- A glyph swinging or spinning in 3D, with perspective
- Slit-scan bands: the number of steps, how far each lags and where they start
  (set Bands to 1 for a smooth motion smear)
- A decaying heat trail with spread, glow and grain
- Palette presets (Heatwave, Acid, Ice, Ember, Paper) or four custom stops
- Any font: the built-ins, Google fonts or an uploaded .ttf / .otf / .woff
- Export to PNG or JPG at up to 4K, to WebM in whole cycles, and to JSON
- The composition is the URL, so a link reopens it exactly
- No dependencies: plain HTML, CSS and WebGL2

## Usage

Open `index.html` in any modern browser. There's no build step. Press
**Space** to pause and pick the moment for a still.

## How it works

Three shader passes on the GPU:

1. **Glyph.** The text is rasterised once into a texture. Each pixel finds its
   band, runs the clock back by that band's delay, and inverts a Y-axis
   rotation with perspective to find where on the glyph it lands.
2. **Trail.** A feedback buffer keeps the brighter of this frame's glyph and a
   blurred, decayed copy of the last frame.
3. **Ramp.** The trail value is mapped through the palette (core, warm, cool,
   then the ground), with a glow and film grain on top.

The colour fringe isn't a channel offset. It's time mapped to hue: where the
glyph is now is the core colour, and the further back it was, the cooler.

## Design system

The same tokens, panel, controls and export modal as
[pixelated-text](https://github.com/Memo-Es/pixelated-text), so the two read
as one set of tools.

---

Effect after [oyeabhijit](https://www.instagram.com/oyeabhijit/)'s
"[a] — Typeface". Ideated by [Memo Es](https://memoesparza.com) ·
Implemented with [Claude Code](https://claude.ai/code) help
