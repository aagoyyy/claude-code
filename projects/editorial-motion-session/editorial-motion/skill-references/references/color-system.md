# Color system

All colors live in `src/visual-system/ColorPalette.ts` (and are consumed through `ThemeTokens.ts` / `BackgroundTokens.ts`). **Never write raw hex in components.**

| Token | Hex | Use |
|---|---|---|
| `palette.ivory` | #F5F0E5 | paper base, label fills |
| `palette.beige` | #E8C99B | table / wood / sand surfaces |
| `palette.grid` | #D9D5C9 | grid lines, dashed rules |
| `palette.navy` | #202A36 | all primary text |
| `palette.tomato` | #D94B3D | price tags, key emphasis, packet top |
| `palette.green` | #54815C | positive / value / greens |
| `palette.mustard` | #E6B94F | coins, packet body, highlights, cost |
| `palette.brown` | #A66E42 | wood, counters, notebook |

`observed.*` = sampled from the reference (paper #F6F4F0, grid #E8E6E2, warm cream #F7F0DE, sand #EBC58F, wood #C8905A, tag red #D54F48). Documentation only; the brief's palette is the working palette.

`derived.*` = shades/tints of the palette for shading and materials (outline #3A2B22, warm white, skin, deep/light variants, noodle, broth, steam, shadow rgba, soft navy).

## Rules
- Text: navy on paper; white on tomato/green tags; emphasis words in tomato (negative / attention), green (positive / profit), mustard (money / highlight).
- Max 3 accent colors visible per scene.
- New color needed (e.g. blue ice-tea glass): add a `derived` token with a comment explaining the story reason, keep saturation within the muted range.
- Backgrounds change tone between scenes (ivory paper ↔ cream+table ↔ environment) but never to saturated or dark colors.
