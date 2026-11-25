import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {Paper,Label,Nico,Logo,CaptionLine,WHITE,INK,Y,useFonts} from './shared';

export const Question=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill><Paper/>
   <Label text="¿TÚ QUÉ NOTA" y={250} size={103} color={WHITE} settled/>
   <Label text="LE PONDRÍAS?" y={420} size={110} delay={8}/>
   <Logo x={500} y={660} width={330}/><Nico pose="question" x={490} y={1010} width={265} delay={5}/>
   <div style={{position:'absolute',left:775,top:1030,font:'160px ZinkoImpact',color:Y,WebkitTextStroke:`4px ${INK}`,rotate:`${10+Math.sin(f*.05)*4}deg`}}>?</div>
   <CaptionLine scene="question"/>
 </AbsoluteFill>;
};
