// Builds every tool and puts them side by side in dist/, the way
// tools.memoesparza.com serves them:
//
//   dist/index.html        the list of tools (hub/)
//   dist/design-system/    the shared stylesheet, so any tool can link it
//   dist/invoices/         Vite build
//   dist/color-wheel/      copied as is
//   dist/point-cloud/      copied as is, editions/ included
//   dist/typography/       copied as is, every effect included
import { execSync } from 'node:child_process'
import { cpSync, rmSync, mkdirSync } from 'node:fs'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })
// Docs, licences and agent notes stay in the repo and out of the site.
const skip = (src) => !/(^|\/)(\.[^/]+|README\.md|CLAUDE\.md|LICENSE|node_modules|package(-lock)?\.json)$/.test(src)

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist')

run('npm run check -w tools-design-system')
run('npm run build -w invoices')

cpSync('hub', 'dist', { recursive: true })
cpSync('design-system/dist', 'dist/design-system', { recursive: true })
cpSync('invoices/dist', 'dist/invoices', { recursive: true })
for (const tool of ['color-wheel', 'point-cloud', 'typography']) {
  cpSync(tool, `dist/${tool}`, { recursive: true, filter: skip })
}
console.log('Built dist/')
