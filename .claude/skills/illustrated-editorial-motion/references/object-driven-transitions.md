# Object-driven transitions (V4)

Avoid blur whips and slideshow wipes. Use the story object.

| Transition | How (code) | Used in |
|---|---|---|
| Camera pushes into an object | `CameraRig` keys: scale 1.5 -> 4.4 toward the noodle surface | S1 end |
| Bowl becomes a top-down scene | circular iris (`clip-path: circle`) centred on the bowl surface point computed from the S1 camera (`resolveCamera`), radius grows while the incoming top-down bowl scales 2.4 -> 1 and its centre is aligned to the iris centre | S1 -> S2 |
| Foreground object wipes | `ObjectTransition`: a big coin rolls across, dragging a mustard panel that covers the cut | S2 -> S3 |
| Hand reveals environment (pattern) | hand drags an overlay panel / sleeve across the frame, scene swaps while covered | library pattern |
| Infographic element becomes scene element (pattern) | scale the chart bar / coin until it fills the frame, then it becomes the next background | library pattern |
| Continuous camera move (no cut) | same world, camera pans from packet to bowl (S1) | S1 |

Rules: one covering transition per ≥ 2 s; the swap must happen while the frame is covered; keep the object recognisable (it must be something that exists in the story); first 4 frames after the swap carry no critical motion. Filters (ink wobble) must wrap the **screen-size** layer, not the zoomed world (see Ink below).
