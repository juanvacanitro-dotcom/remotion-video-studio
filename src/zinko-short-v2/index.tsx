import React from 'react';
import {AbsoluteFill,Composition,Folder,Sequence,registerRoot,staticFile,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Hook,Chaos,Crash,Bills,Reaction,Realism,Choice,YourCall,Ending} from './Scenes';
import {Captions,Brand,TransitionMarks,INK,useFonts} from './shared';

const ShortV2=()=>{
 useFonts();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:INK}}>
   <Sequence name="GTA6 o vida adulta" from={0} durationInFrames={72} premountFor={fps}><Hook/></Sequence>
   <Sequence name="Venías por el caos" from={72} durationInFrames={24} premountFor={fps}><Chaos/></Sequence>
   <Sequence name="El choque" from={96} durationInFrames={42} premountFor={fps}><Crash/></Sequence>
   <Sequence name="La lluvia de facturas" from={138} durationInFrames={48} premountFor={fps}><Bills/></Sequence>
   <Sequence name="El frenazo" from={186} durationInFrames={18} premountFor={fps}><Reaction/></Sequence>
   <Sequence name="Aprender la curva" from={204} durationInFrames={70} premountFor={fps}><Realism/></Sequence>
   <Sequence name="La pregunta" from={274} durationInFrames={36} premountFor={fps}><Choice/></Sequence>
   <Sequence name="Tú decides" from={310} durationInFrames={74} premountFor={fps}><YourCall/></Sequence>
   <Sequence name="Hacia el análisis" from={384} durationInFrames={84} premountFor={fps}><Ending/></Sequence>
   <TransitionMarks/><Brand/><Captions/>
   <Audio src={staticFile('zinko-short-v2/mix.wav')} premountFor={fps}/>
 </AbsoluteFill>;
};

const Root=()=> <>
 <Composition id="ZinkoShortV2" component={ShortV2} width={1080} height={1920} fps={30} durationInFrames={468}/>
 <Folder name="Escenas-V2">
   <Composition id="V2-Hook" component={Hook} width={1080} height={1920} fps={30} durationInFrames={72}/>
   <Composition id="V2-Caos" component={Chaos} width={1080} height={1920} fps={30} durationInFrames={24}/>
   <Composition id="V2-Choque" component={Crash} width={1080} height={1920} fps={30} durationInFrames={42}/>
   <Composition id="V2-Facturas" component={Bills} width={1080} height={1920} fps={30} durationInFrames={48}/>
   <Composition id="V2-Reaccion" component={Reaction} width={1080} height={1920} fps={30} durationInFrames={18}/>
   <Composition id="V2-Curva" component={Realism} width={1080} height={1920} fps={30} durationInFrames={70}/>
   <Composition id="V2-Eleccion" component={Choice} width={1080} height={1920} fps={30} durationInFrames={36}/>
   <Composition id="V2-Decides" component={YourCall} width={1080} height={1920} fps={30} durationInFrames={74}/>
   <Composition id="V2-Final" component={Ending} width={1080} height={1920} fps={30} durationInFrames={84}/>
 </Folder>
</>;
registerRoot(Root);
