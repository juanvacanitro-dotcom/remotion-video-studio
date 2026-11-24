import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GTA6ZinkoMotionV6,GTA6ZinkoMotionV6Preview} from './CompositionV6';
const Root:React.FC=()=> <>
 <Composition id="GTA6ZinkoMotionV6" component={GTA6ZinkoMotionV6} durationInFrames={5400} fps={30} width={1920} height={1080} defaultProps={{sceneCount:18}}/>
 <Composition id="GTA6ZinkoMotionV6Preview" component={GTA6ZinkoMotionV6Preview} durationInFrames={630} fps={30} width={1920} height={1080}/>
</>;
registerRoot(Root);
