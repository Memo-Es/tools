# liquid-glass

Refractive glass lens for the web. SVG filters only — no WebGL, no canvas
compositing at render time.

## How it works

`demo-utils.js` computes a displacement map by refracting through a bezel
profile with Snell's law, plus a matching rim-lighting map. An SVG filter
chain feeds the background image through `feImage`, displaces it three times
at slightly different scales for chromatic dispersion, recombines per channel,
then blends the specular rim over the top and masks the result to the lens
shape.

Two things that are easy to get wrong and silently produce nothing:

- **`color-interpolation-filters="sRGB"`** is required. SVG filters default to
  linearRGB, which gamma-shifts a map whose channels encode geometry.
- **`dpr` must be ≥ 2.** The specular weight is `sqrt(1 - (1 - depth/dpr)²)`;
  at `dpr: 1` anything deeper than a pixel goes negative and the rim comes
  back `NaN`.

`backdrop-filter: url(#…)` also works and refracts live DOM rather than an
image, but the effect is far weaker — it can only reveal what is already
painted behind, so subtle displacement over flat colour is invisible.

## Use

Open `index.html`. Controls cover shape, size, surface profile, bezel width,
glass thickness, refractive index, refraction level, blur, chromatic
aberration, saturation, specular opacity and background.

## Credit

`demo-utils.js` is unmodified from [jeantimex/glass-ui](https://github.com/jeantimex/glass-ui) (MIT).
The filter chain follows its `morphing` demo.
