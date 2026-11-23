import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GTA6ZinkoEditorialV2, GTA6ZinkoMotionV3} from './Composition';
import {GTA6ZinkoMotionV4} from './CompositionV4';
const Root:React.FC=()=> <><Composition id="GTA6ZinkoEditorialV2" component={GTA6ZinkoEditorialV2} durationInFrames={5400} fps={30} width={1920} height={1080}/><Composition id="GTA6ZinkoMotionV3" component={GTA6ZinkoMotionV3} durationInFrames={5400} fps={30} width={1920} height={1080}/><Composition id="GTA6ZinkoMotionV4" component={GTA6ZinkoMotionV4} durationInFrames={5400} fps={30} width={1920} height={1080}/></>;
registerRoot(Root);
