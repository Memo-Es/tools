# tools

My tools and playgrounds, in one repo and on one site at [tools.memoesparza.com](https://tools.memoesparza.com). Each tool keeps its own folder and its own stack, and they share a design system, Memo Terminal, which lives here too.

| Tool | Folder | On the site |
| --- | --- | --- |
| Invoices and receipts | [`invoices/`](invoices/) | [/invoices/](https://tools.memoesparza.com/invoices/) |
| Color wheel | [`color-wheel/`](color-wheel/) | [/color-wheel/](https://tools.memoesparza.com/color-wheel/) |
| Point cloud, and its editions | [`point-cloud/`](point-cloud/) | [/point-cloud/](https://tools.memoesparza.com/point-cloud/) |
| Pixelated text and kinematic type | [`typography/`](typography/) | [/typography/](https://tools.memoesparza.com/typography/) |
| Liquid glass | [`liquid-glass/`](liquid-glass/) | [/liquid-glass/](https://tools.memoesparza.com/liquid-glass/) |
| Line scale | [`animated-scale/`](animated-scale/) | [/animated-scale/](https://tools.memoesparza.com/animated-scale/) |
| Animated orb | [`animated-orb/`](animated-orb/) | [/animated-orb/](https://tools.memoesparza.com/animated-orb/) |
| Memo Terminal, the design system | [`design-system/`](design-system/) | [/design-system/dist/index.css](https://tools.memoesparza.com/design-system/dist/index.css) |

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

- `scripts/build.mjs` builds invoices with Vite, copies the other tools as they are, puts the design system's stylesheet at `/design-system/dist/`, and adds the list of tools from `hub/` as the home page.
- Every tool starts with the design system's `mt-nav` strip, `> TOOLS / POINT CLOUD`, which links back to the list. Invoices has it in its own top bar instead.
- Every playground links `design-system/dist/index.css` last in its `<head>` and has `class="mt-play"` on `<html>`. That switches on the playground layer in the design system, which restyles the control panel all the playgrounds share (`.panel`, `.section`, `.field`, `.select-chip`, `.btn` and the rest) without touching their markup or their artwork.
- npm workspaces link `design-system/` into invoices, so invoices always uses the design system in this repo rather than a published copy.
- `vercel.json` tells Vercel to run that build and serve `dist/`, with trailing slashes on so each tool's relative paths resolve. It also sets no framework, because Vercel otherwise sees Vite in `invoices/` and builds that folder alone. The project's Root Directory must stay empty for the same reason.
- Color wheel, point cloud, typography, liquid glass, line scale and animated orb came in with their full history. Invoices came in as a single snapshot, because its earlier history has my own details in the sample data.

## Limits

- travel-planner and rfc-api are not in here. The planner is a Next.js app with a database and sign in, which needs its own deploy, and rfc-api is an API with no interface.
- The text boxes where you type the words a tool animates keep the tool's own typeface and size, since they preview the type.
- Point cloud loads three.js from jsDelivr, and pixelated text and line scale load React and Babel from unpkg, so those three need those CDNs to be reachable.
- `typography/pixelated-text/project/fonts/` has PP Editorial New font files that were already in the public typography repo. Check that their licence allows that before relying on it.
