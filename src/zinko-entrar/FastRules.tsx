import React from 'react';
import {AbsoluteFill,Sequence,useVideoConfig} from 'remotion';
import {Shot,RuleSlam,Sticker,WhipJoin,TEAL,PINK} from './FastShared';

export function FastRules(){
 const {fps}=useVideoConfig();
 return <AbsoluteFill>
  <Sequence name="Regla 1: entrada" from={0} trimBefore={0} durationInFrames={24} premountFor={fps}><Shot scene={3} start={0} zoom={1.07} endZoom={1.11} fx="shock"/></Sequence>
  <Sequence name="Datos: Nico" from={24} trimBefore={24} durationInFrames={29} premountFor={fps}><Shot scene={3} start={24} zoom={1.25} endZoom={1.31} cx={790} cy={610}/></Sequence>
  <Sequence name="Guías: detalle" from={53} trimBefore={53} durationInFrames={30} premountFor={fps}><Shot scene={3} start={53} zoom={1.3} endZoom={1.36} cx={1120} cy={590} tilt={-.8}/></Sequence>
  <Sequence name="Regla 2: cambio de plano" from={83} trimBefore={83} durationInFrames={20} premountFor={fps}><Shot scene={3} start={83} zoom={1.08} endZoom={1.13} fx="shock"/></Sequence>
  <Sequence name="Aro: detalle" from={103} trimBefore={103} durationInFrames={29} premountFor={fps}><Shot scene={3} start={103} zoom={1.38} endZoom={1.43} cx={730} cy={520}/></Sequence>
  <Sequence name="Supervivencia: reacción" from={132} trimBefore={132} durationInFrames={36} premountFor={fps}><Shot scene={3} start={132} zoom={1.3} endZoom={1.38} cx={1100} cy={650}/></Sequence>
  <Sequence name="Regla 3: golpe" from={168} trimBefore={168} durationInFrames={19} premountFor={fps}><Shot scene={3} start={168} zoom={1.10} endZoom={1.17} fx="shock"/></Sequence>
  <Sequence name="No intentes esto: corte" from={187} trimBefore={187} durationInFrames={21} premountFor={fps}><Shot scene={3} start={187} zoom={1.40} endZoom={1.35} cx={1060} cy={620} tilt={-1.2} fx="glitch"/></Sequence>
  <Sequence name="Vida real: remate" from={208} trimBefore={208} durationInFrames={23} premountFor={fps}><Shot scene={3} start={208} zoom={1.17} endZoom={1.22} cx={1000} cy={570}/></Sequence>
  <Sequence name="Número 1" from={0} durationInFrames={24} premountFor={fps}><RuleSlam n={1} color={TEAL}/></Sequence>
  <Sequence name="Número 2" from={83} durationInFrames={20} premountFor={fps}><RuleSlam n={2} color={PINK}/></Sequence>
  <Sequence name="Número 3" from={168} durationInFrames={19} premountFor={fps}><RuleSlam n={3} color="#ffae66"/></Sequence>
  <Sequence name="Barrido a la tercera regla" from={165} durationInFrames={7} premountFor={fps}><WhipJoin/></Sequence>
  <Sequence name="Sello solo en el juego" from={187} durationInFrames={44} premountFor={fps}><Sticker text={'SOLO EN\nEL JUEGO'} x={130} y={330} color={PINK} size={115} angle={-7}/></Sequence>
 </AbsoluteFill>;
}
