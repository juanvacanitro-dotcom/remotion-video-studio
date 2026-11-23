import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Audio, Composition, Img, Loop, OffthreadVideo, Sequence,
  cancelRender, continueRender, delayRender, registerRoot, spring, staticFile,
  useCurrentFrame, useVideoConfig
} from 'remotion';

const FPS = 30;
const YELLOW = '#ffeb1d';
const INK = '#100e15';
const WHITE = '#fffdf7';
const PINK = '#ff3c91';
const TEAL = '#24f2dc';
const ORANGE = '#ff9b3d';
const MUTED = '#bdb8ca';

type Cue = {from:number; to:number; text:string; emphasis?:string};
type SoundCue = {at:number; file:string; volume:number};
type CutawayCue = {from:number; duration:number; file:string; label:string};
type SceneData = {file:string; type:string; accent:string; cues:Cue[]; sfx:SoundCue[]; cutaways?:CutawayCue[]};

const scenes:SceneData[] = [
 {file:'01.mp4',type:'hook',accent:ORANGE,cues:[
  {from:0.1,to:3.1,text:'Un juego acaba de igualar un récord de 28 años.',emphasis:'récord'},
  {from:3.1,to:6.3,text:'Es GTA 6 y las reseñas son históricas.',emphasis:'históricas'},
  {from:6.3,to:9.8,text:'Pero tiene pegas que casi nadie cuenta.',emphasis:'pegas'}
 ],sfx:[{at:0.1,file:'13_golpe_bajo.wav',volume:.22},{at:4.1,file:'04_whoosh.wav',volume:.18},{at:7.2,file:'08_error.wav',volume:.16}],cutaways:[
  {from:0,duration:42,file:'action.mp4',label:'GTA VI · TRÁILER OFICIAL'}
 ]},
 {file:'02.mp4',type:'welcome',accent:TEAL,cues:[
  {from:0.1,to:3.2,text:'Bienvenido a Zinko, el canal de la curiosidad.',emphasis:'Zinko'},
  {from:3.2,to:7.1,text:'Hoy veremos qué aman, qué critican y si valió la espera.',emphasis:'valió la espera'},
  {from:7.1,to:9.8,text:'Y al final, mi veredicto.',emphasis:'veredicto'}
 ],sfx:[{at:1.0,file:'20_click.wav',volume:.18},{at:4.1,file:'06_ding.wav',volume:.14},{at:7.4,file:'03_pop_grave.wav',volume:.18}]},
 {file:'03.mp4',type:'score',accent:ORANGE,cues:[
  {from:0.1,to:3.2,text:'Las reseñas salieron con una nota casi perfecta.',emphasis:'casi perfecta'},
  {from:3.2,to:6.2,text:'99 sobre 100 en Metacritic.',emphasis:'99 sobre 100'},
  {from:6.2,to:9.8,text:'Más de 140 críticos lo puntuaron.',emphasis:'140 críticos'}
 ],sfx:[{at:2.2,file:'05_whoosh_largo.wav',volume:.18},{at:5.0,file:'06_ding.wav',volume:.22},{at:7.2,file:'01_pop.wav',volume:.16}]},
 {file:'04.mp4',type:'timeline',accent:TEAL,cues:[
  {from:0.1,to:3.2,text:'Solo un juego había llegado a 99.',emphasis:'un juego'},
  {from:3.2,to:6.3,text:'Ocarina of Time, de 1998.',emphasis:'Ocarina of Time'},
  {from:6.3,to:9.8,text:'28 años después, GTA 6 lo alcanza.',emphasis:'28 años'}
 ],sfx:[{at:2.0,file:'10_tic_tac.wav',volume:.16},{at:5.3,file:'04_whoosh.wav',volume:.15},{at:7.4,file:'06_ding.wav',volume:.18}]},
 {file:'05.mp4',type:'ranking',accent:TEAL,cues:[
  {from:0.1,to:3.1,text:'En la saga, GTA 4 tiene 98.',emphasis:'98'},
  {from:3.1,to:6.1,text:'GTA 5, 97.',emphasis:'97'},
  {from:6.1,to:9.8,text:'Y al inicio no había ni una reseña negativa.',emphasis:'cero negativas'}
 ],sfx:[{at:2.0,file:'01_pop.wav',volume:.17},{at:5.1,file:'01_pop.wav',volume:.17},{at:7.1,file:'09_exito.wav',volume:.17}]},
 {file:'06.mp4',type:'world',accent:TEAL,cues:[
  {from:0.1,to:3.1,text:'Lo primero que alaban es el mundo abierto.',emphasis:'mundo abierto'},
  {from:3.1,to:6.3,text:'Enorme, vivo y lleno de detalles.',emphasis:'vivo'},
  {from:6.3,to:9.8,text:'Dicen que te hace sentir dentro de él.',emphasis:'dentro de él'}
 ],sfx:[{at:1.8,file:'04_whoosh.wav',volume:.15},{at:5.1,file:'06_ding.wav',volume:.15}],cutaways:[
  {from:3.35,duration:68,file:'coast.mp4',label:'TRÁILER OFICIAL · ROCKSTAR GAMES'}
 ]},
 {file:'07.mp4',type:'duo',accent:PINK,cues:[
  {from:0.1,to:3.3,text:'Los dos protagonistas son lo más elogiado de la historia.',emphasis:'dos protagonistas'},
  {from:3.3,to:6.5,text:'Una pareja que se siente creíble.',emphasis:'creíble'},
  {from:6.5,to:9.8,text:'Y tú ayudas a moldearla con tus decisiones.',emphasis:'tus decisiones'}
 ],sfx:[{at:2.2,file:'02_pop_agudo.wav',volume:.16},{at:5.2,file:'06_ding_doble.wav',volume:.15},{at:7.2,file:'15_boing.wav',volume:.14}],cutaways:[
  {from:4.2,duration:55,file:'action.mp4',label:'TRÁILER OFICIAL · ROCKSTAR GAMES'}
 ]},
 {file:'08.mp4',type:'hours',accent:ORANGE,cues:[
  {from:0.1,to:3.3,text:'La historia principal dura unas 60 horas.',emphasis:'60 horas'},
  {from:3.3,to:6.4,text:'Y con todo lo demás, pasa de 100.',emphasis:'pasa de 100'},
  {from:6.4,to:9.8,text:'Es muchísimo juego por lo que cuesta.',emphasis:'muchísimo juego'}
 ],sfx:[{at:1.1,file:'10_tic_tac.wav',volume:.15},{at:5.4,file:'06_ding.wav',volume:.16}]},
 {file:'09.mp4',type:'reviews',accent:ORANGE,cues:[
  {from:0.1,to:3.3,text:'IGN, GameSpot y Eurogamer le dieron la nota máxima.',emphasis:'nota máxima'},
  {from:3.3,to:6.5,text:'Uno lo llamó el juego de la generación.',emphasis:'juego de la generación'},
  {from:6.5,to:9.8,text:'Las notas más bajas rondan el 80.',emphasis:'80'}
 ],sfx:[{at:1.6,file:'06_ding_doble.wav',volume:.17},{at:5.0,file:'09_exito.wav',volume:.15}]},
 {file:'10.mp4',type:'fps',accent:PINK,cues:[
  {from:0.1,to:2.6,text:'Ahora, las pegas.',emphasis:'pegas'},
  {from:2.6,to:6.3,text:'La más repetida: 30 fotogramas por segundo.',emphasis:'30 fotogramas'},
  {from:6.3,to:9.8,text:'Y sin un modo de 60, incluso en PS5 Pro.',emphasis:'sin un modo de 60'}
 ],sfx:[{at:0.2,file:'13_golpe_bajo.wav',volume:.22},{at:3.2,file:'27_alarma.wav',volume:.15},{at:7.2,file:'08_error.wav',volume:.18}],cutaways:[
  {from:3.0,duration:72,file:'action.mp4',label:'SECUENCIA DE TRÁILER · ROCKSTAR GAMES'}
 ]},
 {file:'11.mp4',type:'performance',accent:PINK,cues:[
  {from:0.1,to:3.2,text:'Varias reseñas notan caídas de rendimiento.',emphasis:'caídas de rendimiento'},
  {from:3.2,to:6.4,text:'Sobre todo en zonas muy llenas y en tiroteos.',emphasis:'zonas muy llenas'},
  {from:6.4,to:9.8,text:'Aunque otros críticos lo ven fluido y estable.',emphasis:'fluido y estable'}
 ],sfx:[{at:2.3,file:'08_error.wav',volume:.16},{at:5.2,file:'27_alarma.wav',volume:.13},{at:7.4,file:'06_ding.wav',volume:.12}]},
 {file:'12.mp4',type:'pacing',accent:PINK,cues:[
  {from:0.1,to:3.3,text:'También critican un ritmo desigual en la historia.',emphasis:'ritmo desigual'},
  {from:3.3,to:6.4,text:'Un inicio lento y misiones muy guiadas.',emphasis:'inicio lento'},
  {from:6.4,to:9.8,text:'Y escenas largas en las que casi no controlas.',emphasis:'casi no controlas'}
 ],sfx:[{at:1.2,file:'10_tic_tac.wav',volume:.15},{at:5.0,file:'04_whoosh.wav',volume:.12},{at:7.2,file:'03_pop_grave.wav',volume:.13}]},
 {file:'13.mp4',type:'realism',accent:ORANGE,cues:[
  {from:0.1,to:3.2,text:'Y el realismo tiene curva de aprendizaje.',emphasis:'curva de aprendizaje'},
  {from:3.2,to:6.5,text:'Coches más frágiles, gastos y tareas del día a día.',emphasis:'gastos'},
  {from:6.5,to:9.8,text:'Si vienes de GTA 5, te sorprenderá.',emphasis:'te sorprenderá'}
 ],sfx:[{at:2.1,file:'20_click.wav',volume:.16},{at:5.2,file:'01_pop.wav',volume:.15}]},
 {file:'14.mp4',type:'preorders',accent:ORANGE,cues:[
  {from:0.1,to:3.3,text:'Las preventas superaron lo esperado, dice Take-Two.',emphasis:'preventas'},
  {from:3.3,to:6.5,text:'Sensor Tower calcula más de 17 millones.',emphasis:'17 millones'},
  {from:6.5,to:9.8,text:'A casi 80 o casi 100 dólares cada una.',emphasis:'80 o 100 dólares'}
 ],sfx:[{at:3.3,file:'17_moneda.wav',volume:.18},{at:6.6,file:'06_ding.wav',volume:.16}]},
 {file:'15.mp4',type:'comparison',accent:ORANGE,cues:[
  {from:0.1,to:3.3,text:'Para comparar: GTA 5 vendió 11 millones el primer día.',emphasis:'11 millones'},
  {from:3.3,to:6.5,text:'Según esa estimación, las preventas ya lo superan.',emphasis:'ya lo superan'},
  {from:6.5,to:9.8,text:'Faltan las cifras oficiales.',emphasis:'cifras oficiales'}
 ],sfx:[{at:2.4,file:'13_golpe_bajo.wav',volume:.16},{at:5.4,file:'17_moneda.wav',volume:.14},{at:7.5,file:'08_error.wav',volume:.12}],cutaways:[
  {from:4.0,duration:58,file:'rockstar.mp4',label:'MATERIAL PROMOCIONAL · ROCKSTAR GAMES'}
 ]},
 {file:'16.mp4',type:'split',accent:TEAL,cues:[
  {from:0.1,to:3.3,text:'¿Superó las expectativas? Para los críticos, sí.',emphasis:'sí'},
  {from:3.3,to:6.5,text:'Para algunos jugadores hay matices.',emphasis:'matices'},
  {from:6.5,to:9.8,text:'Y aun así, el aplauso es casi unánime.',emphasis:'casi unánime'}
 ],sfx:[{at:2.2,file:'06_ding.wav',volume:.15},{at:5.1,file:'08_error.wav',volume:.13},{at:7.6,file:'14_aplauso.wav',volume:.15}]},
 {file:'17.mp4',type:'verdict',accent:TEAL,cues:[
  {from:0.1,to:3.3,text:'Mi veredicto: no es perfecto, pero es histórico.',emphasis:'histórico'},
  {from:3.3,to:6.5,text:'Las pegas son técnicas y de ritmo, no de ambición.',emphasis:'no de ambición'},
  {from:6.5,to:9.8,text:'Y la última palabra la tienes tú, jugándolo.',emphasis:'la tienes tú'}
 ],sfx:[{at:1.4,file:'28_victoria.wav',volume:.17},{at:7.1,file:'40_final_epico.wav',volume:.14}],cutaways:[
  {from:5.0,duration:54,file:'coast.mp4',label:'TRÁILER OFICIAL · ROCKSTAR GAMES'}
 ]},
 {file:'18.mp4',type:'outro',accent:PINK,cues:[
  {from:0.1,to:3.3,text:'¿Qué nota le pondrías tú a GTA 6?',emphasis:'qué nota'},
  {from:3.3,to:6.5,text:'Suscríbete a Zinko para más curiosidad.',emphasis:'Suscríbete'},
  {from:6.5,to:9.8,text:'Y mira el siguiente vídeo, está justo aquí.',emphasis:'siguiente vídeo'}
 ],sfx:[{at:0.8,file:'01_pop.wav',volume:.14},{at:4.5,file:'06_ding.wav',volume:.14},{at:7.5,file:'40_final_epico.wav',volume:.16}]}
];

