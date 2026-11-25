import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Footage,Label,Nico,CaptionLine,Credit,WHITE,useFonts} from './shared';

export const Paradox=()=>{
 useFonts();return <AbsoluteFill><Footage src="zinko-full/coast.mp4" position="40% 50%" shade={.35}/>
   <Label text="Y AUN ASÍ..." y={250} size={105} color={WHITE} settled/>
   <Label text="CASI TODOS\nLO APLAUDEN" y={495} size={114} delay={13}/>
   <Nico pose="question" x={500} y={950} width={340} delay={12}/>
   <CaptionLine scene="paradox"/>
   <Credit light>Rockstar Games · tráiler oficial · análisis de reseñas</Credit>
 </AbsoluteFill>;
};
