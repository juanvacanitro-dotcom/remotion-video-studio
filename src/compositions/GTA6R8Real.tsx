import React from 'react';
import {AbsoluteFill, Audio, Sequence, Video, staticFile, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const shots=[
 {file:'clip-01.mp4',label:'EL JUEGO MÁS ESPERADO',sub:'13 AÑOS DE ESPERA',accent:'#ffd52a'},
 {file:'clip-02.mp4',label:'GTA VI',sub:'LA EXPECTATIVA ES ENORME',accent:'#42e6df'},
 {file:'clip-03.mp4',label:'¿ÉXITO O DECEPCIÓN?',sub:'PRONTO LO SABREMOS',accent:'#ff55b7'}
];
const Caption:React.FC<{label:string;sub:string;accent:string}> = ({label,sub,accent})=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const inY=interpolate(f,[0,12],[80,0],{extrapolateRight:'clamp'});
 const opacity=interpolate(f,[0,8, fps*9-8,fps*10],[0,1,1,0],{extrapolateRight:'clamp'});
 const words=label.split(' ');
 return <AbsoluteFill style={{justifyContent:'flex-end',padding:'0 90px 105px',opacity,transform:`translateY(${inY}px)`}}>
  <div style={{display:'flex',gap:18,flexWrap:'wrap',alignItems:'baseline'}}>
   {words.map((w,i)=><span key={i} style={{fontSize:96,fontWeight:1000,letterSpacing:-5,color:i===words.length-1?accent:'#fff',WebkitTextStroke:'3px #090a12',paintOrder:'stroke fill',textShadow:'0 8px 0 #080912,0 12px 28px #000'}}>{w}</span>)}
  </div>
  <div style={{marginTop:18,fontSize:32,fontWeight:900,letterSpacing:5,color:'#ffd52a',textShadow:'3px 3px #05060b,-2px -2px #05060b,2px -2px #05060b,-2px 2px #05060b'}}>{sub}</div>
 </AbsoluteFill>;
};
const Shot:React.FC<{file:string;label:string;sub:string;accent:string;index:number}> = p=>{
 const f=useCurrentFrame(); const scale=interpolate(f,[0,300],[1,1.14],{extrapolateRight:'clamp'});
 const drift=interpolate(f,[0,300],[-18,18],{extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:'#080a12'}}>
  <Video src={staticFile(p.file)} muted={false} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${scale}) translateX(${drift}px)`}} />
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(3,5,12,.2),transparent 36%,rgba(3,5,12,.1) 58%,rgba(3,5,12,.78))'}}/>
  <div style={{position:'absolute',top:48,left:70,right:70,display:'flex',justifyContent:'space-between',fontSize:18,fontWeight:900,letterSpacing:6,color:'#fff',textShadow:'0 2px 8px #000'}}><span>ZINKO / GTA VI</span><span>R8 · {String(p.index+1).padStart(2,'0')}</span></div>
  <Caption label={p.label} sub={p.sub} accent={p.accent}/>
  <div style={{position:'absolute',left:70,right:70,bottom:45,height:5,background:'rgba(255,255,255,.25)'}}><div style={{height:'100%',width:`${(f/300)*100}%`,background:p.accent}}/></div>
 </AbsoluteFill>;
};
export const GTA6R8Real:React.FC=()=>{
 return <AbsoluteFill style={{background:'#080a12'}}>
 {shots.map((s,i)=><Sequence key={s.file} from={i*300} durationInFrames={300}><Shot {...s} index={i}/></Sequence>)}
 </AbsoluteFill>;
};
