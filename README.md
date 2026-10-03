# tools

My tools and playgrounds, in one repo and on one site at [tools.memoesparza.com](https://tools.memoesparza.com). Each tool keeps its own folder and its own stack, and they share a design system, Memo Terminal, which lives here too.

| Tool | Folder | On the site |
| --- | --- | --- |
| Invoices and receipts | [`invoices/`](invoices/) | [/invoices/](https://tools.memoesparza.com/invoices/) |
| Color wheel | [`color-wheel/`](color-wheel/) | [/color-wheel/](https://tools.memoesparza.com/color-wheel/) |
| Point cloud, and its editions | [`point-cloud/`](point-cloud/) | [/point-cloud/](https://tools.memoesparza.com/point-cloud/) |
| Pixelated text and kinematic type | [`typography/`](typography/) | [/typography/](https://tools.memoesparza.com/typography/) |
| Memo Terminal, the design system | [`design-system/`](design-system/) | [/design-system/index.css](https://tools.memoesparza.com/design-system/index.css) |

## Why

I had each tool in its own repo with its own deploy, and I wanted them all under one roof, so a change to the design system reaches every tool on the next deploy and there is one place to find them.

## Usage

```sh
npm install
npm run build
npx serve dist
```

That builds the whole site into `dist/` the way it is deployed. To work on one tool, run it from its folder: `npm run dev -w invoices` for invoices, and for the others, which have no build step, serve the folder (`npx serve point-cloud`).

## How it works

- `scripts/build.mjs` builds invoices with Vite, copies the other tools as they are, puts the design system's stylesheet at `/design-system/`, and adds the list of tools from `hub/` as the home page.
- npm workspaces link `design-system/` into invoices, so invoices always uses the design system in this repo rather than a published copy.
- `vercel.json` tells Vercel to run that build and serve `dist/`, with trailing slashes on so each tool's relative paths resolve.
- Color wheel, point cloud and typography came in with their full history, and their old repos point here. Invoices came in as a single snapshot, because its earlier history has my own details in the sample data.

## Limits

- Only invoices uses the design system so far. The other tools still have their own look and get moved over one at a time.
- Point cloud loads three.js from jsDelivr and pixelated text loads React and Babel from unpkg, so those two need those CDNs to be reachable.
- `typography/pixelated-text/project/fonts/` has PP Editorial New font files that were already in the public typography repo. Check that their licence allows that before relying on it.
