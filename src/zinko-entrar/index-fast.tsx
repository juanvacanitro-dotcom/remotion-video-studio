import React from 'react';
import {AbsoluteFill,Composition,Folder,Sequence,registerRoot,staticFile,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {FastPortal} from './FastPortal';
import {FastChallenge} from './FastChallenge';
import {FastRules} from './FastRules';
import {WhipJoin,INK} from './FastShared';

export function DynamicAdvance(){
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:INK}}>
  <Sequence name="01 - Sofá, ruido, succión" from={0} durationInFrames={211} premountFor={fps}><FastPortal/></Sequence>
  <Sequence name="02 - Bienvenida y 24 horas" from={211} durationInFrames={233} premountFor={fps}><FastChallenge/></Sequence>
  <Sequence name="03 - Tres reglas" from={444} durationInFrames={231} premountFor={fps}><FastRules/></Sequence>
  <Sequence name="Cruzar el portal" from={207} durationInFrames={9} premountFor={fps}><WhipJoin kind="portal"/></Sequence>
  <Sequence name="Golpe hacia las reglas" from={440} durationInFrames={9} premountFor={fps}><WhipJoin/></Sequence>
  <Audio src={staticFile('zinko-entrar/fast-mix.wav')} premountFor={fps}/>
 </AbsoluteFill>;
}
const Root=()=> <>
 <Composition id="ZinkoEntrarV2Dinamico" component={DynamicAdvance} width={1920} height={1080} fps={30} durationInFrames={675}/>
 <Folder name="Entrar-V2-Escenas">
  <Composition id="V2-Portal" component={FastPortal} width={1920} height={1080} fps={30} durationInFrames={211}/>
  <Composition id="V2-Reto" component={FastChallenge} width={1920} height={1080} fps={30} durationInFrames={233}/>
  <Composition id="V2-Reglas" component={FastRules} width={1920} height={1080} fps={30} durationInFrames={231}/>
 </Folder>
</>;
registerRoot(Root);
