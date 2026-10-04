# Typography

Two playgrounds for type in motion, [pixelated text](pixelated-text/) and [kinematic type](kinematic/), and the page that lists them.

Live at [tools.memoesparza.com/typography](https://tools.memoesparza.com/typography/).

| | | |
| --- | --- | --- |
| [Pixelated text](pixelated-text/) | text that comes in through a grid of shrinking blocks | [open](https://tools.memoesparza.com/typography/pixelated-text/) |
| [Kinematic type](kinematic/) | a glyph turning in stepped bands, with a heat trail | [open](https://tools.memoesparza.com/typography/kinematic/) |

## Usage

Open any `index.html` in a browser, there is no build step and nothing to install.

## How it works

- `index.html` is the list, one tile per effect, with its stills in `assets/`.
- `ds.css` has the panel, the sliders, the chips and the export window that both playgrounds use, and each playground keeps only its own rules inline. On the site the design system in [`../design-system`](../design-system) is linked after it and restyles the same classes.
- Each effect is one folder with its own `index.html`.

To add one, make a folder whose `index.html` links `../ds.css` and builds its panel from the same classes (`.panel`, `.section`, `.field`, `.select-chip` and the rest), then add a tile to `index.html` and a row to the table above.

## History

Pixelated text started as its own repository and came here with its history, and this folder later moved into the tools repo the same way. The old address, memo-es.github.io/pixelated-text, no longer works.