const ease=(v:number)=>{const x=Math.max(0,Math.min(1,v));return x*x*(3-2*x)};
const pop=(f:number,delay=0,damping=14)=>spring({frame:Math.max(0,f-delay),fps:FPS,config:{mass:.72,damping,stiffness:170}});
const file=(name:string)=>staticFile('gta6-zinko-v2/'+name);
const fullFile=(name:string)=>staticFile('zinko-full/'+name);
const proofFile=(name:string)=>staticFile('zinko-proof/'+name);

function GlassCard({f,x,y,w,accent,label,value,note,delay=0,angle=0,valueSize=68}:{f:number;x:number;y:number;w:number;accent:string;label:string;value:string;note?:string;delay?:number;angle?:number;valueSize?:number}){
 const p=pop(f,delay);
 const drift=Math.sin((f+delay)*.045)*5;
 return <div style={{position:'absolute',left:x,top:y,width:w,padding:'20px 24px 22px',borderRadius:22,background:'linear-gradient(145deg,rgba(15,15,31,.94),rgba(5,5,15,.84))',border:'2px solid '+accent+'cc',boxShadow:'0 22px 42px #0008,0 0 24px '+accent+'44',backdropFilter:'blur(12px)',transform:'perspective(1200px) translateY('+(38*(1-p)+drift)+'px) rotateY('+(12*(1-p))+'deg) rotateZ('+angle+'deg) scale('+(0.82+.18*p)+')',opacity:Math.max(0,Math.min(1,(f-delay+2)/8))}}>
  <div style={{fontFamily:'ImpactLocal',fontSize:22,letterSpacing:3,color:accent,marginBottom:9}}>{label}</div>
  <div style={{fontFamily:'ImpactLocal',fontSize:valueSize,lineHeight:1,color:WHITE,textShadow:'0 4px 0 '+INK+',0 0 18px '+accent+'66'}}>{value}</div>
  {note&&<div style={{fontFamily:'CaptionLocal',fontSize:19,letterSpacing:1,color:'#d8d5e2',marginTop:10}}>{note}</div>}
 </div>;
}

