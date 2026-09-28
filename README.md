# Type Effects

Browser playgrounds for typographic motion. Type anything, tune every
parameter live, and export a still, a video or the settings.

Live at https://memo-es.github.io/type-effects/

| Effect | | |
| --- | --- | --- |
| [Pixelated text](pixelated-text/) | Text that materialises through a shrinking block grid | [open](https://memo-es.github.io/type-effects/pixelated-text/) |
| [Kinematic type](kinematic/) | A glyph swinging on its axis in stepped bands, with a heat trail | [open](https://memo-es.github.io/type-effects/kinematic/) |

## Structure

- `index.html`: the landing page, one tile per effect
- `ds.css`: the shared design system: tokens, panel, sliders, chips and the
  export modal. Every playground links it and keeps only its own rules inline,
  so a fix here lands in all of them.
- `<effect>/index.html`: one self-contained playground per folder
- `assets/`: the landing page's stills

## Adding an effect

1. Make a folder with an `index.html` that links `../ds.css`.
2. Build the panel from the same classes (`.panel`, `.section`, `.field`,
   `.select-chip` and the rest) so it reads as one of the set.
3. Add a tile to `index.html` and a row to the table above.

No build step and no dependencies to install. Open any `index.html` in a
browser.

## History

`pixelated-text` was its own repository and moved here with its history.
The old address, memo-es.github.io/pixelated-text, redirects to this one.

---

Ideated by [Memo Es](https://memoesparza.com) · Implemented with
[Claude Code](https://claude.ai/code) help
