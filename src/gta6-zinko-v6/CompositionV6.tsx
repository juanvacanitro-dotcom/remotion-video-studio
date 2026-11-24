import React, {useEffect, useState} from 'react';
import {
 AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, cancelRender, continueRender,
 delayRender, spring, staticFile, useCurrentFrame
} from 'remotion';

const FPS=30;
const INK='#100e15', PAPER='#fffdf7', YELLOW='#ffeb1d', PINK='#ff3c91', TEAL='#24f2dc', ORANGE='#ff9b3d';
const asset=(name:string)=>staticFile('gta6-zinko-v6/'+name);
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const x=clamp(n);return x*x*(3-2*x)};
const pop=(f:number,delay=0,damping=12)=>spring({frame:Math.max(0,f-delay),fps:FPS,config:{mass:.72,damping,stiffness:175}});

type Cue={from:number;to:number;text:string;emphasis?:string};
type SoundCue={at:number;file:string;volume:number};
type SceneData={file:string;type:string;accent:string;cues:Cue[];sfx:SoundCue[]};
const scenes:SceneData[] = [
 {file:'01.mp4',type:'hook',accent:ORANGE,cues:[
  {from:0.1,to:3.1,text:'Un juego acaba de igualar un récord de 28 años.',emphasis:'récord'},
  {from:3.1,to:6.3,text:'Es GTA 6 y las reseñas son históricas.',emphasis:'históricas'},
  {from:6.3,to:9.8,text:'Pero tiene pegas que casi nadie cuenta.',emphasis:'pegas'}
 ],sfx:[{at:0.1,file:'13_golpe_bajo.wav',volume:.22},{at:4.1,file:'04_whoosh.wav',volume:.18},{at:7.2,file:'08_error.wav',volume:.16}]},
 {file:'02.mp4',type:'welcome',accent:TEAL,cues:[
  {from:0.1,to:3.2,text:'Bienvenido a Zinko, el canal de la curiosidad.',emphasis:'Zinko'},
  {from:3.2,to:7.1,text:'Hoy veremos qué aman, qué critican y si valió la espera.',emphasis:'valió la espera'},
  {from:7.1,to:9.8,text:'Y al final, mi veredicto.',emphasis:'veredicto'}
 ],sfx:[{at:1.0,file:'20_click.wav',volume:.18},{at:4.1,file:'21_burbuja.wav',volume:.14},{at:7.4,file:'03_pop_grave.wav',volume:.18}]},
 {file:'03.mp4',type:'score',accent:ORANGE,cues:[
  {from:0.1,to:3.2,text:'Las reseñas salieron con una nota casi perfecta.',emphasis:'casi perfecta'},
  {from:3.2,to:6.2,text:'99 sobre 100 en Metacritic.',emphasis:'99 sobre 100'},
  {from:6.2,to:9.8,text:'Más de 140 críticos lo puntuaron.',emphasis:'140 críticos'}
 ],sfx:[{at:2.2,file:'05_whoosh_largo.wav',volume:.18},{at:5.0,file:'21_burbuja.wav',volume:.22},{at:7.2,file:'01_pop.wav',volume:.16}]},
 {file:'04.mp4',type:'timeline',accent:TEAL,cues:[
  {from:0.1,to:3.2,text:'Solo un juego había llegado a 99.',emphasis:'un juego'},
  {from:3.2,to:6.3,text:'Ocarina of Time, de 1998.',emphasis:'Ocarina of Time'},
  {from:6.3,to:9.8,text:'28 años después, GTA 6 lo alcanza.',emphasis:'28 años'}
 ],sfx:[{at:2.0,file:'10_tic_tac.wav',volume:.16},{at:5.3,file:'04_whoosh.wav',volume:.15},{at:7.4,file:'21_burbuja.wav',volume:.18}]},
 {file:'05.mp4',type:'ranking',accent:TEAL,cues:[
  {from:0.1,to:3.1,text:'En la saga, GTA 4 tiene 98.',emphasis:'98'},
  {from:3.1,to:6.1,text:'GTA 5, 97.',emphasis:'97'},
  {from:6.1,to:9.8,text:'Y al inicio no había ni una reseña negativa.',emphasis:'cero negativas'}
 ],sfx:[{at:2.0,file:'01_pop.wav',volume:.17},{at:5.1,file:'01_pop.wav',volume:.17},{at:7.1,file:'01_pop.wav',volume:.17}]},
 {file:'06.mp4',type:'world',accent:TEAL,cues:[
  {from:0.1,to:3.1,text:'Lo primero que alaban es el mundo abierto.',emphasis:'mundo abierto'},
  {from:3.1,to:6.3,text:'Enorme, vivo y lleno de detalles.',emphasis:'vivo'},
  {from:6.3,to:9.8,text:'Dicen que te hace sentir dentro de él.',emphasis:'dentro de él'}
 ],sfx:[{at:1.8,file:'04_whoosh.wav',volume:.15},{at:5.1,file:'21_burbuja.wav',volume:.15}]},
 {file:'07.mp4',type:'duo',accent:PINK,cues:[
  {from:0.1,to:3.3,text:'Los dos protagonistas son lo más elogiado de la historia.',emphasis:'dos protagonistas'},
  {from:3.3,to:6.5,text:'Una pareja que se siente creíble.',emphasis:'creíble'},
  {from:6.5,to:9.8,text:'Y tú ayudas a moldearla con tus decisiones.',emphasis:'tus decisiones'}
 ],sfx:[{at:2.2,file:'02_pop_agudo.wav',volume:.16},{at:5.2,file:'02_pop_agudo.wav',volume:.15},{at:7.2,file:'15_boing.wav',volume:.14}]},
 {file:'08.mp4',type:'hours',accent:ORANGE,cues:[
  {from:0.1,to:3.3,text:'La historia principal dura unas 60 horas.',emphasis:'60 horas'},
  {from:3.3,to:6.4,text:'Y con todo lo demás, pasa de 100.',emphasis:'pasa de 100'},
  {from:6.4,to:9.8,text:'Es muchísimo juego por lo que cuesta.',emphasis:'muchísimo juego'}
 ],sfx:[{at:1.1,file:'10_tic_tac.wav',volume:.15},{at:5.4,file:'21_burbuja.wav',volume:.16}]},
 {file:'09.mp4',type:'reviews',accent:ORANGE,cues:[
  {from:0.1,to:3.3,text:'IGN, GameSpot y Eurogamer le dieron la nota máxima.',emphasis:'nota máxima'},
  {from:3.3,to:6.5,text:'Uno lo llamó el juego de la generación.',emphasis:'juego de la generación'},
  {from:6.5,to:9.8,text:'Las notas más bajas rondan el 80.',emphasis:'80'}
 ],sfx:[{at:1.6,file:'02_pop_agudo.wav',volume:.17},{at:5.0,file:'01_pop.wav',volume:.15}]},
 {file:'10.mp4',type:'fps',accent:PINK,cues:[
  {from:0.1,to:2.6,text:'Ahora, las pegas.',emphasis:'pegas'},
  {from:2.6,to:6.3,text:'La más repetida: 30 fotogramas por segundo.',emphasis:'30 fotogramas'},
  {from:6.3,to:9.8,text:'Y sin un modo de 60, incluso en PS5 Pro.',emphasis:'sin un modo de 60'}
 ],sfx:[{at:0.2,file:'13_golpe_bajo.wav',volume:.22},{at:3.2,file:'27_alarma.wav',volume:.15},{at:7.2,file:'08_error.wav',volume:.18}]},
 {file:'11.mp4',type:'performance',accent:PINK,cues:[
  {from:0.1,to:3.2,text:'Varias reseñas notan caídas de rendimiento.',emphasis:'caídas de rendimiento'},
  {from:3.2,to:6.4,text:'Sobre todo en zonas muy llenas y en tiroteos.',emphasis:'zonas muy llenas'},
  {from:6.4,to:9.8,text:'Aunque otros críticos lo ven fluido y estable.',emphasis:'fluido y estable'}
 ],sfx:[{at:2.3,file:'08_error.wav',volume:.16},{at:5.2,file:'27_alarma.wav',volume:.13},{at:7.4,file:'21_burbuja.wav',volume:.12}]},
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
 ],sfx:[{at:3.3,file:'17_moneda.wav',volume:.18},{at:6.6,file:'21_burbuja.wav',volume:.16}]},
 {file:'15.mp4',type:'comparison',accent:ORANGE,cues:[
  {from:0.1,to:3.3,text:'Para comparar: GTA 5 vendió 11 millones el primer día.',emphasis:'11 millones'},
  {from:3.3,to:6.5,text:'Según esa estimación, las preventas ya lo superan.',emphasis:'ya lo superan'},
  {from:6.5,to:9.8,text:'Faltan las cifras oficiales.',emphasis:'cifras oficiales'}
 ],sfx:[{at:2.4,file:'13_golpe_bajo.wav',volume:.16},{at:5.4,file:'17_moneda.wav',volume:.14},{at:7.5,file:'08_error.wav',volume:.12}]},
 {file:'16.mp4',type:'split',accent:TEAL,cues:[
  {from:0.1,to:3.3,text:'¿Superó las expectativas? Para los críticos, sí.',emphasis:'sí'},
  {from:3.3,to:6.5,text:'Para algunos jugadores hay matices.',emphasis:'matices'},
  {from:6.5,to:9.8,text:'Y aun así, el aplauso es casi unánime.',emphasis:'casi unánime'}
 ],sfx:[{at:2.2,file:'21_burbuja.wav',volume:.15},{at:5.1,file:'08_error.wav',volume:.13},{at:7.6,file:'12_sorpresa.wav',volume:.15}]},
 {file:'17.mp4',type:'verdict',accent:TEAL,cues:[
  {from:0.1,to:3.3,text:'Mi veredicto: no es perfecto, pero es histórico.',emphasis:'histórico'},
  {from:3.3,to:6.5,text:'Las pegas son técnicas y de ritmo, no de ambición.',emphasis:'no de ambición'},
  {from:6.5,to:9.8,text:'Y la última palabra la tienes tú, jugándolo.',emphasis:'la tienes tú'}
 ],sfx:[{at:1.4,file:'13_golpe_bajo.wav',volume:.17},{at:7.1,file:'05_whoosh_largo.wav',volume:.14}]},
 {file:'18.mp4',type:'outro',accent:PINK,cues:[
  {from:0.1,to:3.3,text:'¿Qué nota le pondrías tú a GTA 6?',emphasis:'qué nota'},
  {from:3.3,to:6.5,text:'Suscríbete a Zinko para más curiosidad.',emphasis:'Suscríbete'},
  {from:6.5,to:9.8,text:'Y mira el siguiente vídeo, está justo aquí.',emphasis:'siguiente vídeo'}
 ],sfx:[{at:0.8,file:'01_pop.wav',volume:.14},{at:4.5,file:'21_burbuja.wav',volume:.14},{at:7.5,file:'05_whoosh_largo.wav',volume:.16}]}
];

