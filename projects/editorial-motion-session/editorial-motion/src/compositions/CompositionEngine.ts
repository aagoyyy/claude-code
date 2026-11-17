/**
 * COMPOSITION VARIATION ENGINE
 * Each scene declares a CompositionKind. `checkDiversity` enforces: the same kind may not repeat more than twice in a row
 * unless `reason` documents a storytelling need. Defaults map every kind to a background + camera + placement guidance.
 */
export type CompositionKind =
  | 'wide-environment'
  | 'close-up'
  | 'top-down'
  | 'side-view'
  | 'character-interaction'
  | 'full-screen'
  | 'infographic'
  | 'split-comparison'
  | 'layered-story';

export type SceneMeta = {name: string; kind: CompositionKind; reason?: string};

export const compositionGuide: Record<CompositionKind, {background: string; camera: string; placement: string; use: string}> = {
  'wide-environment': {background: 'KitchenEnv / Warung / office', camera: 'wide, gentle pull-out', placement: 'hero in a third, environment fills rest', use: 'establish place'},
  'close-up': {background: 'blurred environment or paper', camera: 'close / extreme close-up push-in', placement: 'hero off-centre on a third line', use: 'detail, emphasis'},
  'top-down': {background: 'TopDownTable', camera: 'topDown (tiny rotate + push)', placement: 'arrange objects spatially; leave a column for info', use: 'process, ingredients'},
  'side-view': {background: 'counter + wall', camera: 'sideView lateral track', placement: 'objects on counter line', use: 'action on a surface'},
  'character-interaction': {background: 'any', camera: 'medium, follow the hand', placement: 'hand + object, hand drives movement', use: 'doing something'},
  'full-screen': {background: 'single illustration fills frame', camera: 'slow push', placement: 'no UI chrome', use: 'emotional beat'},
  infographic: {background: 'InfographicBackground (paper + grid)', camera: 'static or vertical reframe', placement: 'numbers/diagrams on grid', use: 'explain numbers'},
  'split-comparison': {background: 'two-tone halves', camera: 'static', placement: 'two halves, shared baseline', use: 'A vs B'},
  'layered-story': {background: 'new panel over previous scene', camera: 'push through', placement: 'overlay panel on live scene', use: 'summary on top of context'},
};

export const checkDiversity = (scenes: SceneMeta[], maxRun = 2): string[] => {
  const problems: string[] = [];
  let run = 1;
  for (let i = 1; i < scenes.length; i++) {
    if (scenes[i].kind === scenes[i - 1].kind) {
      run++;
      if (run > maxRun && !scenes[i].reason) problems.push(`${scenes[i].name}: "${scenes[i].kind}" used ${run}x in a row without a storytelling reason`);
    } else run = 1;
  }
  return problems;
};