function Pill({f,x,y,text,accent,delay=0,angle=0}:{f:number;x:number;y:number;text:string;accent:string;delay?:number;angle?:number}){
 const p=pop(f,delay,12);
 return <div style={{position:'absolute',left:x,top:y,padding:'11px 18px',borderRadius:999,background:accent,color:INK,fontFamily:'ImpactLocal',fontSize:24,letterSpacing:1.5,boxShadow:'0 9px 20px #0008,0 0 18px '+accent+'66',transform:'translateY('+(1-p)*32+'px) rotate('+angle+'deg) scale('+(0.78+.22*p)+')',opacity:Math.max(0,Math.min(1,(f-delay+1)/5))}}>{text}</div>;
}

function SceneHeader({index,accent,f}:{index:number;accent:string;f:number}){
 const p=ease(f/12);
 return <div style={{position:'absolute',left:52,top:34,display:'flex',alignItems:'center',gap:18,opacity:.96,transform:'translateY('+(1-p)*-20+'px)'}}>
  <div style={{fontFamily:'ImpactLocal',fontSize:22,letterSpacing:4,color:WHITE,textShadow:'0 2px 4px #000'}}>ZINKO <span style={{color:accent}}>/</span> ANÁLISIS</div>
  <div style={{display:'flex',gap:5,alignItems:'center'}}>
   {scenes.map((s,i)=><div key={i} style={{width:i===index?25:9,height:8,borderRadius:99,background:i===index?accent:'#ffffff55',boxShadow:i===index?'0 0 12px '+accent:'none'}}/>)}
  </div>
  <div style={{fontFamily:'ImpactLocal',fontSize:19,color:'#ffffffcc',letterSpacing:2}}>{String(index+1).padStart(2,'0')} / 18</div>
 </div>;
}

