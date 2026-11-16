# claude-code

Personal Claude Code setup. Skills in `.claude/skills/` load automatically in any Claude Code session that uses this repo.

## Skills
- **illustrated-editorial-motion** — 9:16 illustrated editorial explainer videos in Remotion. Standard v2: 100 % SVG, 24 fps, 1080x1920, no raster, no animated hands.
  Call it with `/illustrated-editorial-motion <topic>` or just ask for an "editorial illustration explainer video".
  Read `.claude/skills/illustrated-editorial-motion/references/svg-production-standard.md` first. Reusable generator + Remotion code: `.claude/skills/illustrated-editorial-motion/toolkit/`.

To use it in another project: copy `.claude/skills/illustrated-editorial-motion/` into that project's `.claude/skills/` or into `~/.claude/skills/`.
