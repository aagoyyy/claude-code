# Camera language

`CameraRig` moves the *world* layer (background + objects). Overlay text stays fixed. State = {scale, x, y, rotate} where (x,y) is the world point shown at screen centre. Interpolated with `easings.inOut`.

**Guardrails built in:** the window is clamped inside the 1080×1920 canvas (no black edges) and rotation adds overscan (+3.5 % per degree).

| Move | API | Use for |
|---|---|---|
| Static | `cameraPresets.static()` | text-heavy or already-busy scenes |
| Gentle push-in | `pushIn(dur, amount=.08, x, y)` | introduce a subject (default for isolated objects) |
| Gentle pull-out | `pullOut(dur, from=1.14, x, y)` | reveal context (coins appearing around the bowl) |
| Horizontal reframing | `panX(dur, fromX, toX, scale)` | environments, side-by-side comparison |
| Vertical reframing | `panY(dur, fromY, toY, scale)` | move from headline to diagram |
| Scale focus | `focus(start, dur, x, y, scale)` or custom keys | emphasise a price tag / number |
| Top-down | `topDown(dur)` | overhead tables: tiny rotate + push |

## Rules
- One primary move per scene; at most one secondary (rotation ≤ 1°).
- Typical amounts: push-in 4–8 %, pull-out from 1.08–1.16, focus ≤ 1.15 (keep hero objects within `SAFE_RECT`).
- Move *toward* the thing the narration is about; move away to reveal quantity/context.
- Cut or transition on the camera's settled frame, not mid-move.
- Do not animate the camera when nothing needs emphasis.


## V4 — shot sizes (`cameraShots`, `shotScale`)
`wide 1.0` · `medium 1.22` · `close 1.5` · `extreme 2.0` (and beyond for push-through transitions). `cameraShots.frame(size,x,y,dur,drift)`, `.reframe(from,to,start,dur)`, `.topDown(dur)`, `.sideView(dur,fromX,toX)`.
Camera uses the **camera** motion profile (in-out bezier, no spring). A move must follow the action: pan with the hand, push in on the pour, pull out to reveal the closing wide.
Keep the filter layer outside the rig; the rig clamps to the 1080x1920 canvas.
