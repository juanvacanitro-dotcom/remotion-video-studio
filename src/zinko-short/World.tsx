import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame,useVideoConfig} from 'remotion';
import {Footage,Label,Nico,CaptionLine,Credit,WHITE,Y,useFonts,ease} from './shared';

export const World=()=>{
  useFonts();const f=useCurrentFrame(),{fps}=useVideoConfig();
  return <AbsoluteFill>
    <Sequence durationInFrames={98} premountFor={fps}><Footage src="zinko-completo/marina.mp4" position="54% 50%"/></Sequence>
    <Sequence from={98} premountFor={fps}><Footage src="zinko-completo/details.mp4" position="49% 50%"/></Sequence>
    {f<72?<><Label text="MUNDO" y={260} size={151} color={WHITE} settled/><Label text="ABIERTO" y={435} size={155} delay={8}/></>:f<110?<Label text="ENORME" y={280} size={165} delay={72}/>:<><Label text="VIVO" y={250} size={182} color={WHITE} delay={110}/><Label text={'Y LLENO DE\nDETALLES'} y={455} size={125} delay={124}/></>}
    <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:ease((f-122)/10)}}><circle cx="475" cy="1000" r="170" stroke={Y} strokeWidth="8" fill="none"/><path d="M595 1130L670 1210" stroke={Y} strokeWidth="13" strokeLinecap="round"/></svg>
    <Nico x={740} y={1160} width={270} delay={15}/><CaptionLine scene="world"/>
    <Credit light>Rockstar Games · imágenes del tráiler oficial</Credit>
  </AbsoluteFill>;
};
