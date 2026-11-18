import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

const C={yellow:'#ffd52a',pink:'#ff4fa3',teal:'#39ddd8',white:'#fff',black:'#080914'};
const scenes=[
 {frames:338,voice:'voice-1.wav',clip:'source-01.mp4',bg:'Sala-Gamer.jpg',headline:['EL JUEGO MÁS','ESPERADO'],accent:C.yellow,tag:'13 AÑOS DE ESPERA'},
 {frames:312,voice:'voice-2.wav',clip:'source-02.mp4',bg:'Sala-Gamer.jpg',headline:['BIENVENIDO A','ZINKO'],accent:C.pink,tag:'EL CANAL DE LA CURIOSIDAD'},
 {frames:306,voice:'voice-3.wav',clip:'source-03.mp4',bg:'Ciudad-Neon.jpg',headline:['¿QUÉ ES','GTA VI?'],accent:C.teal,tag:'Y CUÁNDO LLEGA'},
 {frames:337,voice:'voice-4.wav',clip:'source-01.mp4',bg:'Escenario-Datos.jpg',headline:['TODO EMPEZÓ','CON GTA V'],accent:C.yellow,tag:'EL JUEGO QUE LO CAMBIÓ TODO'}
];
const starts=scenes.map((_,i)=>scenes.slice(0,i).reduce((a,s)=>a+s.frames,0));
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};

const TextPop:React.FC<{children:React.ReactNode;delay?:number;accent?:string;size?:number}> = ({children,delay=0,accent=C.yellow,size=92})=>{
 const f=useCurrentFrame();
 const p=interpolate(f,[delay,delay+12],[0,1],{...clamp,easing:Easing.out(Easing.back(1.2))});
 return <div style={{fontSize:size,fontWeight:1000,lineHeight:.96,letterSpacing:-3,color:C.white,WebkitTextStroke:'3px #080914',paintOrder:'stroke fill',textShadow:'5px 6px 0 #080914,0 10px 24px rgba(0,0,0,.65)',transform:`translateY(${(1-p)*55}px) rotate(-2deg) scale(${.92+p*.08})`,opacity:p}}>
  {children}
  <span style={{color:accent,marginLeft:10}}>{''}</span>
 </div>
};

const NicoSticker:React.FC<{delay?:number;right?:number;bottom?:number;scale?:number}> = ({delay=0,right=100,bottom=90,scale=1})=>{
 const f=useCurrentFrame();
 const p=interpolate(f,[delay,delay+15],[0,1],clamp);
 const bob=Math.sin((f-delay)/8)*9;
 return <div style={{position:'absolute',right,bottom,transform:`translateY(${(1-p)*180+bob}px) rotate(${Math.sin(f/13)*3}deg) scale(${scale*p})`,opacity:p,filter:'drop-shadow(0 12px 12px rgba(0,0,0,.5))'}}>
  <Img src={staticFile('assets/Nico.jpg')} style={{width:300,height:400,objectFit:'contain',mixBlendMode:'screen'}}/>
 </div>
};

