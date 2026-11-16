> **LEGACY / DO NOT USE for new work.** Standard v2 forbids animated human hands. Use object-to-object interaction, steam, fire, boiling, camera and typography instead.

# Hands & physical interaction

Component: `src/v3/Hand2.tsx` — back-of-hand view, fingers point toward -x, rolled sleeve. One merged silhouette (single dark outline pass, then skin) with tapered fingers, nails, knuckle bumps, tendons, shaded underside. Thumb solved by IK onto the index tip when `meet=1` (pinch).

Poses (`POSES`): `open`, `pinch`, `hold`, `grip`, `point`, `present`, `pour`; `blendPose(a,b,t)` animates between them. `mirror` for a left hand, `rot` rotates around the wrist. `handTip(x,y,s,rot,mirror,local)` returns the world position of a local point (PINCH_TIP, GRIP).

## The rule: hand and object are ONE rigid system
Never animate a hand and an object independently. Drive the **object** pose (centre, rotation) and derive the hand origin from it:
```
origin = objectCentre - R(rot) * (mirror ? ( (166-GRIP.x)*s, (GRIP.y-44)*s ) : …)
```
(see `PC_VEC` in `src/v4/DemoV4.tsx`). The hand then rotates with the object about the wrist, so the fingers stay on the object while it lifts, tilts and pours.

## Recipes (all used in the V4 demo unless noted)
- **Open packaging:** right hand enters (hand ease), pinch closes on the corner, anticipation (pull the strip slightly *into* the packet), rip (fast, overshoot), packet pops, strip flies off with a spin, hand retreats.
- **Grab / pick up:** second hand enters (mirrored), `open -> grip` blend, packet squashes slightly as it is gripped, lift with ease, arc over to target.
- **Pour:** rotate the rigid hand+packet 0 -> ~104° with a small wind-up back-rotation; the content slides along the packet's local axis (`slide()`), exits the opening, then free-falls with gravity (`brickFree`) and lands on the target with impact effects.
- **Place:** pinch holds the item above the target, release (`pinch -> open`), item drops with `topDownScale` + shadow response, soft food wobble on landing, hand retreats up/out.
- **Present / push:** hand grips the rim and slides the object in with overshoot; the object leans with its velocity and squashes when it stops (V3 shot C).
- **Point** (library only): `POSES.point`; **stir** (library only): hold chopsticks with `hold`, move the tip on a circle and rotate noodle strands (`jig`) — not shown in the demo.

## Layering
Objects that emerge from a container (brick from the packet) are drawn *under* the container; held objects under the fingers (hand drawn last).