function Subtitle({scene,f}:{scene:SceneData;f:number}){
 const t=f/FPS;
 const cue=scene.cues.find(c=>t>=c.from&&t<c.to);
 if(!cue)return null;
 const p=pop(f-Math.round(cue.from*FPS),0,18);
 const lower=cue.text.toLowerCase();
 const idx=cue.emphasis?lower.indexOf(cue.emphasis.toLowerCase()):-1;
 const before=idx>=0?cue.text.slice(0,idx):cue.text;
 const hi=idx>=0?cue.text.slice(idx,idx+cue.emphasis!.length):'';
 const after=idx>=0?cue.text.slice(idx+cue.emphasis!.length):'';
 return <div style={{position:'absolute',left:100,right:100,bottom:48,display:'flex',justifyContent:'center',opacity:Math.min(1,p),transform:'translateY('+(1-p)*24+'px) scale('+(0.96+.04*p)+')'}}>
  <div style={{maxWidth:1580,textAlign:'center',fontFamily:'CaptionLocal',fontSize:52,lineHeight:1.1,fontWeight:900,color:YELLOW,WebkitTextStroke:'3px '+INK,paintOrder:'stroke fill',textShadow:'2px 5px 0 '+INK+',0 8px 18px #0008'}}>
   {before}<span style={{color:WHITE}}>{hi}</span>{after}
  </div>
 </div>;
}

function ScoreRing({f,x,y}:{f:number;x:number;y:number}){
 const p=ease((f-8)/38);
 const radius=88;
 const circumference=2*Math.PI*radius;
 return <div style={{position:'absolute',left:x,top:y,width:250,height:250,transform:'translate(-50%,-50%) rotate('+(-5+2*Math.sin(f*.06))+'deg) scale('+(0.82+.18*pop(f,5))+')',filter:'drop-shadow(0 12px 22px #0008)'}}>
  <svg viewBox="0 0 250 250" width="250" height="250">
   <circle cx="125" cy="125" r={radius} fill="rgba(5,5,16,.78)" stroke="#ffffff33" strokeWidth="16"/>
   <circle cx="125" cy="125" r={radius} fill="none" stroke={ORANGE} strokeWidth="16" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference*(1-.99*p)} transform="rotate(-90 125 125)" style={{filter:'drop-shadow(0 0 12px '+ORANGE+')'}}/>
   <text x="125" y="139" textAnchor="middle" fontFamily="ImpactLocal" fontSize="75" fill={WHITE}>99</text>
   <text x="125" y="170" textAnchor="middle" fontFamily="CaptionLocal" fontSize="18" fill={YELLOW}>/100</text>
  </svg>
 </div>;
}

