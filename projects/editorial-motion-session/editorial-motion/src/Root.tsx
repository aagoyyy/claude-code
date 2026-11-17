import React from 'react';
import {Composition} from 'remotion';
import {VisualStyleDemo} from './examples/VisualStyleDemo';
import {StyleSheet} from './examples/StyleSheet';
import {SceneTemplatesDemo} from './examples/SceneTemplatesDemo';
import {DynamicPrototype} from './dynamic/DynamicPrototype';
import {DynamicPrototype2} from './dynamic/DynamicPrototype2';
import {DemoV3, V3, V3_SCENES} from './v3/DemoV3';
import {checkDiversity} from './compositions/CompositionEngine';
import {HandSheet} from './v3/HandSheet';
import {DemoV4, V4, V4_SCENES, FPS4} from './v4/DemoV4';
import {DemoV5, V5, V5_SCENES, FPS5} from './v5/DemoV5';
import {V6Board} from './v6/Board';
import {DemoV6, V6} from './v6/Demo';
import {FullV6, FULL} from './v6/Full';
import {OpenV6, OPEN} from './v6/Open';
import {FPS, CANVAS} from './visual-system/ThemeTokens';

const problems = [...checkDiversity(V3_SCENES), ...checkDiversity(V4_SCENES), ...checkDiversity(V5_SCENES)];
if (problems.length) throw new Error('Composition diversity rule violated: ' + problems.join('; '));

export const Root: React.FC = () => (
  <>
    <Composition id="NoodleProfitDemo" component={VisualStyleDemo} durationInFrames={450} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="StyleSheet" component={StyleSheet} durationInFrames={1} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="SceneTemplatesDemo" component={SceneTemplatesDemo} durationInFrames={180} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="DynamicPrototype" component={DynamicPrototype} durationInFrames={150} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="DynamicPrototype2" component={DynamicPrototype2} durationInFrames={150} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="DemoV3" component={DemoV3} durationInFrames={V3.total} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="HandSheet" component={HandSheet} durationInFrames={1} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="DemoV4" component={DemoV4} durationInFrames={V4.total} fps={FPS4} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="DemoV5" component={DemoV5} durationInFrames={V5.total} fps={FPS5} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="V6Board" component={V6Board} durationInFrames={6} fps={24} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="DemoV6" component={DemoV6} durationInFrames={V6.total} fps={V6.fps} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="FullV6" component={FullV6} durationInFrames={FULL.total} fps={FULL.fps} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="OpenV6" component={OpenV6} durationInFrames={OPEN.total} fps={OPEN.fps} width={CANVAS.width} height={CANVAS.height} />
  </>
);
