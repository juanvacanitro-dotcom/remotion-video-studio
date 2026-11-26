import React from 'react';
import {AbsoluteFill,Sequence,useVideoConfig} from 'remotion';
import {Shot,GameLogo,ClockSlam,WhipJoin} from './FastShared';

export function FastChallenge(){
 const {fps}=useVideoConfig();
 return <AbsoluteFill>
  <Sequence name="Zinko: salida del portal" from={0} trimBefore={0} durationInFrames={35} premountFor={fps}><Shot scene={2} start={0} zoom={1.16} endZoom={1.02} fx="rush"/></Sequence>
  <Sequence name="Curiosidad: acercamiento" from={35} trimBefore={35} durationInFrames={46} premountFor={fps}><Shot scene={2} start={35} zoom={1.28} endZoom={1.43} cx={980} cy={610} tilt={-1}/></Sequence>
  <Sequence name="Pregunta: vuelta al general" from={81} trimBefore={81} durationInFrames={27} premountFor={fps}><Shot scene={2} start={81} zoom={1.04} endZoom={1.08} fx="shock"/></Sequence>
  <Sequence name="Y si entraras: primer plano" from={108} trimBefore={108} durationInFrames={33} premountFor={fps}><Shot scene={2} start={108} zoom={1.3} endZoom={1.37} cx={1030} cy={620}/></Sequence>
  <Sequence name="GTA 6: golpe de logo" from={141} trimBefore={141} durationInFrames={30} premountFor={fps}><Shot scene={2} start={141} zoom={1.4} endZoom={1.34} cx={1010} cy={610} tilt={1.3}/></Sequence>
  <Sequence name="24 horas: golpe de reloj" from={171} trimBefore={171} durationInFrames={29} premountFor={fps}><Shot scene={2} start={171} zoom={1.35} endZoom={1.41} cx={1080} cy={630} fx="shock"/></Sequence>
  <Sequence name="Sobrevivir: acercamiento final" from={200} trimBefore={200} durationInFrames={33} premountFor={fps}><Shot scene={2} start={200} zoom={1.43} endZoom={1.50} cx={1110} cy={630} fx="rush"/></Sequence>
  <Sequence name="Barrido hacia la pregunta" from={78} durationInFrames={8} premountFor={fps}><WhipJoin/></Sequence>
  <Sequence name="Logo GTA 6" from={141} durationInFrames={30} premountFor={fps}><GameLogo/></Sequence>
  <Sequence name="Reto de 24 horas" from={171} durationInFrames={62} premountFor={fps}><ClockSlam/></Sequence>
 </AbsoluteFill>;
}
