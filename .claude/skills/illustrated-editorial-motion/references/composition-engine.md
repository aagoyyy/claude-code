# Composition engine (V3/V4)

`src/compositions/CompositionEngine.ts`: `CompositionKind` (wide-environment, close-up, top-down, side-view, character-interaction, full-screen, infographic, split-comparison, layered-story), `compositionGuide` (background, camera, placement, use), and `checkDiversity(scenes, maxRun=2)`. `Root.tsx` runs the check and throws if the same kind repeats more than twice without a documented `reason`.

Shot sizes: wide, medium, close-up, extreme close-up (see camera-language). Do not centre the hero repeatedly: use thirds, let the hand/arm and a text column share the frame, alternate environment / close-up / top-down / infographic / wide.

Environments: `KitchenEnv`, `TopDownTable`, `StreetEnv` (+ `RoundTable`), `Warung`, `IllustratedEnvironment`, `InfographicBackground`, `IsolatedBackground`, `TopDownSurface`. Choose the background from the story place, never reuse the same one for more than two consecutive scenes.
