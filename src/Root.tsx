import React from 'react';
import {Composition} from 'remotion';
import {CinematicShowreel} from './compositions/CinematicShowreel';
export const RemotionRoot: React.FC = () => <>
<Composition id="CinematicLandscape" component={CinematicShowreel} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{format:'landscape'}} />
<Composition id="CinematicVertical" component={CinematicShowreel} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{format:'vertical'}} />
</>;
