import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {Paper,Label,Nico,CaptionLine,ORANGE,INK,WHITE,useFonts,ease} from './shared';

export const Twist=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill><Paper/>
   <Label text="PERO..." y={220} size={176} color={WHITE} settled/>
   <Nico pose="question" x={480} y={550} width={415} settled angle={-4}/>
   <Label text="HAY PEGAS" y={1180} size={133} color={ORANGE} delay={8}/>
   <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:ease((f-6)/8)}}><path d="M835 510L930 690H740Z" fill={ORANGE} stroke={INK} strokeWidth="7"/><path d="M835 563V616" stroke={INK} strokeWidth="12" strokeLinecap="round"/><circle cx="835" cy="650" r="7" fill={INK}/></svg>
   <CaptionLine scene="twist"/>
 </AbsoluteFill>;
};
