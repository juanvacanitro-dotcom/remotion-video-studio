import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GTA6ZinkoEditorialV2} from './Composition';
const Root:React.FC=()=> <Composition id="GTA6ZinkoEditorialV2" component={GTA6ZinkoEditorialV2} durationInFrames={5400} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
