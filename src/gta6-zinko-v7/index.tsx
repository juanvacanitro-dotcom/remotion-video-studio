import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GTA6ZinkoMotionV7,GTA6ZinkoMotionV7Preview} from './CompositionV7';
const Root:React.FC=()=> <>
 <Composition id="GTA6ZinkoMotionV7" component={GTA6ZinkoMotionV7} durationInFrames={5400} fps={30} width={1920} height={1080} defaultProps={{sceneCount:18}}/>
 <Composition id="GTA6ZinkoMotionV7Preview" component={GTA6ZinkoMotionV7Preview} durationInFrames={630} fps={30} width={1920} height={1080}/>
</>;
registerRoot(Root);
