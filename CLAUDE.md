# tools

My tools in one repo, built into one site for tools.memoesparza.com. See README.md for the layout. Each tool's folder can have its own notes (`point-cloud/CLAUDE.md`, `invoices/CLAUDE.md`, `design-system/CLAUDE.md`), and they apply inside that folder.

Every commit is authored by Memo, and carries no AI attribution of any kind (no Co-Authored-By trailer, no session link, no generated-with footer), which is the rule point-cloud already had:

```
git config user.name  "Guillermo Esparza"
git config user.email "49539954+Memo-Es@users.noreply.github.com"
```

Run `npm run build` before pushing, and open the tools you touched from `dist/` to check them.

## Writing on GitHub

READMEs, commit messages, pull request descriptions, issues and comments go out under Memo's name, so they follow his voice (`.claude/skills/write-as-memo` in memo-es/memoesparza):

- Before writing or rewriting a README, read the READMEs of several similar public repos for structure, then write it the way his own READMEs are written: a plain first-person opening line, then Why, Usage, How it works and Limits (see `invoices/README.md`).
- Lead with the concrete thing. Connect clauses with "and", "which", "because", "so".
- No em dashes, and no hyphens in compound adjectives ("dark only", not "dark-only"). Code identifiers are exempt.
- No aphorisms or taglines, no "not X, but Y", no stacked short sentences for rhythm, no colon followed by a reveal, no sales bullets.
- Never state a reason or an opinion he hasn't given. Leave a gap and ask.