function TimelineUI({f}:{f:number}){
 const p=ease((f-8)/24);
 return <div style={{position:'absolute',right:90,top:230,width:620,height:245,transform:'perspective(1200px) rotateY(-9deg) rotateZ(-2deg) translateY('+(1-p)*55+'px)',opacity:p}}>
  <div style={{position:'absolute',left:72,right:72,top:86,height:5,background:'linear-gradient(90deg,'+ORANGE+','+TEAL+')',boxShadow:'0 0 18px '+TEAL}}/>
  <div style={{position:'absolute',left:28,top:34,width:120,height:120,borderRadius:25,background:'rgba(8,8,22,.92)',border:'2px solid '+ORANGE,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 15px 28px #0008'}}>
   <span style={{fontFamily:'ImpactLocal',fontSize:48,color:WHITE}}>1998</span><span style={{fontFamily:'CaptionLocal',fontSize:17,color:ORANGE}}>OCARINA</span>
  </div>
  <div style={{position:'absolute',right:25,top:34,width:120,height:120,borderRadius:25,background:'rgba(8,8,22,.92)',border:'2px solid '+TEAL,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 15px 28px #0008'}}>
   <span style={{fontFamily:'ImpactLocal',fontSize:48,color:WHITE}}>2026</span><span style={{fontFamily:'CaptionLocal',fontSize:17,color:TEAL}}>GTA VI</span>
  </div>
  <div style={{position:'absolute',left:245,top:48,width:130,height:84,borderRadius:18,background:INK,border:'2px solid '+YELLOW,display:'grid',placeItems:'center',fontFamily:'ImpactLocal',fontSize:38,color:YELLOW,boxShadow:'0 10px 20px #0008'}}>28 AÑOS</div>
 </div>;
}

function MiniBars({f,values,labels,accent}:{f:number;values:number[];labels:string[];accent:string}){
 const p=ease((f-4)/24);
 return <div style={{position:'absolute',right:90,top:215,width:650,height:430,display:'flex',alignItems:'end',gap:22,padding:'28px 30px 58px',borderRadius:28,background:'rgba(6,6,18,.78)',border:'2px solid '+accent+'aa',boxShadow:'0 22px 45px #0008',transform:'perspective(1100px) rotateY(-7deg) rotateZ(1.5deg) translateY('+(1-p)*45+'px)',opacity:p}}>
  {values.map((v,i)=><div key={i} style={{flex:1,height:'100%',display:'flex',flexDirection:'column',justifyContent:'end',alignItems:'center',gap:12}}>
   <div style={{fontFamily:'ImpactLocal',fontSize:38,color:i===2?YELLOW:WHITE}}>{v}</div>
   <div style={{width:'78%',height:(v/100)*260*p,background:i===2?'linear-gradient(180deg,'+YELLOW+','+ORANGE+')':'linear-gradient(180deg,'+accent+',#ffffff22)',borderRadius:'14px 14px 4px 4px',boxShadow:'0 0 18px '+accent+'55'}}/>
   <div style={{fontFamily:'ImpactLocal',fontSize:22,color:WHITE}}>{labels[i]}</div>
  </div>)}
 </div>;
}

function FPSPanel({f}:{f:number}){
 const p=ease((f-5)/18);
 return <div style={{position:'absolute',right:82,top:190,width:560,padding:28,borderRadius:26,background:'rgba(5,5,17,.9)',border:'2px solid '+PINK,boxShadow:'0 20px 44px #0009,0 0 24px '+PINK+'44',transform:'perspective(1100px) rotateY(-8deg) rotateZ(2deg) translateY('+(1-p)*55+'px)',opacity:p}}>
  <div style={{fontFamily:'ImpactLocal',fontSize:25,letterSpacing:3,color:PINK}}>RENDIMIENTO</div>
  <div style={{display:'flex',alignItems:'baseline',gap:16,marginTop:8}}>
   <div style={{fontFamily:'ImpactLocal',fontSize:132,lineHeight:1,color:WHITE,textShadow:'0 0 20px '+PINK}}>30</div>
   <div style={{fontFamily:'ImpactLocal',fontSize:42,color:PINK}}>FPS</div>
   <div style={{marginLeft:'auto',fontFamily:'ImpactLocal',fontSize:38,color:'#777',textDecoration:'line-through'}}>60</div>
  </div>
  <div style={{height:14,background:'#ffffff22',borderRadius:99,overflow:'hidden',marginTop:15}}>
   <div style={{height:'100%',width:(50*p)+'%',background:'linear-gradient(90deg,'+PINK+',#ffb1d4)',boxShadow:'0 0 16px '+PINK}}/>
  </div>
  <div style={{fontFamily:'CaptionLocal',fontSize:20,color:'#ddd',marginTop:12}}>SIN MODO DE 60 FPS</div>
 </div>;
}

function GraphPanel({f}:{f:number}){
 const p=ease((f-5)/25);
 return <div style={{position:'absolute',right:75,top:220,width:620,height:340,padding:25,borderRadius:24,background:'rgba(5,5,18,.88)',border:'2px solid '+PINK+'aa',boxShadow:'0 18px 40px #0008',transform:'perspective(1100px) rotateY(-8deg) rotateZ(1deg) translateY('+(1-p)*45+'px)',opacity:p}}>
  <div style={{display:'flex',justifyContent:'space-between',fontFamily:'ImpactLocal',fontSize:24,letterSpacing:2,color:WHITE}}><span>FRAME TIME</span><span style={{color:PINK}}>INESTABLE</span></div>
  <svg viewBox="0 0 560 220" width="100%" height="220" style={{marginTop:16}}>
   {[40,90,140,190].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#ffffff22" strokeDasharray="5 8"/>)}
   <path d="M0 135 L42 120 L82 130 L120 65 L158 145 L195 90 L235 125 L272 45 L310 150 L350 118 L390 65 L430 142 L470 112 L515 52 L560 125" stroke={PINK} strokeWidth="7" fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000*(1-p)} style={{filter:'drop-shadow(0 0 10px '+PINK+')'}}/>
  </svg>
  <div style={{display:'flex',gap:12}}><Pill f={f} x={0} y={0} text="ZONAS LLENAS" accent={PINK} delay={28}/><Pill f={f} x={205} y={0} text="TIROTEOS" accent={ORANGE} delay={36}/></div>
 </div>;
}

function SplitPanel({f}:{f:number}){
 const p=ease((f-4)/22);
 return <div style={{position:'absolute',right:70,top:240,width:670,display:'flex',gap:14,transform:'perspective(1000px) rotateY(-7deg) rotateZ(-1deg) translateY('+(1-p)*45+'px)',opacity:p}}>
  <div style={{flex:1,padding:24,borderRadius:24,background:'rgba(5,5,18,.9)',border:'2px solid '+TEAL,boxShadow:'0 18px 38px #0008'}}>
   <div style={{fontFamily:'ImpactLocal',fontSize:25,color:TEAL,letterSpacing:2}}>CRÍTICOS</div>
   <div style={{fontFamily:'ImpactLocal',fontSize:68,color:WHITE,marginTop:18}}>SÍ</div>
   <div style={{fontFamily:'CaptionLocal',fontSize:21,color:'#ddd'}}>CASI UNÁNIME</div>
  </div>
  <div style={{flex:1,padding:24,borderRadius:24,background:'rgba(5,5,18,.9)',border:'2px solid '+PINK,boxShadow:'0 18px 38px #0008'}}>
   <div style={{fontFamily:'ImpactLocal',fontSize:25,color:PINK,letterSpacing:2}}>JUGADORES</div>
   <div style={{fontFamily:'ImpactLocal',fontSize:68,color:WHITE,marginTop:18}}>MATICES</div>
   <div style={{fontFamily:'CaptionLocal',fontSize:21,color:'#ddd'}}>SOBRE TODO FPS</div>
  </div>
 </div>;
}

function BrollFrame({fileName,label}:{fileName:string;label:string}){
 const f=useCurrentFrame();
 const p=pop(f,0,16);
 return <AbsoluteFill style={{background:'#05050c',overflow:'hidden',transform:'scale('+(1.01+.012*p)+')'}}>
  <OffthreadVideo src={fullFile(fileName)} muted style={{width:'100%',height:'100%',objectFit:'cover',filter:'saturate(1.12) contrast(1.06)'}}/>
  <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(5,5,15,.55),transparent 42%,rgba(5,5,15,.28))'}}/>
  <div style={{position:'absolute',left:60,top:52,padding:'12px 20px',background:'rgba(5,5,15,.78)',border:'1px solid #ffffffaa',borderRadius:12,fontFamily:'ImpactLocal',fontSize:20,letterSpacing:2,color:WHITE,boxShadow:'0 8px 20px #0008',transform:'translateY('+(1-p)*-30+'px)'}}>{label}</div>
  <div style={{position:'absolute',right:54,bottom:38,fontFamily:'CaptionLocal',fontSize:16,color:'#ffffffcc',textShadow:'0 2px 5px #000'}}>Fuente: Rockstar Games · material promocional</div>
 </AbsoluteFill>;
}

function Cutaway({cue}:{cue:CutawayCue}){
 return <Sequence from={Math.round(cue.from*FPS)} durationInFrames={cue.duration}>
  <BrollFrame fileName={cue.file} label={cue.label}/>
 </Sequence>;
}

function OutroUI({f}:{f:number}){
 const p=ease((f-8)/20);
 return <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
  <div style={{position:'absolute',left:190,top:230,width:690,height:400,border:'4px solid '+TEAL,borderRadius:30,boxShadow:'0 0 28px '+TEAL+'77',transform:'perspective(1000px) rotateY(9deg) rotateZ(-2deg) scale('+p+')',opacity:p}}/>
  <div style={{position:'absolute',right:250,top:190,width:300,height:300,border:'4px solid '+PINK,borderRadius:'50%',boxShadow:'0 0 28px '+PINK+'77',transform:'scale('+p+')',opacity:p}}/>
  <div style={{position:'absolute',left:960,top:160,transform:'translateX(-50%)',fontFamily:'ImpactLocal',fontSize:66,color:YELLOW,WebkitTextStroke:'2px '+INK,paintOrder:'stroke fill',textShadow:'0 5px 0 '+INK,opacity:p}}>¿QUÉ NOTA LE DAS?</div>
  <Img src={proofFile('nico-happy.webp')} style={{position:'absolute',left:960,top:760,width:245,transform:'translate(-50%,-50%) rotate('+(2*Math.sin(f*.08))+'deg) scale('+p+')',filter:'drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 12px 12px #0008)'}}/>
 </div>;
}

function UIOverlay({type,accent,f}:{type:string;accent:string;f:number}){
 if(type==='hook')return <>
  <Pill f={f} x={1390} y={525} text="RÉCORD IGUALADO" accent={ORANGE} delay={14} angle={-3}/>
  <Pill f={f} x={1390} y={610} text="PERO HAY PEGAS" accent={PINK} delay={42} angle={3}/>
  <div style={{position:'absolute',right:240,top:710,width:170,height:5,background:'linear-gradient(90deg,transparent,'+PINK+')',transform:'rotate(-15deg) scaleX('+ease((f-50)/12)+')',transformOrigin:'right'}}/>
 </>;
 if(type==='welcome')return <>
  <GlassCard f={f} x={1160} y={205} w={330} accent={TEAL} label="LO QUE AMAN" value="MUNDO" note="HISTORIA · DETALLES" delay={8} angle={-3} valueSize={58}/>
  <GlassCard f={f} x={1490} y={455} w={330} accent={PINK} label="LO QUE CRITICAN" value="30 FPS" note="RENDIMIENTO · RITMO" delay={28} angle={3} valueSize={58}/>
  <Pill f={f} x={1260} y={730} text="EL BALANCE FINAL" accent={YELLOW} delay={48} angle={-2}/>
 </>;
 if(type==='score')return <>
  <Pill f={f} x={1510} y={185} text="METACRITIC" accent={ORANGE} delay={12}/>
  <div style={{position:'absolute',right:215,top:640,padding:'12px 18px',borderRadius:12,background:'rgba(6,6,18,.76)',border:'1px solid '+ORANGE+'aa',fontFamily:'CaptionLocal',fontSize:18,color:WHITE,transform:'rotate(2deg) scale('+pop(f,32)+')'}}>AGREGADOR DE RESEÑAS</div>
 </>;
 if(type==='timeline')return <>
  <TimelineUI f={f}/>
  <Pill f={f} x={1390} y={525} text="EMPATE HISTÓRICO" accent={TEAL} delay={40} angle={-2}/>
 </>;
 if(type==='ranking')return <>
  <MiniBars f={f} values={[98,97,99]} labels={['GTA IV','GTA V','GTA VI']} accent={TEAL}/>
  <Pill f={f} x={1450} y={690} text="CERO NEGATIVAS AL INICIO" accent={YELLOW} delay={45} angle={-2}/>
 </>;
 if(type==='world')return <>
  <GlassCard f={f} x={1370} y={190} w={410} accent={TEAL} label="EXPLORACIÓN" value="MUNDO VIVO" note="DETALLES POR TODAS PARTES" delay={8} angle={-2} valueSize={52}/>
  <Pill f={f} x={1460} y={565} text="INMERSIÓN" accent={TEAL} delay={35}/>
 </>;
 if(type==='duo')return <>
  <GlassCard f={f} x={1270} y={210} w={470} accent={PINK} label="DOS PROTAGONISTAS" value="UNA HISTORIA" note="RELACIÓN · CONFIANZA · DECISIONES" delay={8} angle={2} valueSize={55}/>
  <div style={{position:'absolute',right:300,top:560,display:'flex',alignItems:'center',gap:24,transform:'scale('+pop(f,34)+')'}}>
   <div style={{width:74,height:74,borderRadius:'50%',border:'4px solid '+PINK,background:'#100e15',boxShadow:'0 0 18px '+PINK}}/>
   <div style={{width:110,height:4,background:'linear-gradient(90deg,'+PINK+','+TEAL+')'}}/>
   <div style={{width:74,height:74,borderRadius:'50%',border:'4px solid '+TEAL,background:'#100e15',boxShadow:'0 0 18px '+TEAL}}/>
  </div>
  <Pill f={f} x={1390} y={690} text="TUS DECISIONES" accent={YELLOW} delay={45}/>
 </>;
 if(type==='hours')return <>
  <GlassCard f={f} x={1250} y={205} w={275} accent={ORANGE} label="HISTORIA" value="60 H" note="PRINCIPAL" delay={8} angle={-3} valueSize={86}/>
  <GlassCard f={f} x={1550} y={410} w={275} accent={TEAL} label="COMPLETAR TODO" value="100+" note="HORAS" delay={26} angle={3} valueSize={76}/>
  <Pill f={f} x={1390} y={730} text="MUCHO JUEGO" accent={ORANGE} delay={44}/>
 </>;
 if(type==='reviews')return <>
  <GlassCard f={f} x={1240} y={185} w={480} accent={ORANGE} label="NOTA MÁXIMA" value="100 / 100" note="IGN · GAMESPOT · EUROGAMER" delay={8} angle={-2} valueSize={72}/>
  <Pill f={f} x={1280} y={530} text="JUEGO DE LA GENERACIÓN" accent={YELLOW} delay={34} angle={-2}/>
  <Pill f={f} x={1550} y={635} text="NOTAS BAJAS ≈ 80" accent={ORANGE} delay={48} angle={2}/>
 </>;
 if(type==='fps')return <>
  <FPSPanel f={f}/>
  <div style={{position:'absolute',right:90,bottom:100,display:'flex',gap:26,alignItems:'end',transform:'scale('+pop(f,32)+')'}}>
   <Img src={fullFile('ps5.webp')} style={{width:110,filter:'drop-shadow(0 10px 14px #0009)'}}/>
   <Img src={fullFile('xbox.webp')} style={{width:105,filter:'drop-shadow(0 10px 14px #0009)'}}/>
  </div>
  <Pill f={f} x={1390} y={685} text="SIN MODO DE 60" accent={PINK} delay={50}/>
 </>;
 if(type==='performance')return <>
  <GraphPanel f={f}/>
  <Pill f={f} x={1330} y={625} text="FLUIDO PARA ALGUNOS" accent={TEAL} delay={48}/>
 </>;
 if(type==='pacing')return <>
  <GlassCard f={f} x={1260} y={210} w={470} accent={PINK} label="RITMO NARRATIVO" value="DESIGUAL" note="INICIO LENTO · MISIONES GUIADAS" delay={8} angle={-2} valueSize={66}/>
  <div style={{position:'absolute',right:110,top:540,width:590,height:70,display:'flex',gap:8,transform:'rotate(-2deg) scale('+pop(f,35)+')'}}>
   <div style={{flex:1,background:PINK,borderRadius:12,boxShadow:'0 0 18px '+PINK}}/>
   <div style={{flex:2,background:'#ffffff55',borderRadius:12}}/>
   <div style={{flex:1,background:ORANGE,borderRadius:12}}/>
  </div>
  <Pill f={f} x={1380} y={665} text="POCO CONTROL EN ALGUNAS ESCENAS" accent={PINK} delay={52}/>
 </>;
 if(type==='realism')return <>
  <GlassCard f={f} x={1300} y={190} w={460} accent={ORANGE} label="MÁS REALISMO" value="MÁS GESTIÓN" note="COCHES · GASTOS · RUTINAS" delay={8} angle={2} valueSize={59}/>
  <div style={{position:'absolute',right:170,top:555,display:'flex',gap:14,transform:'scale('+pop(f,36)+')'}}>
   {['COCHES','GASTOS','TAREAS'].map((t,i)=><div key={t} style={{padding:'14px 18px',borderRadius:14,border:'2px solid '+[ORANGE,PINK,TEAL][i],background:'#080817dd',fontFamily:'ImpactLocal',fontSize:22,color:WHITE,boxShadow:'0 10px 20px #0007'}}>{t}</div>)}
  </div>
 </>;
 if(type==='preorders')return <>
  <GlassCard f={f} x={1270} y={205} w={460} accent={ORANGE} label="PREVENTAS ESTIMADAS" value="+17 MILLONES" note="SENSOR TOWER · NO ES CIFRA OFICIAL" delay={8} angle={-2} valueSize={62}/>
  <Pill f={f} x={1390} y={575} text="ESTIMACIÓN DE TERCEROS" accent={YELLOW} delay={38}/>
  <Pill f={f} x={1510} y={670} text="80–100 USD" accent={ORANGE} delay={50} angle={2}/>
 </>;
 if(type==='comparison')return <>
  <GlassCard f={f} x={1260} y={190} w={430} accent={ORANGE} label="GTA V · PRIMER DÍA" value="11 MILLONES" note="VENTAS REPORTADAS" delay={7} angle={-3} valueSize={60}/>
  <GlassCard f={f} x={1460} y={480} w={430} accent={TEAL} label="GTA VI · PREVENTAS" value="17 MILLONES*" note="ESTIMACIÓN SENSOR TOWER" delay={30} angle={3} valueSize={60}/>
  <Pill f={f} x={1320} y={780} text="FALTAN CIFRAS OFICIALES" accent={YELLOW} delay={52}/>
 </>;
 if(type==='split')return <SplitPanel f={f}/>;
 if(type==='verdict')return <>
  <GlassCard f={f} x={1270} y={205} w={460} accent={TEAL} label="VEREDICTO ZINKO" value="HISTÓRICO" note="NO ES PERFECTO · SÍ AMBICIOSO" delay={8} angle={-3} valueSize={67}/>
  <Pill f={f} x={1380} y={565} text="TÚ TIENES LA ÚLTIMA PALABRA" accent={YELLOW} delay={42} angle={2}/>
 </>;
 if(type==='outro')return <OutroUI f={f}/>;
 return null;
}

function Transition({index,f}:{index:number;f:number}){
 if(index===0||f>=10)return null;
 const p=ease(f/10);
 if(index%4===0)return <div style={{position:'absolute',top:0,bottom:0,left:(1-p)*-650,width:650,background:'linear-gradient(90deg,transparent,'+YELLOW+',transparent)',filter:'blur(5px)',opacity:1-p*.3}}/>;
 if(index%4===1)return <div style={{position:'absolute',inset:0,background:'linear-gradient(125deg,transparent 36%,rgba(36,242,220,.85) 48%,transparent 60%)',transform:'translateX('+(1-p)*1500+'px)',opacity:1-p}}/>;
 if(index%4===2)return <div style={{position:'absolute',inset:0,background:WHITE,opacity:(1-p)*.22}}/>;
 return <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%,transparent '+(p*90)+'%,rgba(255,60,145,'+((1-p)*.9)+') '+(p*90+2)+'%,transparent '+(p*100+8)+'%)'}}/>;
}

function Scene({index}:{index:number}){
 const f=useCurrentFrame();
 const scene=scenes[index];
 const driftX=Math.sin((f+index*17)*.035)*7;
 const driftY=Math.cos((f+index*11)*.028)*5;
 const zoom=1.025+.012*Math.sin(f*.035+index);
 return <AbsoluteFill style={{background:INK,overflow:'hidden',fontFamily:'CaptionLocal'}}>
  <OffthreadVideo src={file('clips/'+scene.file)} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale('+zoom+') translate('+driftX+'px,'+driftY+'px)',filter:'saturate(1.07) contrast(1.04)'}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(5,5,16,.22),transparent 20%,transparent 62%,rgba(5,5,16,.38))'}}/>
  {scene.cutaways?.map((cue,i)=><Cutaway key={i} cue={cue}/>)}
  <UIOverlay type={scene.type} accent={scene.accent} f={f}/>
  <SceneHeader index={index} accent={scene.accent} f={f}/>
  <Subtitle scene={scene} f={f}/>
  <Transition index={index} f={f}/>
  <Audio src={file('voice/'+String(index+1).padStart(2,'0')+'.mp3')} volume={1}/>
  {scene.sfx.map((s,i)=><Sequence key={i} from={Math.round(s.at*FPS)} durationInFrames={Math.min(75,300-Math.round(s.at*FPS))}><Audio src={file('sfx/'+s.file)} volume={s.volume}/></Sequence>)}
 </AbsoluteFill>;
}

function Video(){
 const [handle]=useState(()=>delayRender('Cargando tipografías ZINKO'));
 useEffect(()=>{
  const fonts=[
   new FontFace('CaptionLocal','url('+proofFile('Caption.ttf')+')'),
   new FontFace('ImpactLocal','url('+proofFile('Impact.ttf')+')')
  ];
  Promise.all(fonts.map(f=>f.load())).then(loaded=>{loaded.forEach(f=>document.fonts.add(f));continueRender(handle)}).catch(cancelRender);
 },[handle]);
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
  {scenes.map((s,i)=><Sequence key={i} from={i*300} durationInFrames={300} premountFor={FPS}><Scene index={i}/></Sequence>)}
 </AbsoluteFill>;
}

export const GTA6ZinkoEditorialV2:React.FC=()=> <Video/>;