type TextProps={children:React.ReactNode;x:number;y:number;size:number;frame:number;delay?:number;color?:string;angle?:number;depth?:number;width?:number;align?:'left'|'center'|'right'};
function Type3D({children,x,y,size,frame,delay=0,color=YELLOW,angle=0,depth=7,width,align='center'}:TextProps){
 const p=pop(frame,delay,10),q=ease((frame-delay)/13);
 const shadows=Array.from({length:depth},(_,i)=>(i+1)+'px '+(i+2)+'px 0 '+INK).join(',');
 return <div style={{position:'absolute',left:x,top:y,width:width||'auto',textAlign:align,whiteSpace:'pre-line',fontFamily:'ImpactLocal',fontSize:size,lineHeight:.91,letterSpacing:-1,color:color,WebkitTextStroke:'3px '+INK,paintOrder:'stroke fill',textShadow:shadows+',0 16px 24px #0008',transform:'translate(-50%,-50%) perspective(1100px) rotateX('+(1-q)*22+'deg) rotateY('+(1-q)*-28+'deg) rotateZ('+(angle+(1-q)*-8)+'deg) translateY('+(1-q)*70+'px) scale('+(Math.max(.01,.68+.32*p))+')',transformOrigin:'50% 75%',opacity:clamp((frame-delay)/3)}}>{children}</div>;
}
function NicoSticker({frame,x,y,width,pose='happy',angle=0,delay=0}:{frame:number;x:number;y:number;width:number;pose?:'happy'|'question';angle?:number;delay?:number}){
 const p=pop(frame,delay,10), bob=Math.sin((frame-delay)*.11)*5;
 return <Img src={asset('nico/nico-'+pose+'.webp')} style={{position:'absolute',left:x,top:y,width,transform:'translate(-50%,-50%) rotate('+(angle+2*Math.sin(frame*.07))+'deg) translateY('+(70*(1-ease((frame-delay)/10))+bob)+'px) scale('+(Math.max(.01,p)) +')',filter:'drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 4px 0 white) drop-shadow(12px 18px 9px #0007)',opacity:clamp((frame-delay)/2)}}/>;
}
function PhotoCard({name,frame,x,y,width,ratio=16/9,angle=-5,delay=0,border=11}:{name:string;frame:number;x:number;y:number;width:number;ratio?:number;angle?:number;delay?:number;border?:number}){
 const p=pop(frame,delay,13),wobble=Math.sin(frame*.055+angle)*1.2;
 return <div style={{position:'absolute',left:x,top:y,width,height:width/ratio,padding:border,background:'#fffdf5',boxShadow:'12px 20px 24px #0007,0 0 0 1px #17151b',transform:'translate(-50%,-50%) perspective(1300px) rotateY('+(angle*.7+(1-ease((frame-delay)/15))*-18)+'deg) rotateZ('+(angle+wobble)+'deg) scale('+(Math.max(.01,p)) +')',transformOrigin:'50% 50%'}}>
  <Img src={asset('stills/'+name)} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
  <div style={{position:'absolute',left:border,top:border,width:18,height:18,borderRadius:'50%',background:'#ddd8ca',boxShadow:'inset 0 2px 3px #0003'}}/>
 </div>;
}
function Sticker({text,frame,x,y,color=YELLOW,angle=-3,delay=0,size=26}:{text:string;frame:number;x:number;y:number;color?:string;angle?:number;delay?:number;size?:number}){
 const p=pop(frame,delay,11);
 return <div style={{position:'absolute',left:x,top:y,padding:'9px 16px 8px',background:color,color:INK,fontFamily:'ImpactLocal',fontSize:size,letterSpacing:1.1,boxShadow:'6px 8px 0 '+INK+',0 12px 18px #0006',transform:'translate(-50%,-50%) rotate('+(angle+(1-p)*-8)+'deg) scale('+(Math.max(.01,p)) +')',opacity:clamp((frame-delay)/2),whiteSpace:'nowrap'}}>{text}</div>;
}
function PaperStrip({frame,x,y,width,height,angle=0,delay=0,color=PAPER,children}:{frame:number;x:number;y:number;width:number;height:number;angle?:number;delay?:number;color?:string;children:React.ReactNode}){
 const p=pop(frame,delay,14);
 return <div style={{position:'absolute',left:x,top:y,width,height,background:color,boxShadow:'9px 14px 20px #0006',clipPath:'polygon(0 0,100% 0,100% 92%,96% 100%,90% 96%,84% 100%,78% 96%,72% 100%,66% 96%,60% 100%,54% 96%,48% 100%,42% 96%,36% 100%,30% 96%,24% 100%,18% 96%,12% 100%,6% 96%,0 100%)',transform:'translate(-50%,-50%) rotate('+(angle+(1-p)*-5)+'deg) translateY('+(1-p)*60+'px) scale('+(Math.max(.01,p))+')',display:'flex',alignItems:'center',justifyContent:'center'}}>{children}</div>;
}
function PaperTexture({frame,opacity=.22}:{frame:number;opacity?:number}){
 return <Img src={asset('paper.jpg')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:opacity,transform:'scale(1.04) translate('+(Math.sin(frame*.018)*8)+'px,'+(Math.cos(frame*.02)*7)+'px)',mixBlendMode:'screen'}}/>;
}
function Caption({scene,frame}:{scene:SceneData;frame:number}){
 const sec=frame/FPS,cue=scene.cues.find(c=>sec>=c.from&&sec<c.to);
 if(!cue)return null;
 const start=Math.round(cue.from*FPS);
 const startEm=cue.emphasis?cue.text.toLowerCase().indexOf(cue.emphasis.toLowerCase()):-1;
 const endEm=startEm>=0?startEm+cue.emphasis!.length:-1;
 const words=[...cue.text.matchAll(/\S+/g)];
 return <div style={{position:'absolute',left:120,right:120,bottom:48,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
  <div style={{maxWidth:1650,display:'flex',justifyContent:'center',alignItems:'center',flexWrap:'wrap',columnGap:12,rowGap:0,textAlign:'center',fontFamily:'CaptionLocal',fontSize:47,lineHeight:1.12,fontWeight:900,color:YELLOW,WebkitTextStroke:'3.5px '+INK,paintOrder:'stroke fill',textShadow:'2px 5px 0 '+INK+',0 8px 16px #0009'}}>
   {words.map((m,i)=>{
    const word=m[0],a=m.index??0,b=a+word.length,hot=startEm>=0&&a<endEm&&b>startEm,local=frame-start-i*2.1;
    const p=spring({frame:Math.max(0,local),fps:FPS,config:{mass:.5,damping:13,stiffness:205}});
    return <span key={i} style={{display:'inline-block',whiteSpace:'pre',opacity:local>=0?1:0,color:hot?PAPER:YELLOW,textShadow:hot?'0 0 15px '+scene.accent+',2px 5px 0 '+INK+',0 8px 16px #0009':'2px 5px 0 '+INK+',0 8px 16px #0009',transform:'translateY('+(local>=0?(1-p)*22:22)+'px) scale('+(local>=0?.88+.12*p:.88)+') rotateX('+(local>=0?(1-p)*16:16)+'deg)',transformOrigin:'50% 100%'}}>{word}</span>;
   })}
  </div>
 </div>;
}
function BackgroundClip({scene,index,frame}:{scene:SceneData;index:number;frame:number}){
 const active=scene.cues.find(c=>frame/FPS>=c.from&&frame/FPS<c.to);
 const hit=active?Math.max(0,frame-Math.round(active.from*FPS)):50;
 const kick=active&&hit<10?Math.sin(hit*2.7)*Math.exp(-hit/4.5)*5:0;
 const zoom=1.045+.018*Math.sin(frame*.026+index*.8)+(active&&hit<18?.045*Math.exp(-hit/7):0);
 const x=Math.sin(frame*.023+index*1.7)*13+kick,y=Math.cos(frame*.019+index)*8;
 return <AbsoluteFill style={{overflow:'hidden',background:INK}}>
  <OffthreadVideo src={asset('clips/'+scene.file)} startFrom={12} playbackRate={0.95} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale('+zoom+') translate('+x+'px,'+y+'px)',filter:'saturate(1.08) contrast(1.08)'}}/>
  <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(5,5,12,.32),transparent 42%,rgba(5,5,12,.18)),linear-gradient(180deg,rgba(5,5,12,.12),transparent 38%,rgba(5,5,12,.32))'}}/>
 </AbsoluteFill>;
}
function TransitionHit({index,frame}:{index:number;frame:number}){
 if(index===0||index%2===0||frame>11)return null;
 const p=ease(frame/11),variant=index%4;
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  {variant===1&&<div style={{position:'absolute',top:-180,left:-1800+frame*340,width:3000,height:1450,background:PAPER,clipPath:'polygon(0 0,100% 0,100% 78%,94% 83%,88% 78%,82% 85%,76% 79%,70% 86%,64% 79%,58% 84%,52% 78%,46% 85%,40% 78%,34% 84%,28% 78%,22% 85%,16% 79%,10% 84%,0 78%)',transform:'rotate(-8deg)',opacity:1-p}}/>}
  {variant===3&&<><div style={{position:'absolute',inset:0,background:YELLOW,opacity:Math.max(0,1-frame/3)*.8}}/>{[0,1,2,3,4,5].map(i=><div key={i} style={{position:'absolute',left:-500+i*420+frame*95,top:-100,width:130,height:1300,background:i%2?PINK:TEAL,transform:'skewX(-22deg)',opacity:(1-p)*.9}}/>)}</>}
  {variant===2&&<><div style={{position:'absolute',left:'50%',top:'50%',width:180+frame*270,height:180+frame*270,borderRadius:'50%',border:'24px solid '+PAPER,transform:'translate(-50%,-50%)',boxShadow:'0 0 0 2000px '+INK,opacity:1-p}}/><div style={{position:'absolute',inset:0,background:ORANGE,opacity:Math.max(0,1-frame/2)*.45}}/></>}
  {variant===0&&<><div style={{position:'absolute',inset:0,background:PAPER,opacity:Math.max(0,1-frame/2)*.75}}/>{[0,1,2,3,4,5,6].map(i=><div key={i} style={{position:'absolute',left:-900+i*360+frame*220,top:70+i*130,width:1100,height:34,background:i%2?PINK:INK,transform:'rotate(-18deg)',opacity:(1-p)*.75}}/>)}</>}
 </AbsoluteFill>;
}
function Art({index,frame}:{index:number;frame:number}){
 const a=frame,beat=frame%92;
 if(index===0)return <>
  <Type3D x={360} y={330} size={310} frame={a} delay={2} angle={-8}>28</Type3D>
  <Type3D x={365} y={535} size={104} frame={a} delay={10} color={PAPER} angle={-8}>AÑOS</Type3D>
  <Type3D x={360} y={650} size={62} frame={a} delay={20} color={ORANGE} angle={-8}>RÉCORD HISTÓRICO</Type3D>
  <svg viewBox="0 0 500 560" width="500" height="560" style={{position:'absolute',left:790,top:170,filter:'drop-shadow(0 22px 16px #0008)',transform:'translateY('+(1-pop(a,15))*90+'px) rotate('+(Math.sin(a*.04)*2)+'deg) scale('+(.8+.2*pop(a,15))+')'}}>
   <path d="M145 115 H355 L335 300 Q250 365 165 300 Z" fill="#ffb74b55" stroke={ORANGE} strokeWidth="16"/><path d="M145 150 Q30 85 65 225 Q90 295 172 286 M355 150 Q470 85 435 225 Q410 295 328 286" fill="none" stroke={ORANGE} strokeWidth="15"/><path d="M250 365 V445 M165 470 H335" stroke={PAPER} strokeWidth="16" strokeLinecap="round"/>
   <path d="M135 115 L90 70 L115 125 M355 115 L405 70 L385 125 M170 145 L210 190 L180 225 M330 145 L290 190 L320 225" stroke={PAPER} strokeWidth="4" fill="none" opacity=".8"/>
   <path d="M145 115 L250 165 L355 115 M165 300 L250 250 L335 300" stroke={PAPER} strokeWidth="3" fill="none" opacity=".5"/>
  </svg>
  <PhotoCard name="jason-lucia-17.jpg" frame={a} x={1480} y={345} width={460} ratio={16/9} angle={7} delay={24}/>
  <NicoSticker frame={a} x={1650} y={785} width={250} pose="question" angle={-5} delay={38}/>
  <Sticker text="PERO HAY PEGAS" frame={a} x={1200} y={690} color={PINK} angle={-5} delay={155} size={31}/>
 </>;
 if(index===1)return <>
  <PaperTexture frame={a} opacity={.25}/>
  <PaperStrip frame={a} x={600} y={270} width={800} height={220} angle={-3} delay={3}><span style={{fontFamily:'ImpactLocal',fontSize:150,color:INK,letterSpacing:5}}>ZINKO</span></PaperStrip>
  <NicoSticker frame={a} x={385} y={690} width={430} pose="happy" angle={-4} delay={12}/>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',inset:0}}>
   <g fill="none" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1030 320 C900 190 790 330 1030 520 C1270 330 1160 190 1030 320" stroke={TEAL} strokeDasharray="900" strokeDashoffset={900*(1-ease((a-16)/30))}/>
    <path d="M1400 230 L1580 230 L1490 405 Z" stroke={PINK} strokeDasharray="650" strokeDashoffset={650*(1-ease((a-45)/25))}/>
    <path d="M1130 720 L1130 565 M950 565 H1310 M1000 565 L930 700 H1070 Z M1260 565 L1190 700 H1330 Z" stroke={ORANGE} strokeDasharray="1200" strokeDashoffset={1200*(1-ease((a-95)/30))}/>
   </g>
  </svg>
  <Sticker text="QUÉ AMAN" frame={a} x={1000} y={585} color={TEAL} delay={30}/>
  <Sticker text="QUÉ CRITICAN" frame={a} x={1500} y={465} color={PINK} delay={60}/>
  <Type3D x={1120} y={880} size={74} frame={a} delay={118} color={PAPER}>MI VEREDICTO</Type3D>
 </>;
 if(index===2)return <>
  <PhotoCard name="vice-city-14.jpg" frame={a} x={420} y={380} width={510} angle={-7} delay={6}/>
  <svg viewBox="0 0 700 700" width="700" height="700" style={{position:'absolute',left:700,top:70,filter:'drop-shadow(0 20px 16px #0007)',transform:'rotate('+(a*.16)+'deg)'}}>
   <circle cx="350" cy="350" r="270" fill="none" stroke={PAPER} strokeWidth="18" opacity=".2"/>
   <circle cx="350" cy="350" r="270" fill="none" stroke={ORANGE} strokeWidth="24" strokeDasharray="1696" strokeDashoffset={1696*(1-ease(a/65))} strokeLinecap="round" transform="rotate(-90 350 350)"/>
   <circle cx="350" cy="350" r="220" fill="none" stroke={PAPER} strokeWidth="2" strokeDasharray="8 18" opacity=".6"/>
  </svg>
  <Type3D x={1040} y={390} size={270} frame={a} delay={8} color={PAPER} depth={11}>99</Type3D>
  <Type3D x={1060} y={565} size={96} frame={a} delay={20} color={YELLOW}>/100</Type3D>
  <Sticker text="METACRITIC" frame={a} x={1320} y={690} color={ORANGE} delay={32}/>
  <div style={{position:'absolute',right:110,bottom:180,width:400,display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:8,transform:'rotate(-5deg)'}}>
   {Array.from({length:70},(_,i)=><div key={i} style={{width:12,height:12,borderRadius:'50%',background:i<Math.round(70*ease((a-35)/45))?TEAL:'#fff4',boxShadow:i<Math.round(70*ease((a-35)/45))?'0 0 8px '+TEAL:'none'}}/>)}
  </div>
  <Type3D x={1570} y={820} size={56} frame={a} delay={52} color={PAPER}>140+ CRÍTICOS</Type3D>
 </>;
 if(index===3)return <>
  <PaperTexture frame={a} opacity={.18}/>
  <PhotoCard name="vice-city-17.jpg" frame={a} x={1400} y={340} width={500} angle={7} delay={36}/>
  <PaperStrip frame={a} x={500} y={340} width={490} height={400} angle={-6} delay={10} color="#f0e9d9"><div style={{textAlign:'center',color:INK}}><div style={{fontFamily:'ImpactLocal',fontSize:54}}>1998</div><div style={{fontFamily:'ImpactLocal',fontSize:32,marginTop:16}}>OCARINA OF TIME</div><div style={{fontSize:110,marginTop:10}}>✦</div></div></PaperStrip>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',inset:0}}>
   <path d="M720 520 C900 370 1040 680 1220 520" fill="none" stroke={YELLOW} strokeWidth="12" strokeDasharray="25 20" strokeDashoffset={450*(1-ease(a/40))}/>
   <circle cx="720" cy="520" r="18" fill={PINK}/><circle cx="1220" cy="520" r="18" fill={TEAL}/>
  </svg>
  <Type3D x={965} y={395} size={105} frame={a} delay={18} color={PAPER}>28 AÑOS</Type3D>
  <Type3D x={965} y={620} size={92} frame={a} delay={55}>2026</Type3D>
  <Sticker text="EL RÉCORD SE IGUALA" frame={a} x={965} y={765} color={ORANGE} delay={78}/>
 </>;
 if(index===4)return <>
  <Type3D x={960} y={170} size={76} frame={a} delay={2} color={PAPER}>EL PODIO DE GTA</Type3D>
  <svg viewBox="0 0 1400 700" width="1400" height="700" style={{position:'absolute',left:260,top:220}}>
   {[{v:98,label:'GTA IV',x:130,c:ORANGE},{v:97,label:'GTA V',x:500,c:TEAL},{v:99,label:'GTA VI',x:870,c:YELLOW}].map((b,i)=>{
    const h=b.v*4.1*ease((a-8-i*9)/28);
    return <g key={b.label}><rect x={b.x} y={570-h} width="230" height={h} fill={b.c} opacity=".95"/><rect x={b.x-12} y={560-h} width="254" height="16" fill={PAPER}/><text x={b.x+115} y={520-h} fill={PAPER} fontSize="80" fontFamily="ImpactLocal" textAnchor="middle">{b.v}</text><text x={b.x+115} y="645" fill={PAPER} fontSize="45" fontFamily="ImpactLocal" textAnchor="middle">{b.label}</text></g>;
   })}
  </svg>
  <Sticker text="CERO RESEÑAS NEGATIVAS AL INICIO" frame={a} x={960} y={890} color={TEAL} delay={70} size={27}/>
 </>;
 if(index===5)return <>
  <PhotoCard name="vice-city-20.jpg" frame={a} x={980} y={390} width={770} angle={-2} delay={3}/>
  <PhotoCard name="grassrivers-07.jpg" frame={a} x={430} y={330} width={440} angle={-9} delay={18}/>
  <PhotoCard name="leonida-keys-06.jpg" frame={a} x={1480} y={730} width={440} angle={8} delay={32}/>
  <Type3D x={980} y={780} size={124} frame={a} delay={50} color={PAPER}>MUNDO VIVO</Type3D>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',inset:0}}>
   <path d="M210 690 Q520 480 770 620 T1510 420" stroke={YELLOW} strokeWidth="11" fill="none" strokeLinecap="round" strokeDasharray="16 18" strokeDashoffset={850*(1-ease(a/50))}/>
   <path d="M1510 420 l-55 -6 l24 44" stroke={YELLOW} strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
 </>;
 if(index===6)return <>
  <PhotoCard name="jason-duval-14.jpg" frame={a} x={600} y={420} width={590} ratio={4/5} angle={-7} delay={4}/>
  <PhotoCard name="lucia-caminos-12.jpg" frame={a} x={1320} y={420} width={590} ratio={4/5} angle={7} delay={20}/>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',inset:0}}>
   <path d="M870 460 C960 330 1030 590 1120 460" fill="none" stroke={PINK} strokeWidth="13" strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420*(1-ease((a-40)/35))}/>
   <path d="M995 405 C950 345 890 410 995 500 C1100 410 1040 345 995 405" fill={PINK} stroke={PAPER} strokeWidth="6" opacity={ease((a-60)/15)}/>
  </svg>
  <Sticker text="JASON" frame={a} x={600} y={790} color={TEAL} delay={15} size={30}/>
  <Sticker text="LUCIA" frame={a} x={1320} y={790} color={PINK} delay={32} size={30}/>
  <Type3D x={960} y={900} size={88} frame={a} delay={62} color={PAPER}>UNA PAREJA CREÍBLE</Type3D>
 </>;
 if(index===7)return <>
  <svg viewBox="0 0 650 650" width="650" height="650" style={{position:'absolute',left:210,top:160,filter:'drop-shadow(0 20px 18px #0008)'}}>
   <circle cx="325" cy="325" r="260" fill="#11101a" stroke={PAPER} strokeWidth="18"/><circle cx="325" cy="325" r="220" fill="none" stroke={ORANGE} strokeWidth="18" strokeDasharray="1382" strokeDashoffset={1382*(1-ease(a/55))} transform="rotate(-90 325 325)"/>
   {Array.from({length:12},(_,i)=><path key={i} d="M325 80 V115" stroke={PAPER} strokeWidth="10" transform={'rotate('+(i*30)+' 325 325)'}/>)}<path d="M325 325 L325 170 M325 325 L450 380" stroke={YELLOW} strokeWidth="18" strokeLinecap="round"/><circle cx="325" cy="325" r="18" fill={PAPER}/>
  </svg>
  <Type3D x={1150} y={320} size={230} frame={a} delay={6}>60H</Type3D>
  <Type3D x={1430} y={565} size={150} frame={a} delay={36} color={TEAL}>100+</Type3D>
  <Sticker text="HISTORIA PRINCIPAL" frame={a} x={1160} y={480} color={ORANGE} delay={24}/>
  <Sticker text="COMPLETAR TODO" frame={a} x={1440} y={680} color={TEAL} delay={54}/>
  <PaperStrip frame={a} x={1050} y={850} width={640} height={100} angle={-2} delay={70}><span style={{fontFamily:'ImpactLocal',fontSize:42,color:INK}}>MUCHÍSIMO JUEGO</span></PaperStrip>
 </>;
 if(index===8)return <>
  <PaperStrip frame={a} x={470} y={430} width={430} height={470} angle={-7} delay={5}><div style={{textAlign:'center',color:INK}}><div style={{fontFamily:'ImpactLocal',fontSize:68}}>IGN</div><div style={{fontFamily:'ImpactLocal',fontSize:160,color:ORANGE}}>100</div><div style={{fontFamily:'ImpactLocal',fontSize:28}}>NOTA MÁXIMA</div></div></PaperStrip>
  <PaperStrip frame={a} x={970} y={410} width={430} height={470} angle={2} delay={18}><div style={{textAlign:'center',color:INK}}><div style={{fontFamily:'ImpactLocal',fontSize:48}}>GAMESPOT</div><div style={{fontFamily:'ImpactLocal',fontSize:160,color:PINK}}>100</div><div style={{fontFamily:'ImpactLocal',fontSize:28}}>NOTA MÁXIMA</div></div></PaperStrip>
  <PaperStrip frame={a} x={1470} y={440} width={430} height={470} angle={8} delay={31}><div style={{textAlign:'center',color:INK}}><div style={{fontFamily:'ImpactLocal',fontSize:42}}>EUROGAMER</div><div style={{fontFamily:'ImpactLocal',fontSize:160,color:TEAL}}>100</div><div style={{fontFamily:'ImpactLocal',fontSize:28}}>NOTA MÁXIMA</div></div></PaperStrip>
  <Sticker text="JUEGO DE LA GENERACIÓN" frame={a} x={960} y={150} color={YELLOW} delay={58} size={32}/>
  <Sticker text="LAS MÁS BAJAS ≈ 80" frame={a} x={960} y={920} color={ORANGE} delay={84} size={28}/>
 </>;
 if(index===9)return <>
  <Type3D x={950} y={390} size={340} frame={a} delay={4} color={PAPER} depth={12}>30</Type3D>
  <Type3D x={950} y={610} size={125} frame={a} delay={16} color={PINK}>FPS</Type3D>
  <div style={{position:'absolute',left:1390,top:260,transform:'rotate(12deg) scale('+pop(a,35)+')',opacity:clamp((a-35)/5)}}><Type3D x={0} y={0} size={135} frame={a-35} delay={0} color="#888">60</Type3D><svg width="400" height="180" style={{position:'absolute',left:-200,top:-90}}><path d="M40 20 L360 155" stroke={PINK} strokeWidth="24" strokeLinecap="round" strokeDasharray="430" strokeDashoffset={430*(1-ease((a-42)/16))}/></svg></div>
  <Img src={asset('gear/ps5.webp')} style={{position:'absolute',left:390,top:720,width:220,transform:'translate(-50%,-50%) rotate(-8deg) scale('+pop(a,30)+')',filter:'drop-shadow(10px 18px 12px #0008)'}}/>
  <Img src={asset('gear/xbox.webp')} style={{position:'absolute',left:1500,top:730,width:250,transform:'translate(-50%,-50%) rotate(8deg) scale('+pop(a,50)+')',filter:'drop-shadow(10px 18px 12px #0008)'}}/>
  <Sticker text="SIN MODO DE 60 FPS" frame={a} x={960} y={850} color={PINK} delay={68}/>
 </>;
 if(index===10)return <>
  <Type3D x={500} y={210} size={108} frame={a} delay={3} color={PAPER}>CAÍDAS</Type3D>
  <svg viewBox="0 0 1000 560" width="1000" height="560" style={{position:'absolute',left:740,top:210,filter:'drop-shadow(0 10px 12px #0008)'}}>
   {[100,200,300,400,500].map(y=><line key={y} x1="40" y1={y} x2="960" y2={y} stroke="#ffffff55" strokeWidth="2" strokeDasharray="7 14"/>)}
   <path d="M40 280 L120 255 L200 290 L280 140 L360 340 L440 245 L520 290 L600 110 L680 355 L760 240 L840 180 L960 285" fill="none" stroke={PINK} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1500" strokeDashoffset={1500*(1-ease(a/65))}/>
   <circle cx={600+Math.sin(a*.08)*5} cy="110" r="20" fill={YELLOW}/><circle cx="280" cy="140" r="20" fill={YELLOW}/>
  </svg>
  <Sticker text="ZONAS MUY LLENAS" frame={a} x={480} y={430} color={ORANGE} delay={35}/>
  <Sticker text="TIROTEOS" frame={a} x={1350} y={780} color={PINK} delay={55}/>
  <Type3D x={970} y={880} size={90} frame={a} delay={100} color={TEAL}>FLUIDO PARA OTROS</Type3D>
 </>;
 if(index===11)return <>
  <PaperTexture frame={a} opacity={.2}/>
  <Type3D x={960} y={185} size={116} frame={a} delay={4} color={PAPER}>RITMO DESIGUAL</Type3D>
  <svg viewBox="0 0 1500 500" width="1500" height="500" style={{position:'absolute',left:210,top:350}}>
   <path d="M70 260 H1420" stroke={PAPER} strokeWidth="16" strokeLinecap="round"/>
   <path d="M70 260 H490" stroke={PINK} strokeWidth="26" strokeLinecap="round" strokeDasharray="14 15" strokeDashoffset={600*(1-ease(a/35))}/>
   <path d="M490 260 H1040" stroke={ORANGE} strokeWidth="26" strokeLinecap="round" strokeDasharray="14 15" strokeDashoffset={650*(1-ease((a-25)/40))}/>
   <path d="M1040 260 H1420" stroke={TEAL} strokeWidth="26" strokeLinecap="round" strokeDasharray="14 15" strokeDashoffset={420*(1-ease((a-45)/40))}/>
   {[70,490,1040,1420].map((x,i)=><g key={x}><circle cx={x} cy="260" r="36" fill={INK} stroke={[PINK,ORANGE,TEAL,PAPER][i]} strokeWidth="12"/><text x={x} y="365" fill={PAPER} fontSize="34" textAnchor="middle" fontFamily="ImpactLocal">{['INICIO','MISIONES','CINEMÁTICAS','FIN'][i]}</text></g>)}
  </svg>
  <Sticker text="INICIO LENTO" frame={a} x={430} y={700} color={PINK} delay={35}/>
  <Sticker text="MUY GUIADAS" frame={a} x={970} y={700} color={ORANGE} delay={55}/>
  <Type3D x={1430} y={820} size={64} frame={a} delay={78} color={PAPER}>POCO CONTROL</Type3D>
 </>;
 if(index===12)return <>
  <PhotoCard name="grotti-cheetah-01.jpg" frame={a} x={1070} y={420} width={850} angle={-4} delay={8}/>
  <Type3D x={460} y={265} size={88} frame={a} delay={3} color={PAPER}>MÁS REALISMO</Type3D>
  <Type3D x={450} y={400} size={94} frame={a} delay={20} color={ORANGE}>MÁS GESTIÓN</Type3D>
  <svg viewBox="0 0 600 480" width="600" height="480" style={{position:'absolute',left:180,top:480}}>
   <g fill="none" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"><path d="M100 140 L210 140 L210 300 L100 300 Z" stroke={TEAL}/><path d="M130 185 L180 185 M130 220 L180 220 M130 255 L180 255" stroke={PAPER}/><circle cx="390" cy="180" r="90" stroke={ORANGE}/><path d="M390 110 V180 L450 215" stroke={ORANGE}/><path d="M90 390 H500" stroke={PINK}/></g>
   <text x="390" y="330" fill={PAPER} fontSize="48" fontFamily="ImpactLocal" textAnchor="middle">GASTOS</text>
  </svg>
  <Sticker text="COCHES" frame={a} x={780} y={830} color={ORANGE} delay={40}/>
  <Sticker text="TAREAS" frame={a} x={1250} y={830} color={TEAL} delay={58}/>
 </>;
 if(index===13)return <>
  <Type3D x={930} y={400} size={300} frame={a} delay={5} color={PAPER} depth={12}>17M+</Type3D>
  <svg viewBox="0 0 900 600" width="900" height="600" style={{position:'absolute',left:570,top:330}}>
   {[0,1,2,3,4,5].map(i=><g key={i} transform={'translate('+(150+i*115)+' '+(420-i*25)+') rotate('+(Math.sin(a*.05+i)*5)+' 0 0)'}><ellipse cx="0" cy="0" rx="55" ry="19" fill="#ffd978" stroke={ORANGE} strokeWidth="7"/><path d="M-55 0 V45 Q0 75 55 45 V0" fill="#a96824" stroke={ORANGE} strokeWidth="7"/><ellipse cx="0" cy="0" rx="55" ry="19" fill="#ffd978" stroke={ORANGE} strokeWidth="7"/></g>)}
  </svg>
  <Sticker text="ESTIMACIÓN SENSOR TOWER" frame={a} x={960} y={650} color={ORANGE} delay={55}/>
  <Type3D x={960} y={800} size={76} frame={a} delay={80} color={PAPER}>80–100 USD CADA UNA</Type3D>
  <NicoSticker frame={a} x={1600} y={810} width={240} pose="question" angle={4} delay={95}/>
 </>;
 if(index===14)return <>
  <Type3D x={960} y={150} size={92} frame={a} delay={2} color={PAPER}>11M VS 17M</Type3D>
  <svg viewBox="0 0 1400 650" width="1400" height="650" style={{position:'absolute',left:260,top:250}}>
   <path d="M90 555 H1310" stroke={PAPER} strokeWidth="12"/>
   <rect x="210" y={555-250*ease((a-8)/40)} width="330" height={250*ease((a-8)/40)} fill={ORANGE}/>
   <rect x="850" y={555-390*ease((a-28)/45)} width="330" height={390*ease((a-28)/45)} fill={TEAL}/>
   <text x="375" y={510-250*ease((a-8)/40)} fill={PAPER} fontSize="84" fontFamily="ImpactLocal" textAnchor="middle">11M</text>
   <text x="1015" y={510-390*ease((a-28)/45)} fill={PAPER} fontSize="84" fontFamily="ImpactLocal" textAnchor="middle">17M*</text>
   <text x="375" y="625" fill={PAPER} fontSize="40" fontFamily="ImpactLocal" textAnchor="middle">GTA V · DÍA 1</text>
   <text x="1015" y="625" fill={PAPER} fontSize="40" fontFamily="ImpactLocal" textAnchor="middle">GTA VI · PREVENTAS</text>
  </svg>
  <Sticker text="MÉTRICAS DISTINTAS" frame={a} x={960} y={850} color={YELLOW} delay={68}/>
  <Sticker text="*ESTIMACIÓN, NO CIFRA OFICIAL" frame={a} x={960} y={925} color={PAPER} delay={85} size={22}/>
 </>;
 if(index===15)return <>
  <PaperStrip frame={a} x={500} y={490} width={740} height={570} angle={-5} delay={3} color="#e7f0e9"><div style={{textAlign:'center',color:INK}}><div style={{fontFamily:'ImpactLocal',fontSize:62}}>CRÍTICOS</div><div style={{fontFamily:'ImpactLocal',fontSize:160,color:'#139b83'}}>SÍ</div><div style={{fontFamily:'ImpactLocal',fontSize:32}}>CASI UNÁNIME</div></div></PaperStrip>
  <PaperStrip frame={a} x={1410} y={490} width={740} height={570} angle={5} delay={22} color="#f2e2e9"><div style={{textAlign:'center',color:INK}}><div style={{fontFamily:'ImpactLocal',fontSize:62}}>JUGADORES</div><div style={{fontFamily:'ImpactLocal',fontSize:115,color:PINK}}>MATICES</div><div style={{fontFamily:'ImpactLocal',fontSize:32}}>SOBRE TODO FPS</div></div></PaperStrip>
  <Type3D x={960} y={175} size={110} frame={a} delay={45} color={PAPER}>¿SUPERÓ LAS EXPECTATIVAS?</Type3D>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',inset:0}}><path d="M960 250 L960 890" stroke={YELLOW} strokeWidth="10" strokeDasharray="22 18" strokeDashoffset={1000*(1-ease(a/50))}/></svg>
 </>;
 if(index===16)return <>
  <Type3D x={960} y={210} size={142} frame={a} delay={4} color={PAPER}>HISTÓRICO</Type3D>
  <Type3D x={960} y={355} size={100} frame={a} delay={24} color={YELLOW}>NO PERFECTO</Type3D>
  <svg viewBox="0 0 1100 620" width="1100" height="620" style={{position:'absolute',left:410,top:380,filter:'drop-shadow(0 15px 12px #0008)'}}>
   <path d="M550 80 V490 M310 490 H790 M220 185 H880 M550 80 L500 125 L550 170 L600 125 Z" stroke={PAPER} strokeWidth="16" fill="none" strokeLinejoin="round"/>
   <path d="M300 185 L190 370 H410 Z M800 185 L690 370 H910 Z" stroke={TEAL} strokeWidth="12" fill="none" strokeLinejoin="round"/>
   <path d="M190 370 Q300 440 410 370 M690 370 Q800 440 910 370" stroke={ORANGE} strokeWidth="12" fill="none"/>
   <text x="300" y="330" fill={PINK} fontSize="48" fontFamily="ImpactLocal" textAnchor="middle">PEGAS</text><text x="800" y="330" fill={TEAL} fontSize="48" fontFamily="ImpactLocal" textAnchor="middle">AMBICIÓN</text>
  </svg>
  <NicoSticker frame={a} x={1600} y={800} width={270} pose="happy" angle={4} delay={50}/>
  <Sticker text="LA ÚLTIMA PALABRA ES TUYA" frame={a} x={960} y={920} color={YELLOW} delay={70}/>
 </>;
 return <>
  <PaperTexture frame={a} opacity={.3}/>
  <Img src={asset('gta-logo.webp')} style={{position:'absolute',left:960,top:160,width:340,transform:'translate(-50%,-50%) rotate(-4deg) scale('+pop(a,4)+')',filter:'drop-shadow(8px 12px 8px #0008)'}}/>
  <NicoSticker frame={a} x={960} y={700} width={430} pose="happy" angle={-3} delay={10}/>
  <PaperStrip frame={a} x={480} y={420} width={660} height={230} angle={-5} delay={28}><span style={{fontFamily:'ImpactLocal',fontSize:74,color:INK,textAlign:'center'}}>¿QUÉ NOTA LE PONES?</span></PaperStrip>
  <Sticker text="SUSCRÍBETE A ZINKO" frame={a} x={1430} y={520} color={PINK} delay={54} size={34}/>
  <PaperStrip frame={a} x={1430} y={790} width={550} height={280} angle={5} delay={80} color="#fffdf5"><div style={{textAlign:'center',color:INK,fontFamily:'ImpactLocal',fontSize:55}}>SIGUIENTE VÍDEO<br/>AQUÍ</div></PaperStrip>
 </>;
}
function SceneTransition({index,frame}:{index:number;frame:number}){
 if(index===0||index%2===0||frame>11)return null;
 const p=ease(frame/11),v=index%4;
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  {v===1&&<div style={{position:'absolute',left:-1850+frame*330,top:-160,width:3000,height:1420,background:PAPER,clipPath:'polygon(0 0,100% 0,100% 78%,94% 83%,88% 78%,82% 85%,76% 79%,70% 86%,64% 79%,58% 84%,52% 78%,46% 85%,40% 78%,34% 84%,28% 78%,22% 85%,16% 79%,10% 84%,0 78%)',transform:'rotate(-8deg)',opacity:1-p}}/>}
  {v===3&&<><div style={{position:'absolute',inset:0,background:YELLOW,opacity:Math.max(0,1-frame/3)*.7}}/>{[0,1,2,3,4,5].map(i=><div key={i} style={{position:'absolute',left:-500+i*420+frame*100,top:-100,width:130,height:1300,background:i%2?PINK:TEAL,transform:'skewX(-22deg)',opacity:(1-p)*.85}}/>)}</>}
  {v===2&&<><div style={{position:'absolute',left:'50%',top:'50%',width:140+frame*275,height:140+frame*275,borderRadius:'50%',border:'24px solid '+PAPER,transform:'translate(-50%,-50%)',boxShadow:'0 0 0 2000px '+INK,opacity:1-p}}/><div style={{position:'absolute',inset:0,background:ORANGE,opacity:Math.max(0,1-frame/2)*.35}}/></>}
  {v===0&&<><div style={{position:'absolute',inset:0,background:PAPER,opacity:Math.max(0,1-frame/2)*.7}}/>{[0,1,2,3,4,5,6].map(i=><div key={i} style={{position:'absolute',left:-900+i*360+frame*220,top:70+i*130,width:1100,height:34,background:i%2?PINK:INK,transform:'rotate(-18deg)',opacity:(1-p)*.72}}/>)}</>}
 </AbsoluteFill>;
}
function Scene({index,withAudio=true}:{index:number;withAudio?:boolean}){
 const frame=useCurrentFrame(),scene=scenes[index];
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
  <BackgroundClip scene={scene} index={index} frame={frame}/>
  <Art index={index} frame={frame}/>
  <Caption scene={scene} frame={frame}/>
  {index%3===0&&<div style={{position:'absolute',right:48,top:38,fontFamily:'ImpactLocal',fontSize:22,letterSpacing:3,color:PAPER,textShadow:'2px 3px 0 '+INK,opacity:.78}}>ZINKO</div>}
  <SceneTransition index={index} frame={frame}/>
  {withAudio&&<Audio src={asset('voice/'+String(index+1).padStart(2,'0')+'.mp3')} volume={1}/>}
  {withAudio&&scene.sfx.map((s,i)=><Sequence key={i} from={Math.round(s.at*FPS)} durationInFrames={Math.min(80,300-Math.round(s.at*FPS))}><Audio src={asset('sfx/'+s.file)} volume={s.volume}/></Sequence>)}
 </AbsoluteFill>;
}
function FontGate(){
 const [handle]=useState(()=>delayRender('Cargando tipografías ZINKO V6'));
 useEffect(()=>{
  const fonts=[new FontFace('CaptionLocal','url('+asset('fonts/Caption.ttf')+')'),new FontFace('ImpactLocal','url('+asset('fonts/Impact.ttf')+')')];
  Promise.all(fonts.map(f=>f.load())).then(loaded=>{loaded.forEach(f=>document.fonts.add(f));continueRender(handle)}).catch(cancelRender);
 },[handle]);
 return null;
}
export const GTA6ZinkoMotionV6:React.FC<{sceneCount?:number}> = ({sceneCount=18})=>{
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
  <FontGate/>
  {scenes.slice(0,sceneCount).map((s,i)=><Sequence key={i} from={i*300} durationInFrames={300} premountFor={FPS}><Scene index={i}/></Sequence>)}
 </AbsoluteFill>;
};
export const GTA6ZinkoMotionV6Preview:React.FC=()=>{
 const selected=[0,4,6,9,12,14,17];
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
  <FontGate/>
  {selected.map((sceneIndex,i)=><Sequence key={sceneIndex} from={i*90} durationInFrames={90} premountFor={FPS}><Scene index={sceneIndex} withAudio={false}/></Sequence>)}
 </AbsoluteFill>;
};