const DynamicScene:React.FC<{scene:number}> = ({scene})=>{
 const s=scenes[scene],f=useCurrentFrame(),{fps}=useVideoConfig();
 const zoom=interpolate(f,[0,s.frames],[1.08,1.22],clamp);
 const pan=interpolate(f,[0,s.frames],[-18,22],clamp);
 const pulse=1+Math.sin(f/7)*.025;
 const beat=Math.floor(f/42)%3;
 const accent=s.accent;
 return <AbsoluteFill style={{background:C.black,overflow:'hidden',fontFamily:'Arial,Helvetica,sans-serif'}}>
  <OffthreadVideo src={staticFile('media/'+s.clip)} muted startFrom={scene*15} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:`scale(${zoom}) translateX(${pan}px)`,filter:'saturate(1.15) contrast(1.08)'}}/>
  <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(4,5,14,.62),rgba(4,5,14,.08) 68%),linear-gradient(0deg,rgba(4,5,14,.75),transparent 62%)'}}/>
  <Img src={staticFile('assets/'+s.bg)} style={{position:'absolute',right:0,top:0,width:'40%',height:'100%',objectFit:'cover',opacity:.24,mixBlendMode:'screen',transform:`scale(${pulse})`}}/>
  <div style={{position:'absolute',top:44,left:65,right:65,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:17,fontWeight:1000,letterSpacing:5,color:C.white,textShadow:'0 3px 10px #000'}}>
   <span>ZINKO <span style={{color:C.yellow}}>●</span></span><span>GTA VI / ESPECIAL</span>
  </div>
  <div style={{position:'absolute',top:91,left:65,right:65,height:3,background:`linear-gradient(90deg,${C.yellow},${C.pink},transparent)`,boxShadow:'0 0 14px '+accent}}/>
  <div style={{position:'absolute',left:100,top:250,transform:`translateX(${interpolate(f,[0,14],[-90,0],clamp)}px) rotate(-2deg)`}}>
   <TextPop delay={0} accent={accent} size={scene===2?112:96}>{s.headline[0]}</TextPop>
   <div style={{marginTop:8}}><TextPop delay={9} accent={accent} size={scene===1?140:112}>{s.headline[1]}</TextPop></div>
   <div style={{display:'inline-block',marginTop:28,padding:'10px 18px',background:accent,color:C.black,fontSize:25,fontWeight:1000,letterSpacing:3,transform:`skewX(-8deg) translateY(${Math.sin(f/6)*3}px)`,boxShadow:'7px 7px 0 #080914'}}>{s.tag}</div>
  </div>
  <NicoSticker delay={scene===0?18:scene===1?12:scene===2?25:16} right={scene===2?130:90} bottom={scene===1?65:60} scale={scene===2?.9:1}/>
  {scene===0&&<div style={{position:'absolute',right:430,top:190,width:175,height:175,border:'7px solid '+C.pink,borderRadius:'50%',boxShadow:'0 0 30px '+C.pink,transform:`rotate(${f*1.5}deg) scale(${.9+Math.sin(f/8)*.04})`}}><div style={{position:'absolute',inset:24,border:'5px dashed '+C.white,borderRadius:'50%'}}/></div>}
  {scene===1&&<div style={{position:'absolute',right:440,top:210,display:'flex',gap:18,transform:`translateY(${Math.sin(f/8)*8}px)`}}>{[C.pink,C.teal].map((v,i)=><div key={i} style={{width:92,height:92,border:'6px solid '+v,borderRadius:'50%',boxShadow:'0 0 22px '+v,background:'rgba(8,9,20,.55)'}}/>)}</div>}
  {scene===2&&<div style={{position:'absolute',right:390,top:190,transform:`rotate(${Math.sin(f/8)*4}deg)`,background:C.yellow,color:C.black,padding:'12px 24px',fontSize:24,fontWeight:1000,boxShadow:'7px 7px 0 #080914'}}>NOV · 2026</div>}
  {scene===3&&<div style={{position:'absolute',right:410,top:200,background:C.pink,color:C.white,padding:'15px 24px',fontSize:28,fontWeight:1000,transform:`rotate(${Math.sin(f/10)*3-4}deg)`,boxShadow:'7px 7px 0 #080914'}}>225 MILLONES+</div>}
  <div style={{position:'absolute',left:65,right:65,bottom:28,height:5,background:'rgba(255,255,255,.2)'}}><div style={{height:5,width:(f/s.frames*100)+'%',background:accent,boxShadow:'0 0 18px '+accent}}/></div>
 </AbsoluteFill>
};

export const GTA6Scenes1to4:React.FC=()=> <AbsoluteFill style={{background:C.black}}>
 {scenes.map((s,i)=><Sequence key={i} from={starts[i]} durationInFrames={s.frames}><DynamicScene scene={i}/><Audio src={staticFile('media/'+s.voice)} volume={1}/></Sequence>)}
</AbsoluteFill>;
