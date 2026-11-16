# claude-code

Personal Claude Code setup. Skills in `.claude/skills/` load automatically in any Claude Code session that uses this repo.

## Skills
- **illustrated-editorial-motion** — 9:16 illustrated editorial explainer videos in Remotion. Standard v2: 100 % SVG, 24 fps, 1080x1920, no raster, no animated hands.
  Call it with `/illustrated-editorial-motion <topic>` or just ask for an "editorial illustration explainer video".
  Read `.claude/skills/illustrated-editorial-motion/references/svg-production-standard.md` first. Reusable generator + Remotion code: `.claude/skills/illustrated-editorial-motion/toolkit/`.
- **red-signal-video** — script + logo → 1080x1920 short video in the "Red Signal" look (red #E11D2E, bracketed highlight titles, window cards, chapter counter). Playwright + ffmpeg engine, includes audio generator.
- **story-25d-video** — 2.5D story video from a script.
- **museum-doc-video** — museum-documentary style video from a script.
- **ink-puppet-story-video** — ink-puppet character story video.
  Call any of them with `/<skill-name> <script or topic>`.

To use it in another project: copy `.claude/skills/illustrated-editorial-motion/` into that project's `.claude/skills/` or into `~/.claude/skills/`.
