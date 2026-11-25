import React from 'react';
import {AbsoluteFill, CanvasImage, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import {Punch,Paper,Character,FullVideo,Burst,SpeedLines,Y,INK,W,ORANGE,GREEN,useFonts,pop,jolt,clamp} from './shared';

export const Hook=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill style={{overflow:'hidden'}}>
   <FullVideo src="zinko-completo/chase.mp4" trim={.45} rate={1.25} shade={.50}/>
   <SpeedLines/>
   <CanvasImage src={staticFile('zinko-proof/gta-logo.webp')} style={{position:'absolute',left:670,top:180,width:260,rotate:`${10+Math.sin(f*.12)*4}deg`,scale:pop(f),filter:'drop-shadow(9px 14px 0 #15121b)'}}/>
   <Punch top={380} size={258} color={W} angle={-7}>¿GTA 6…</Punch>
   <div style={{position:'absolute',left:-60,top:710,width:1180,height:375,background:Y,rotate:'-7deg',scale:pop(f-25),opacity:f>=25?1:0,boxShadow:`15px 20px 0 ${INK}`}}/>
   <Punch top={710} size={162} color={W} angle={-7} delay={25}>{'O VIDA\nADULTA?'}</Punch>
   <Character x={760} y={1065} width={245} delay={41} angle={6}/>
   <Burst x={500} y={850} delay={25}/>
 </AbsoluteFill>;
};

export const Chaos=()=>{
 useFonts();return <AbsoluteFill style={{overflow:'hidden'}}>
   <FullVideo src="zinko-full/action.mp4" rate={1.65} shade={.36}/><SpeedLines/>
   <Punch top={300} size={104} color={W} angle={5}>TÚ QUERÍAS…</Punch>
   <Punch top={620} size={275} angle={-7} delay={7}>CAOS</Punch>
   <Character pose="happy" x={500} y={1000} width={620} delay={3} angle={-8}/>
   <Burst x={520} y={790} delay={7}/>
 </AbsoluteFill>;
};

export const Crash=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill style={{overflow:'hidden'}}><Paper/>
   <div style={{position:'absolute',left:-50,top:360,width:1200,height:850,background:ORANGE,rotate:'-8deg'}}/>
   <Punch top={245} size={193} color={W} angle={-5}>1 CHOQUE</Punch>
   <div style={{position:'absolute',left:95+jolt(f)*2,top:610,width:840,height:500,background:W,padding:14,rotate:`${-7+Math.sin(f*.8)*Math.exp(-f*.14)*6}deg`,scale:1.06+Math.max(0,12-f)*.015,boxShadow:`18px 20px 0 ${INK}`}}>
     <CanvasImage src={staticFile('zinko-completo/car.webp')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
     <svg width={840} height={500} style={{position:'absolute',left:0,top:0}}><path d="M525 20 L470 135 L570 200 L490 265 L600 345 L555 500 M570 200 L685 180 L770 215 M490 265 L360 275 L310 380" stroke={W} strokeWidth={8} fill="none"/></svg>
   </div>
   <Burst x={630} y={890} color={W}/>
   <Punch top={1170} size={128} color={Y} angle={7} delay={22}>AL TALLER</Punch>
 </AbsoluteFill>;
};

const Receipt=({title,sub,delay,x,y,angle}:{title:string;sub:string;delay:number;x:number;y:number;angle:number})=>{
 const f=useCurrentFrame()-delay;
 if(f<0)return null;
 return <div style={{position:'absolute',left:x,top:y,width:650,height:345,padding:'38px 45px',boxSizing:'border-box',background:W,color:INK,rotate:`${angle}deg`,scale:pop(f),translate:`${(1-pop(f))*700}px 0px`,boxShadow:'14px 18px 0 #15121b55',clipPath:'polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)'}}>
   <div style={{font:'128px ZinkoImpact',lineHeight:1}}>{title}</div>
   <div style={{borderTop:`5px dashed ${INK}`,marginTop:22,paddingTop:16,font:'54px ZinkoImpact',letterSpacing:2}}>{sub}</div>
 </div>;
};
export const Bills=()=>{
 useFonts();return <AbsoluteFill style={{overflow:'hidden',background:Y}}>
   <Punch top={245} size={139} color={W} angle={-5}>VIDA ADULTA:</Punch>
   <Receipt title="TALLER" sub="POR PAGAR" delay={0} x={100} y={470} angle={-11}/>
   <Receipt title="GASTOS" sub="OTRA VEZ…" delay={13} x={210} y={735} angle={9}/>
   <Receipt title="TAREAS" sub="PENDIENTES" delay={27} x={90} y={990} angle={-5}/>
   <Character x={850} y={1100} width={218} delay={31} angle={13}/>
   <Burst x={500} y={1000} color={ORANGE} delay={27}/>
 </AbsoluteFill>;
};

export const Reaction=()=>{
 useFonts();const f=useCurrentFrame(),{fps}=useVideoConfig();
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
   <Video src={staticFile('zinko-full/shock.mp4')} trimBefore={Math.round(.3*fps)} muted objectFit="cover" premountFor={fps} style={{position:'absolute',left:0,top:390,width:1080,height:1020,scale:1.05+f*.025,translate:`${jolt(f)}px 0px`}}/>
   <SpeedLines/><Punch top={240} size={158} color={W} angle={6}>¿PERDÓN?</Punch>
   <Punch top={1220} size={125} angle={-5} delay={6}>…BRO.</Punch>
 </AbsoluteFill>;
};

