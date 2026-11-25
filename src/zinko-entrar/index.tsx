import React from 'react';
import {AbsoluteFill,Composition,Folder,Sequence,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {PortalScene,ChallengeScene,RulesScene,NeonJoin} from './Scene';
import {useFonts} from '../zinko-short/shared';
import captions from './captions.json';

function Captions(){
 useFonts();const f=useCurrentFrame(),{fps}=useVideoConfig();
 const cue=captions.find(c=>f/fps*1000>=c.startMs&&f/fps*1000<c.endMs);
 if(!cue)return null;
 return <div style={{position:'absolute',left:150,top:926,width:1620,fontFamily:'ZinkoCaption',fontSize:73,lineHeight:1.08,textAlign:'center',color:'#ffeb1d',WebkitTextStroke:'5px #15121b',paintOrder:'stroke fill',textShadow:'2px 5px 0 #15121b,0 5px 10px #0009'}}>{cue.text}</div>;
}

export function FirstThree(){
 useFonts();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#101026'}}>
   <Sequence name="01 - El televisor te absorbe" from={0} durationInFrames={10*fps} premountFor={fps}><PortalScene/></Sequence>
   <Sequence name="02 - Bienvenida y reto" from={10*fps} durationInFrames={10*fps} premountFor={fps}><ChallengeScene/></Sequence>
   <Sequence name="03 - Las reglas" from={20*fps} durationInFrames={10*fps} premountFor={fps}><RulesScene/></Sequence>
   <Sequence name="Entrada al túnel" from={Math.round(9.78*fps)} durationInFrames={Math.round(.44*fps)} premountFor={fps}><NeonJoin/></Sequence>
   <Sequence name="Círculo hacia las reglas" from={Math.round(19.78*fps)} durationInFrames={Math.round(.44*fps)} premountFor={fps}><NeonJoin style="iris"/></Sequence>
   <Audio src={staticFile('zinko-entrar/mix.wav')} premountFor={fps}/>
   <Captions/>
 </AbsoluteFill>;
}

const Root=()=> <>
 <Composition id="ZinkoEntrarAvance01" component={FirstThree} width={1920} height={1080} fps={30} durationInFrames={900}/>
 <Folder name="Entrar-GTA6-Escenas">
   <Composition id="Entrar-01-Portal" component={PortalScene} width={1920} height={1080} fps={30} durationInFrames={300}/>
   <Composition id="Entrar-02-Reto" component={ChallengeScene} width={1920} height={1080} fps={30} durationInFrames={300}/>
   <Composition id="Entrar-03-Reglas" component={RulesScene} width={1920} height={1080} fps={30} durationInFrames={300}/>
 </Folder>
</>;
registerRoot(Root);
