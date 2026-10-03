# tools-design-system

The design system for my tools, which I call Memo Terminal. The screen is black and set in one size of JetBrains Mono, with labels written the way you would name a variable, and anything that gets printed comes out as a plain A4 sheet in Inter Tight.

## Why

I made it from [invoices](https://github.com/Memo-Es/invoices) so the next tool can look like that one without copying its stylesheet by hand, and so I can change a colour in one place and have every tool follow.

## Usage

To always get the latest version, link the stylesheet from jsDelivr, which serves it straight from this repo:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Memo-Es/tools-design-system@main/dist/index.css">
```

A tool that links it this way picks up a change a few hours after it lands on `main`, without being rebuilt.

To keep a project on one version until you decide to move it, install it from GitHub instead:

```sh
npm install github:Memo-Es/tools-design-system
```

```js
import 'tools-design-system'
```

npm writes the exact commit into the lockfile, so the project stays where it is until you run `npm update tools-design-system`.

Then put `mt-root` on the element that holds the tool and use the classes:

```html
<div class="mt-root">
  <header class="mt-bar">
    <span class="mt-dim">&gt;</span> INVOICES <span class="mt-dim">(INV-0002)</span>
    <span class="mt-dots"></span>
    <button class="mt-btn">[NEW]</button>
    <button class="mt-btn mt-btn--primary">[SAVE_PDF ↓]</button>
  </header>
</div>
```

## What's in it

- `dist/tokens.css` has the colours, spacing, the shadow and the font stacks as variables, all starting with `--mt-` so they don't clash with a project's own (`--mt-bg`, `--mt-text`, `--mt-dim`, `--mt-hi`, `--mt-paper`, `--mt-ink`, `--mt-space-16`, `--mt-font-mono`). It also has a class for each text style, like `.mt-t-body` or `.mt-t-gr-num`.
- `dist/components.css` has the pieces of the invoices editor as classes: the top bar (`mt-bar`), bracket buttons (`mt-btn`, with `is-on`, `mt-btn--primary` and `mt-btn--add`), switches, section heads, fields, chip rows, item rows, the fold, the status line and the A4 sheet (`mt-sheet`).
- `dist/fonts.css` loads the five font families from Google Fonts.
- `dist/index.css` imports the other three.

## How it works

`src/tokens.json` is the same file the Memo Terminal design system page edits on claude.ai, and `src/components.css` is the same stylesheet, so a change made on that page gets copied into `src/` and `npm run build` writes `dist/` from it. The build script has no dependencies.

CI runs `npm run check`, which fails when `dist/` doesn't match `src/`, so an edit to `src/` that was never built can't go unnoticed.

## Limits

- The screen only has a dark theme. The light surface is the paper.
- Renaming or removing a variable or a class breaks every tool that links `@main`, so check those tools before changing a name.
- `index.css` fetches fonts from Google. Load `tokens.css` and `components.css` on their own and host the fonts yourself if a tool shouldn't make that request.
- There is no JavaScript. Switches and buttons only change look when the tool's own code moves `is-on`, and the fold is a plain `<details>` element.
- Two of the greys are under 4.5:1 for small text: `--mt-dim` (3.7:1 on the panel) and `--mt-placeholder` (2.0:1). Don't put anything people have to read in them alone.
