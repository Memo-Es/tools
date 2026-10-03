# tools-design-system

Memo Terminal, the design system for Memo's tools: a dark, single-size monospace screen where labels read like code, and quiet A4 sheets in a grotesk for anything printed. It started as the look of [invoices](https://github.com/Memo-Es/invoices).

The editable version, with live previews and usage notes for every token and component, is the **Memo Terminal** design system page on claude.ai. This repo is what projects install.

## Use it

### Auto-updating

Link the latest 0.x release from jsDelivr. Every project that does this picks up a new release without a rebuild, once the CDN cache refreshes (usually within a few hours):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Memo-Es/tools-design-system@0/dist/index.css">
```

### Pinned

Install a tagged version. The project only changes when you change the tag:

```sh
npm install github:Memo-Es/tools-design-system#v0.1.0
```

```js
import 'tools-design-system'            // fonts, tokens and components
import 'tools-design-system/tokens.css' // or just the variables
```

Both ways load the same four files from `dist/`: `fonts.css` (Google Fonts), `tokens.css`, `components.css` and `index.css`, which imports the other three.

## What's in it

- **Variables**, all prefixed `--mt-` so they can't collide with a project's own: colours (`--mt-bg`, `--mt-panel`, `--mt-text`, `--mt-dim`, `--mt-hi`, `--mt-paper`, `--mt-ink`…), spacing (`--mt-space-2` to `--mt-space-32`), `--mt-radius-0`, `--mt-shadow-sheet` and font stacks (`--mt-font-mono`, `--mt-font-grotesk`…).
- **Type classes**: `.mt-t-body`, `.mt-t-heading`, `.mt-t-label`, and the paper styles `.mt-t-gr-big`, `.mt-t-gr-num`, `.mt-t-rc-body`…
- **Components**, as classes: put `mt-root` on the container, then `mt-bar`, `mt-btn` (`is-on`, `--primary`, `--add`), `mt-switch`, `mt-section` with `mt-rule`, `mt-grid` / `mt-field` / `mt-label` / `mt-input`, `mt-chips`, `mt-item`, `mt-details`, `mt-status`, and `mt-stage` with `mt-sheet`. The design system page has the markup for each.

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

## Change it

`src/tokens.json` is the same file the design system page edits, and `src/components.css` is its component stylesheet. `dist/` is generated from them.

1. Make the change on the design system page and ask Claude to sync it here, or edit `src/` directly.
2. `npm run build`. CI fails if `dist/` doesn't match `src/`.
3. Release it with a tag: `git tag v0.1.1 && git push --tags`.

Bump the patch for changed values, the minor for anything added. Renaming or removing a variable or class breaks the projects using it, so save those for `v1.0.0`; auto-updating links on `@0` won't follow it there.