export const Realism=()=>{
 useFonts();const f=useCurrentFrame();
 const t=clamp(f/55),cx=110+660*t,cy=1120-290*Math.sin(t*Math.PI);
 return <AbsoluteFill style={{overflow:'hidden'}}><Paper/>
   <Punch top={275} size={123} color={W} angle={-5}>{'CURVA DE'}</Punch>
   <Punch top={430} size={119} color={Y} delay={5}>APRENDIZAJE</Punch>
   <div style={{position:'absolute',left:70,top:670,width:890,height:600,rotate:'4deg',background:INK,overflow:'hidden',border:`14px solid ${W}`,boxShadow:`12px 16px 0 ${INK}`}}>
     <CanvasImage src={staticFile('zinko-completo/city.webp')} style={{width:'100%',height:'100%',objectFit:'cover',opacity:.45,scale:1.05}}/>
   </div>
   <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
     <path d="M80 1230 Q220 650 490 1000 Q730 1450 940 750" fill="none" stroke={INK} strokeWidth={90}/>
     <path d="M80 1230 Q220 650 490 1000 Q730 1450 940 750" fill="none" stroke={Y} strokeWidth={10} strokeDasharray="32 22" strokeDashoffset={-f*10}/>
   </svg>
   <div style={{position:'absolute',left:cx-80,top:cy-100,width:290,height:180,padding:8,background:W,boxShadow:`7px 9px 0 ${INK}`,rotate:`${-15+Math.cos(t*Math.PI)*20}deg`}}>
     <CanvasImage src={staticFile('zinko-completo/car.webp')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
   </div>
   <Character x={835} y={1040} width={225} delay={24} angle={6}/>
 </AbsoluteFill>;
};

export const Choice=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
   <div style={{position:'absolute',inset:0,background:Y,clipPath:'polygon(0 0,100% 0,100% 47%,0 62%)'}}/>
   <Punch top={435} size={163} color={W} angle={-7}>¿REALISMO</Punch>
   <Punch top={775} size={138} color={W} angle={7} delay={8}>O</Punch>
   <Punch top={1030} size={185} color={ORANGE} angle={-5} delay={15}>CASTIGO?</Punch>
   <Burst x={510} y={1180} color={ORANGE} delay={15}/>
   <div style={{position:'absolute',left:40,top:1290,width:920,height:9,background:W,scale:`${clamp((f-20)/5)} 1`,rotate:'-5deg'}}/>
 </AbsoluteFill>;
};

export const YourCall=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill style={{overflow:'hidden'}}>
   {f<34?<>
     <FullVideo src="zinko-completo/together.mp4" shade={.35}/>
     <Punch top={370} size={188} color={GREEN} angle={-7}>¿TE SUMA?</Punch>
     <Character pose="happy" x={490} y={860} width={620} angle={-6}/>
   </>:<>
     <Paper/>
     <div style={{position:'absolute',left:-40,top:350,width:1170,height:440,background:ORANGE,rotate:'6deg'}}/>
     <Punch top={400} size={170} color={W} angle={6} delay={34}>{'¿O TE\nSOBRA?'}</Punch>
     <Character x={500} y={820} width={410} delay={34} angle={8}/>
     <Burst x={520} y={1000} delay={34}/>
   </>}
 </AbsoluteFill>;
};

export const Ending=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill style={{overflow:'hidden',background:INK}}>
   <CanvasImage src={staticFile('zinko-completo/city.webp')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.40,scale:1.05+f*.001}}/>
   <Punch top={240} size={118} color={W} angle={-5}>MI ANÁLISIS</Punch>
   <Punch top={385} size={154} color={Y} angle={-5} delay={4}>COMPLETO</Punch>
   <div style={{position:'absolute',left:105,top:650,width:800,height:460,padding:13,background:W,rotate:`${-5+Math.sin(f*.06)}deg`,scale:pop(f),boxShadow:`16px 19px 0 ${Y}`,overflow:'hidden'}}>
     <CanvasImage src={staticFile('zinko-completo/lock.webp')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
     <div style={{position:'absolute',left:35,right:35,top:130,padding:'22px 0',background:INK,color:W,font:'100px ZinkoImpact',textAlign:'center',rotate:'5deg'}}>MI VEREDICTO</div>
     <div style={{position:'absolute',left:190,right:100,top:280,padding:13,background:Y,color:INK,font:'58px ZinkoImpact',textAlign:'center',rotate:'-3deg',scale:pop(f-16),opacity:f>=16?1:0}}>ESTÁ EN EL LARGO</div>
   </div>
   <Punch top={1200} size={71} color={W} angle={-3} delay={16}>{'TOCA EL VÍDEO\nRELACIONADO'}</Punch>
   <svg width={1080} height={1920} style={{position:'absolute',inset:0}}><path d="M145 1360 Q70 1520 170 1660 M125 1635 L175 1670 L190 1610" stroke={Y} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="450" strokeDashoffset={450*(1-clamp((f-22)/10))}/></svg>
   <Character pose="happy" x={840} y={1280} width={175} delay={18} angle={8}/>
   <Burst x={500} y={900} delay={0}/>
 </AbsoluteFill>;
};
