import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import {useFonts} from '../zinko-short/shared';

const INK='#101026', WHITE='#fffef8', TEAL='#43eddb', PINK='#ff5ca8', ORANGE='#ffae66';
type Heading={at:number;lead:string;accent:string;color:string;size?:number};
type SceneProps={src:string;headings:Heading[];camera:'room'|'tunnel'|'rules'};

export function EditedScene({src,headings,camera}:SceneProps){
 useFonts();
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const h=[...headings].reverse().find(h=>f>=Math.round(h.at*fps))??headings[0];
 const age=f-Math.round(h.at*fps);
 const settle=spring({frame:Math.max(0,age)+3,fps,config:{stiffness:210,damping:18,mass:.7}});
 const first=camera==='room';
 const focus=first&&f>3.3*fps&&f<5.8*fps?'68% 55%':camera==='rules'?'45% 55%':'50% 55%';
 const zoom=first&&f>3.3*fps&&f<5.8*fps?1.015:1;
 const repairHeading=camera==='tunnel'&&f>=3.3*fps&&f<6.9*fps;
 const repairLabel=camera==='rules'&&f<3.65*fps;
 const impact=first&&f>=5.86*fps&&f<6.16*fps?Math.sin((f-5.86*fps)*2)*5*Math.exp(-(f-5.86*fps)*.22):0;
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
   <Video src={staticFile(src)} muted objectFit="cover" premountFor={fps} style={{width:1920,height:1080,scale:zoom+Math.sin(f*.018)*.001,transformOrigin:focus,translate:`${impact}px 0px`}}/>
   {/* Keep correct source lettering. Repair only the two generated artifacts. */}
   {repairHeading&&<>
     <div style={{position:'absolute',left:0,top:0,width:1920,height:296,background:`linear-gradient(${INK} 0%,${INK} 92%,${INK}00 100%)`}}/>
     <div style={{position:'absolute',left:0,top:260,width:470,height:85,background:`linear-gradient(${INK} 0%,${INK} 78%,${INK}00 100%)`}}/>
     <div style={{position:'absolute',left:110,top:62,width:1700,textAlign:'center',fontFamily:'ZinkoImpact',fontSize:150,lineHeight:1.18,letterSpacing:2,color:WHITE,WebkitTextStroke:`2px ${INK}`,paintOrder:'stroke fill',textShadow:`3px 4px 0 ${INK},5px 7px 0 ${INK},0 0 18px ${h.color}44`,rotate:'-1deg',scale:.94+.06*settle,translate:`0px ${(1-settle)*20}px`}}>
       {h.lead} <span style={{color:h.color}}>{h.accent}</span>
     </div>
   </>}
   {repairLabel&&<div style={{position:'absolute',left:0,top:0,width:660,height:158,background:INK,clipPath:'polygon(0 0,100% 0,97% 100%,0 100%)'}}>
     <div style={{position:'absolute',left:50,top:29,font:'65px ZinkoImpact',letterSpacing:6,color:TEAL,textShadow:`0 0 15px ${TEAL}55`}}>ZINKO</div>
     <div style={{position:'absolute',left:50,top:113,width:165,height:3,background:TEAL}}/>
   </div>}
   <div style={{position:'absolute',left:0,right:0,bottom:0,height:190,background:'linear-gradient(transparent,#080a1a77)'}}/>
 </AbsoluteFill>;
}

export const PortalScene=()=> <EditedScene src="zinko-entrar/escena-01.mp4" camera="room" headings={[
 {at:0,lead:'TÚ EN EL',accent:'SOFÁ',color:TEAL},
 {at:3.25,lead:'¡RUIDO',accent:'RARO!',color:PINK},
 {at:5.75,lead:'¡TE',accent:'SUCCIONA!',color:ORANGE},
]}/>;

export const ChallengeScene=()=> <EditedScene src="zinko-entrar/escena-02.mp4" camera="tunnel" headings={[
 {at:0,lead:'BIENVENIDO A',accent:'ZINKO',color:TEAL},
 {at:3.3,lead:'¿Y SI',accent:'ENTRARAS?',color:ORANGE},
 {at:6.9,lead:'24',accent:'HORAS',color:ORANGE,size:113},
]}/>;

export const RulesScene=()=> <EditedScene src="zinko-entrar/escena-03.mp4" camera="rules" headings={[
 {at:0,lead:'DATOS',accent:'REALES',color:TEAL},
 {at:3.5,lead:'MEDIDOR DE',accent:'SUPERVIVENCIA',color:ORANGE,size:91},
 {at:6.9,lead:'SOLO EN',accent:'EL JUEGO',color:PINK},
]}/>;

export function NeonJoin({style='swipe'}:{style?:'swipe'|'iris'}){
 const f=useCurrentFrame(),{durationInFrames}=useVideoConfig();
 const progress=Math.min(1,Math.max(0,f/(durationInFrames-1)));
 if(style==='iris'){
   const r=interpolate(progress,[0,.5,1],[1200,18,1200]);
   return <svg width={1920} height={1080} style={{position:'absolute',inset:0}}>
     <defs><mask id="iris-mask"><rect width={1920} height={1080} fill="white"/><circle cx={960} cy={540} r={r} fill="black"/></mask></defs>
     <rect width={1920} height={1080} fill={INK} mask="url(#iris-mask)"/>
     <circle cx={960} cy={540} r={r} fill="none" stroke={TEAL} strokeWidth={10}/>
     <circle cx={960} cy={540} r={r+16} fill="none" stroke={WHITE} strokeWidth={3}/>
     <circle cx={960} cy={540} r={r+32} fill="none" stroke={PINK} strokeWidth={5}/>
   </svg>;
 }
 const x=interpolate(progress,[0,1],[-750,2750]);
 return <svg width={1920} height={1080} style={{position:'absolute',inset:0}}>
   <defs><linearGradient id="sweep"><stop stopColor={INK} stopOpacity="0"/><stop offset=".4" stopColor={PINK}/><stop offset=".53" stopColor={WHITE}/><stop offset=".66" stopColor={TEAL}/><stop offset="1" stopColor={INK} stopOpacity="0"/></linearGradient></defs>
   <path d={`M${x-480} -50 L${x+180} -50 L${x-180} 1130 L${x-840} 1130 Z`} fill="url(#sweep)"/>
   <path d={`M${x-250} -50 L${x-610} 1130`} fill="none" stroke={WHITE} strokeWidth={7}/>
 </svg>;
}
