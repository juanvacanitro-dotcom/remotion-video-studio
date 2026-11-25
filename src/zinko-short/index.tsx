import React from 'react';
import {AbsoluteFill,Composition,Folder,registerRoot,staticFile,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {Hook} from './Hook';
import {World} from './World';
import {Twist} from './Twist';
import {Fps} from './Fps';
import {Paradox} from './Paradox';
import {Question} from './Question';
import {CallToAction} from './CallToAction';
import {Swipe,INK} from './shared';

const ZinkoShort=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:INK}}>
   <TransitionSeries>
     <TransitionSeries.Sequence name="La nota que abre la pregunta" durationInFrames={86} premountFor={fps}><Hook/></TransitionSeries.Sequence>
     <TransitionSeries.Overlay durationInFrames={8} premountFor={fps}><Swipe/></TransitionSeries.Overlay>
     <TransitionSeries.Sequence name="Una razón para el entusiasmo" durationInFrames={177} premountFor={fps}><World/></TransitionSeries.Sequence>
     <TransitionSeries.Overlay durationInFrames={10} premountFor={fps}><Swipe paper/></TransitionSeries.Overlay>
     <TransitionSeries.Sequence name="El giro" durationInFrames={65} premountFor={fps}><Twist/></TransitionSeries.Sequence>
     <TransitionSeries.Sequence name="Una pega concreta" durationInFrames={180} premountFor={fps}><Fps/></TransitionSeries.Sequence>
     <TransitionSeries.Sequence name="La contradicción abierta" durationInFrames={79} premountFor={fps}><Paradox/></TransitionSeries.Sequence>
     <TransitionSeries.Overlay durationInFrames={8} premountFor={fps}><Swipe paper/></TransitionSeries.Overlay>
     <TransitionSeries.Sequence name="La pregunta al espectador" durationInFrames={88} premountFor={fps}><Question/></TransitionSeries.Sequence>
     <TransitionSeries.Sequence name="El veredicto está en el largo" durationInFrames={120} premountFor={fps}><CallToAction/></TransitionSeries.Sequence>
   </TransitionSeries>
   <Audio src={staticFile('zinko-short/voice.wav')} premountFor={fps}/>
 </AbsoluteFill>;
};
const Root=()=> <>
 <Composition id="ZinkoShortTeaser" component={ZinkoShort} width={1080} height={1920} fps={30} durationInFrames={795}/>
 <Folder name="Escenas-Short">
   <Composition id="Gancho" component={Hook} width={1080} height={1920} fps={30} durationInFrames={86}/>
   <Composition id="Mundo" component={World} width={1080} height={1920} fps={30} durationInFrames={177}/>
   <Composition id="Giro" component={Twist} width={1080} height={1920} fps={30} durationInFrames={65}/>
   <Composition id="Pega" component={Fps} width={1080} height={1920} fps={30} durationInFrames={180}/>
   <Composition id="Contraste" component={Paradox} width={1080} height={1920} fps={30} durationInFrames={79}/>
   <Composition id="Pregunta" component={Question} width={1080} height={1920} fps={30} durationInFrames={88}/>
   <Composition id="Cierre" component={CallToAction} width={1080} height={1920} fps={30} durationInFrames={120}/>
 </Folder>
</>;
registerRoot(Root);
