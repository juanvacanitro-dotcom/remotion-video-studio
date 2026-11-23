import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {ZinkoGTA6Espera} from './Composition';
const Root:React.FC=()=> <Composition id="ZinkoGTA6Espera" component={ZinkoGTA6Espera} durationInFrames={5400} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
