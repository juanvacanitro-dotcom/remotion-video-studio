import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Paper,Label,Nico,Logo,CaptionLine,Credit,GREEN,WHITE,INK,useFonts,ease} from './shared';

export const Hook=()=>{
  useFonts();const f=useCurrentFrame();
  return <AbsoluteFill><Paper/><Logo y={150} width={290}/>
    <Label text="¿CASI PERFECTO?" y={430} size={91} color={WHITE} settled/>
    <Label text="99" y={560} size={400} color={GREEN} angle={-7} settled/>
    <Label text="/100" x={710} y={910} size={132} color={WHITE} angle={5} delay={8} width={300}/>
    <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M177 1040Q475 997 830 1050" fill="none" stroke={INK} strokeWidth="9" strokeDasharray="670" strokeDashoffset={670*(1-ease((f-12)/20))}/></svg>
    <Label text="METACRITIC" x={422} y={1090} size={76} delay={15} width={530}/>
    <Nico pose="question" x={765} y={1115} width={190} delay={22} angle={5}/>
    <CaptionLine scene="hook"/>
    <Credit>Primeras reseñas · 19/11/2026 · contexto del análisis</Credit>
  </AbsoluteFill>;
};
