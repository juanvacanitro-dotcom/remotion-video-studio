import React from 'react';
import {AbsoluteFill,Sequence,useVideoConfig} from 'remotion';
import {Shot,Sticker,GameLogo,PINK,TEAL} from './FastShared';

export function FastPortal(){
 const {fps}=useVideoConfig();
 return <AbsoluteFill>
  <Sequence name="Impacto de entrada" from={0} trimBefore={0} durationInFrames={24} premountFor={fps}><Shot scene={1} start={0} zoom={1.15} endZoom={1.05} fx="shock"/></Sequence>
  <Sequence name="GTA: acercamiento a Nico" from={24} trimBefore={24} durationInFrames={20} premountFor={fps}><Shot scene={1} start={24} zoom={1.42} endZoom={1.46} cx={1150} cy={620} tilt={-1}/></Sequence>
  <Sequence name="Sofá: salto de encuadre" from={44} trimBefore={44} durationInFrames={21} premountFor={fps}><Shot scene={1} start={44} zoom={1.09} endZoom={1.14} cx={1040} cy={570}/></Sequence>
  <Sequence name="Corte al televisor" from={65} trimBefore={65} durationInFrames={17} premountFor={fps}><Shot scene={1} start={65} zoom={1.48} endZoom={1.54} cx={710} cy={600} fx="glitch"/></Sequence>
  <Sequence name="Ruido: reacción" from={82} trimBefore={82} durationInFrames={23} premountFor={fps}><Shot scene={1} start={82} zoom={1.32} endZoom={1.38} cx={1240} cy={570}/></Sequence>
  <Sequence name="Ruido: interferencia" from={105} trimBefore={105} durationInFrames={17} premountFor={fps}><Shot scene={1} start={105} zoom={1.23} endZoom={1.29} cx={820} cy={560} tilt={1} fx="glitch"/></Sequence>
  <Sequence name="Ay no: golpe de cámara" from={122} trimBefore={122} durationInFrames={21} premountFor={fps}><Shot scene={1} start={122} zoom={1.42} endZoom={1.38} cx={1270} cy={580} tilt={-1.4} fx="shock"/></Sequence>
  <Sequence name="Succión: plano general" from={143} trimBefore={143} durationInFrames={27} premountFor={fps}><Shot scene={1} start={143} zoom={1.08} endZoom={1.16} cx={1030} cy={550} fx="rush"/></Sequence>
  <Sequence name="Dentro del juego: empuje" from={170} trimBefore={170} durationInFrames={32} premountFor={fps}><Shot scene={1} start={170} zoom={1.23} endZoom={1.36} cx={1030} cy={560} fx="rush"/></Sequence>
  <Sequence name="Portal: rampa de velocidad" from={202} trimBefore={202} durationInFrames={9} premountFor={fps}><Shot scene={1} start={202} zoom={1.25} endZoom={1.7} cx={770} cy={590} fx="rush"/></Sequence>
  <Sequence name="Logo al decir GTA 6" from={27} durationInFrames={17} premountFor={fps}><GameLogo/></Sequence>
  <Sequence name="Chispa del televisor" from={65} durationInFrames={17} premountFor={fps}><Sticker text="BZZT!" x={1110} y={260} color={TEAL} size={150}/></Sequence>
  <Sequence name="Golpe de reacción" from={122} durationInFrames={21} premountFor={fps}><Sticker text="¡NO!" x={170} y={300} color={PINK} size={230} angle={-12}/></Sequence>
 </AbsoluteFill>;
}
