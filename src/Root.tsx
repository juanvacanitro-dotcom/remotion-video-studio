import React from 'react';
import {WhatIfGTA6Film} from './what-if-gta6/Composition';
import {Composition} from 'remotion';
import {CinematicShowreel} from './compositions/CinematicShowreel';
import {GTA6R8Intro} from './compositions/GTA6R8Intro';
import {GTA6R8Cut} from './compositions/GTA6R8Cut';
import {GTA6Scenes1to4} from './compositions/GTA6Scenes1to4';
import {GTA6R8Real} from './compositions/GTA6R8Real';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="WhatIfGTA6Film" component={WhatIfGTA6Film} durationInFrames={9000} fps={30} width={1920} height={1080} />
    <Composition id="CinematicLandscape" component={CinematicShowreel} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{format:'landscape'}} />
    <Composition id="CinematicVertical" component={CinematicShowreel} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{format:'vertical'}} />
    <Composition id="GTA6Scenes1to4" component={GTA6Scenes1to4} durationInFrames={1200} fps={30} width={1920} height={1080} />
    <Composition id="GTA6R8Cut" component={GTA6R8Cut} durationInFrames={804} fps={30} width={1920} height={1080} />
    <Composition id="GTA6R8Intro" component={GTA6R8Intro} durationInFrames={900} fps={30} width={1920} height={1080} />
  </>
);
