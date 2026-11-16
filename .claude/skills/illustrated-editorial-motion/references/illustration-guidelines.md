# Illustration guidelines

## Rules every object follows
- Authored in a local `viewBox`; rendered via `<Illustration vbW vbH size>` so outline wobble and sizing are consistent.
- Outline: `{...ink}` = stroke `derived.outline`, width 5 (viewBox units), round joins/caps. Detail lines: `{...inkThin}` (0.6×).
- Shape language: rounded corners, slightly exaggerated proportions, readable at 150 px.
- Shading: one ground shadow (`derived.shadow` ellipse), one dark flat shade shape (opacity ≈ 0.10–0.16, lower-right), one white highlight (opacity ≈ 0.3–0.5, upper-left). No gradients.
- Colors from tokens only. Text inside art uses `theme.font.display`.
- Size by the `size` prop (px width); never scale by CSS transforms inside the SVG.

## Library (src/illustrations)
- **Food:** `NoodlePacket`, `NoodleBowl(filled,toppings)`, `Steam` (draw-on), `Egg(cut)`, `Greens`, `Chili`, `SpringOnion`, `Sachet`, `MeatBall`
- **Finance:** `Coin`, `CoinStack(count)`, `PriceTagArt(text)`, `CostLabelArt(text)`, `Receipt`
- **Business:** `Warung(sign)`
- **Objects:** `Hand`, `Notebook`, `Chopsticks`
- **Technology:** `Smartphone(screen)`
- **Characters:** `Vendor(happy)`
- **Infographics:** `IsoBlock(height,color,shadeColor,topColor,label,grow)`, `ArrowCurve` (draw-on), `Sparkle`
- **Environment:** see `backgrounds/IllustratedEnvironment` (warung, kitchen) and `TopDownSurface`.

## Creating a missing illustration
1. Check `examples/StyleSheet.tsx` — reuse first.
2. Put it in the right folder; export from `illustrations/index.ts`.
3. Copy an existing component's structure: `Illustration` wrapper → ground shadow → fills with `{...ink}` → shade → highlight.
4. Add it to `StyleSheet.tsx`, render `npx remotion still ... StyleSheet`, and compare outline weight, saturation, proportion with neighbors. Fix before using it in a scene.
5. Clipping: use fixed clipPath ids per component (`packet-clip`) — identical duplicates are fine.

## Characters
Simple busts only (round head, flat cap, apron). Same outline and palette. No branded mascots or real-person likeness.

## Known limits
Hand is stylized/simple; complex action poses (pouring, stirring) are not in the library — build them as sequences of simpler objects (steam, ladle arc, splash dots) or use a metaphor.


## V4 — hand-drawn refinement
- **Ink line world** (`src/v4/Ink.tsx`): organic wobble (low-frequency displacement) + **pen-pressure variation**: dark pixels are extracted, dilated, roughened and masked by a second noise field so lines are thicker in patches and thinner elsewhere. Wrap the *screen-size* layer (outside `CameraRig`): applying it to a heavily zoomed world exceeds the browser's filter texture limit and renders black.
- **Paper + ink texture** (`PaperInk`): fibres, uneven ink density blots, warm vignette — as a final multiply overlay.
- **Matte, not glossy:** `Bowl2 gloss` 0.4–0.5; highlights are small and flat; prefer hatch (`HatchDefs`) or crescent shade shapes over gradients.
- **Richer detail:** engraved rings on coins (`Coin4`), print graphics/folds on the packet, tendons + nails + knuckles on hands, tiles/grout/utensils in environments.
- **Consistent weight:** one outline colour, 5–6 px at 1080 wide, same for hands, food, props.
- Not achievable with pure vector: painterly shading of the AI reference. State this honestly in QC.
