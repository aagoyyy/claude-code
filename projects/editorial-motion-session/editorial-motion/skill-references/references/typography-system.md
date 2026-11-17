# Typography & infographic system

Font stack (`theme.font.display`): Inter Display → Inter → Montserrat → Helvetica Neue → Arial. (If network allows, `@remotion/google-fonts` can load Montserrat to match the reference's brand header more closely; it is optional, not required.)

| Role | Token (`type.*`) | Size | Weight | Component |
|---|---|---|---|---|
| Hero | `hero` | 132 | 900 | `Headline size="hero"` |
| Headline | `headline` | 92 | 900 | `Headline` |
| Section title | `section` | 64 | 800 | `Headline size="section"` |
| Subheadline | `sub` | 48 | 700 | `Headline size="sub"` |
| Body | `body` | 44 | 600 | `Headline size="body"` |
| Label | `label` | 40 | 800 | callouts, captions |
| Price / number | `price` | 104 | 900 | `PriceTag`, `NumberHighlight`, `KineticText` |

Colors: navy text; accent words via `accent={[...]}` (tomato); white on tomato/green tags; green for profit numbers.

## Components
- `Headline` (word/line reveal) · `KineticText` (per-char pop) · `PriceTag` (hang-tag swing + kinetic digits) · `Callout` (info/cost label) · `NumberHighlight` (count-up, thousands `.` format) · `CaptionBox` (optional reference-style header + black caption box).
- Infographic art: `IsoBlock` (cost/value bars, grow), `ArrowCurve` (draw-on), `Sparkle`, `CostLabelArt`, `Receipt`; comparison = two `IsoBlock`s + labels + arrow; timeline = row of `Callout`s connected by `DrawOnPath`.

## Rules
- Max 2 lines per headline, ≤ 5 words per line; one message per screen.
- Headline in y 220–480; hero/diagram below; keep text ≥ 44 px.
- Prices: always with currency prefix and `.` thousands (`formatId`), animated, with a label noun nearby ("Modal", "Jual").
- Contrast: navy on ivory ≈ 13:1; white on tomato ≥ 4.5:1 — keep tag text bold.
- Emphasis: color OR size, not both, one word per line at most.
