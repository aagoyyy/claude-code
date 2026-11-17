# Transition system

Transitions are overlays centred on a **cut frame** `at` (outgoing scene ends at `at`, incoming starts at `at`; the scene swap happens while the overlay fully covers the frame). `useTransition(at, duration)` returns `{t, cover, active}`.

| # | Type | Component | Use when | Duration |
|---|---|---|---|---|
| 1 | Clean hard cut | adjacent `<Sequence>`s | the hero object persists across scenes (continuity *is* the transition) | 0 |
| 2 | Slide | `SlideTransition` | topic moves forward in the same space | 14–18 f |
| 3 | Object-driven | `ObjectTransition` (children = the story object) | the object is the next scene's subject (price tag → price scene) | 20–24 f |
| 4 | Scale | `ScaleTransition(cx,cy)` | zoom into a detail / circle of a coin | 16–20 f |
| 5 | Layered reveal | `LayeredTransition` | big chapter change (cost → analysis) | 24–28 f |
| 6 | Object replacement | `ObjectReplace` *inside* a scene | A becomes B in place (packet → bowl) | 10–14 f |
| 7 | Graphic wipe | `GraphicWipe` | wrap-up / summary scene | 18–22 f |

## Rules
- Prefer motivated transitions: use the object the story is about.
- Do not use the same transition twice in a row; do not exceed one covering transition per 60 frames.
- Overlay colors come from the palette (tomato/mustard/green/paper).
- After a covering transition, the first 6–8 frames of the new scene should not contain important motion (it is still being revealed).


## V4
See `object-driven-transitions.md` for the object-motivated set (camera push-through, bowl->top-down iris, coin wipe).
