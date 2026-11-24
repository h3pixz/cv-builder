---
name: pr-description
description: Write a short PR description for the current branch. Use when the user asks for a PR description or PR text.
---

Follow the structure of .github/pull_request_template.md.

Context (keep it cheap):

- Run only: git log main..HEAD --oneline and git diff main...HEAD --stat
- Read the full diff only for files whose purpose is unclear from the name.
- Don't open other files or explore the repo.

Rules:

- Max 120 words, English, no emojis, no filler.
- Describe what and why, not a file-by-file list.
- Don't mention tests/lint/typecheck unless something failed or was skipped.
- Remove any template section with nothing useful to say.
- Title: `type: summary` under 70 chars (Conventional Commits, no scope).
- Output the description only, no preamble.
