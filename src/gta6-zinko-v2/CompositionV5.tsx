import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, cancelRender,
  continueRender, delayRender, spring, staticFile, useCurrentFrame
} from 'remotion';

const FPS=30, INK='#0b0b18', WHITE='#fffdf7', YELLOW='#ffeb1d', PINK='#ff3c91', TEAL='#24f2dc', ORANGE='#ff9b3d';
type Cue={from:number;to:number;text:string;emphasis:string};
type Cut={file:string;start:number;style:number};
type Story={title:string;accent:string;voice:string;cues:Cue[];cuts:[Cut,Cut,Cut];kind:string};
const scenes:Story[]=[
{title:'EL RÉCORD DE 28 AÑOS',accent:ORANGE,voice:'01.mp3',kind:'record',cuts:[{file:'launch.mp4',start:8,style:0},{file:'trailer2.mp4',start:28,style:2},{file:'trailer1.mp4',start:12,style:1}],cues:[{from:0,to:3.25,text:'Un juego acaba de igualar un récord de veintiocho años.',emphasis:'récord de veintiocho años'},{from:3.25,to:6.5,text:'Es GTA seis, y las reseñas son históricas.',emphasis:'reseñas son históricas'},{from:6.5,to:10,text:'Pero tiene pegas que casi nadie cuenta.',emphasis:'pegas'}]},
{title:'BIENVENIDO A ZINKO',accent:TEAL,voice:'02.mp3',kind:'welcome',cuts:[{file:'trailer1.mp4',start:3,style:1},{file:'launch.mp4',start:18,style:0},{file:'trailer2.mp4',start:72,style:2}],cues:[{from:0,to:3.25,text:'Bienvenido a Zinko, el canal de la curiosidad.',emphasis:'Zinko'},{from:3.25,to:6.5,text:'Hoy veremos qué aman, qué critican y si valió la espera.',emphasis:'valió la espera'},{from:6.5,to:10,text:'Y al final, mi veredicto.',emphasis:'mi veredicto'}]},
{title:'UNA NOTA CASI PERFECTA',accent:ORANGE,voice:'03.mp3',kind:'score',cuts:[{file:'launch.mp4',start:26,style:2},{file:'trailer2.mp4',start:18,style:0},{file:'trailer1.mp4',start:46,style:1}],cues:[{from:0,to:3.25,text:'Las reseñas salieron con una nota casi perfecta.',emphasis:'casi perfecta'},{from:3.25,to:6.5,text:'Noventa y nueve sobre cien en Metacritic.',emphasis:'noventa y nueve'},{from:6.5,to:10,text:'Más de ciento cuarenta críticos lo puntuaron.',emphasis:'ciento cuarenta críticos'}]},
{title:'EL RÉCORD QUE DURÓ 28 AÑOS',accent:TEAL,voice:'04.mp3',kind:'timeline',cuts:[{file:'trailer1.mp4',start:0,style:1},{file:'trailer2.mp4',start:88,style:2},{file:'launch.mp4',start:56,style:0}],cues:[{from:0,to:3.25,text:'Solo un juego había llegado a noventa y nueve.',emphasis:'solo un juego'},{from:3.25,to:6.5,text:'Ocarina of Time, de mil novecientos noventa y ocho.',emphasis:'mil novecientos noventa y ocho'},{from:6.5,to:10,text:'Veintiocho años después, GTA seis lo alcanza.',emphasis:'veintiocho años'}]},
{title:'LA SAGA EN NÚMEROS',accent:TEAL,voice:'05.mp3',kind:'ranking',cuts:[{file:'trailer2.mp4',start:6,style:0},{file:'launch.mp4',start:38,style:1},{file:'trailer1.mp4',start:66,style:2}],cues:[{from:0,to:3.25,text:'En la saga, GTA cuatro tiene noventa y ocho.',emphasis:'noventa y ocho'},{from:3.25,to:6.5,text:'GTA cinco, noventa y siete.',emphasis:'noventa y siete'},{from:6.5,to:10,text:'Y en el recuento inicial no había ni una reseña negativa.',emphasis:'ni una reseña negativa'}]},
{title:'UN MUNDO ENORME Y VIVO',accent:TEAL,voice:'06.mp3',kind:'world',cuts:[{file:'trailer1.mp4',start:18,style:0},{file:'trailer2.mp4',start:52,style:1},{file:'launch.mp4',start:12,style:2}],cues:[{from:0,to:3.25,text:'Lo primero que alaban es el mundo abierto.',emphasis:'mundo abierto'},{from:3.25,to:6.5,text:'Enorme, vivo y lleno de detalles.',emphasis:'lleno de detalles'},{from:6.5,to:10,text:'Dicen que te hace sentir dentro de él.',emphasis:'dentro de él'}]},
{title:'JASON + LUCIA',accent:PINK,voice:'07.mp3',kind:'duo',cuts:[{file:'trailer2.mp4',start:38,style:1},{file:'launch.mp4',start:32,style:2},{file:'trailer2.mp4',start:112,style:0}],cues:[{from:0,to:3.25,text:'Los dos protagonistas son lo más elogiado de la historia.',emphasis:'dos protagonistas'},{from:3.25,to:6.5,text:'Una pareja que, según los críticos, se siente creíble.',emphasis:'se siente creíble'},{from:6.5,to:10,text:'Y que tú ayudas a moldear con tus decisiones.',emphasis:'tus decisiones'}]},
{title:'¿CUÁNTAS HORAS DE JUEGO?',accent:ORANGE,voice:'08.mp3',kind:'hours',cuts:[{file:'trailer2.mp4',start:20,style:0},{file:'trailer1.mp4',start:34,style:2},{file:'launch.mp4',start:68,style:1}],cues:[{from:0,to:3.25,text:'La historia principal dura unas sesenta horas.',emphasis:'sesenta horas'},{from:3.25,to:6.5,text:'Y con todo lo demás, pasa de cien.',emphasis:'pasa de cien'},{from:6.5,to:10,text:'Es muchísimo juego por lo que cuesta.',emphasis:'muchísimo juego'}]},
{title:'LAS NOTAS DE LA PRENSA',accent:ORANGE,voice:'09.mp3',kind:'reviews',cuts:[{file:'launch.mp4',start:4,style:1},{file:'trailer2.mp4',start:130,style:0},{file:'trailer1.mp4',start:74,style:2}],cues:[{from:0,to:3.25,text:'IGN, GameSpot y Eurogamer le dieron la nota máxima.',emphasis:'nota máxima'},{from:3.25,to:6.5,text:'Uno de ellos lo llamó el juego de la generación.',emphasis:'juego de la generación'},{from:6.5,to:10,text:'Las notas más bajas rondan el ochenta.',emphasis:'ochenta'}]},
{title:'PERO HAY PEGAS',accent:PINK,voice:'10.mp3',kind:'fps',cuts:[{file:'launch.mp4',start:72,style:2},{file:'trailer2.mp4',start:98,style:0},{file:'trailer1.mp4',start:52,style:1}],cues:[{from:0,to:2.5,text:'Ahora, las pegas.',emphasis:'pegas'},{from:2.5,to:6.4,text:'La más repetida: treinta fotogramas por segundo.',emphasis:'treinta fotogramas'},{from:6.4,to:10,text:'En todas las consolas, incluso en PS5 Pro. Y sin un modo de sesenta.',emphasis:'sin un modo de sesenta'}]},
{title:'RENDIMIENTO BAJO PRESIÓN',accent:PINK,voice:'11.mp3',kind:'performance',cuts:[{file:'launch.mp4',start:44,style:0},{file:'trailer2.mp4',start:142,style:2},{file:'trailer1.mp4',start:24,style:1}],cues:[{from:0,to:3.25,text:'Varias reseñas notan caídas de rendimiento.',emphasis:'caídas de rendimiento'},{from:3.25,to:6.5,text:'Sobre todo en zonas muy llenas y en tiroteos.',emphasis:'zonas muy llenas'},{from:6.5,to:10,text:'Aunque otros críticos lo ven fluido y estable.',emphasis:'fluido y estable'}]},
{title:'EL RITMO DE LA HISTORIA',accent:PINK,voice:'12.mp3',kind:'pacing',cuts:[{file:'trailer2.mp4',start:4,style:1},{file:'trailer1.mp4',start:26,style:0},{file:'launch.mp4',start:22,style:2}],cues:[{from:0,to:3.25,text:'También critican un ritmo desigual en la historia.',emphasis:'ritmo desigual'},{from:3.25,to:6.5,text:'Un inicio lento y misiones muy guiadas.',emphasis:'inicio lento'},{from:6.5,to:10,text:'Y escenas largas en las que casi no controlas.',emphasis:'casi no controlas'}]},
{title:'REALISMO CON CONSECUENCIAS',accent:ORANGE,voice:'13.mp3',kind:'realism',cuts:[{file:'trailer2.mp4',start:58,style:2},{file:'launch.mp4',start:34,style:0},{file:'trailer1.mp4',start:58,style:1}],cues:[{from:0,to:3.25,text:'Y el realismo tiene curva de aprendizaje.',emphasis:'curva de aprendizaje'},{from:3.25,to:6.5,text:'Coches más frágiles, gastos y tareas del día a día.',emphasis:'coches más frágiles'},{from:6.5,to:10,text:'Si vienes de GTA cinco, te sorprenderá.',emphasis:'te sorprenderá'}]},
{title:'PREVENTAS POR LAS NUBES',accent:ORANGE,voice:'14.mp3',kind:'preorders',cuts:[{file:'launch.mp4',start:60,style:1},{file:'trailer2.mp4',start:154,style:0},{file:'trailer1.mp4',start:82,style:2}],cues:[{from:0,to:3.25,text:'Las preventas superaron lo esperado, dice Take-Two.',emphasis:'superaron lo esperado'},{from:3.25,to:6.5,text:'Sensor Tower calcula más de diecisiete millones.',emphasis:'diecisiete millones'},{from:6.5,to:10,text:'A casi ochenta o casi cien dólares cada una.',emphasis:'ochenta o cien dólares'}]},
{title:'11 MILLONES VS 17 MILLONES',accent:ORANGE,voice:'15.mp3',kind:'comparison',cuts:[{file:'trailer1.mp4',start:4,style:0},{file:'launch.mp4',start:14,style:2},{file:'trailer2.mp4',start:80,style:1}],cues:[{from:0,to:3.25,text:'Para comparar: GTA cinco vendió once millones el primer día.',emphasis:'once millones'},{from:3.25,to:6.5,text:'Según esa estimación, las preventas ya lo superan.',emphasis:'ya lo superan'},{from:6.5,to:10,text:'Faltan las cifras oficiales.',emphasis:'cifras oficiales'}]},
{title:'CRÍTICOS VS JUGADORES',accent:TEAL,voice:'16.mp3',kind:'split',cuts:[{file:'launch.mp4',start:48,style:1},{file:'trailer2.mp4',start:94,style:0},{file:'trailer1.mp4',start:38,style:2}],cues:[{from:0,to:3.25,text:'¿Superó las expectativas? Para los críticos, sí.',emphasis:'para los críticos, sí'},{from:3.25,to:6.5,text:'Para algunos jugadores hay matices, sobre todo con los treinta fotogramas.',emphasis:'hay matices'},{from:6.5,to:10,text:'Y aun así, el aplauso es casi unánime.',emphasis:'casi unánime'}]},
{title:'EL VEREDICTO DE ZINKO',accent:TEAL,voice:'17.mp3',kind:'verdict',cuts:[{file:'launch.mp4',start:2,style:2},{file:'trailer2.mp4',start:66,style:1},{file:'trailer1.mp4',start:8,style:0}],cues:[{from:0,to:3.25,text:'Mi veredicto: no es perfecto, pero es histórico.',emphasis:'es histórico'},{from:3.25,to:6.5,text:'Las pegas son técnicas y de ritmo, no de ambición.',emphasis:'no de ambición'},{from:6.5,to:10,text:'Y la última palabra la tienes tú, jugándolo.',emphasis:'la tienes tú'}]},
{title:'¿QUÉ NOTA LE PONES?',accent:PINK,voice:'18.mp3',kind:'outro',cuts:[{file:'trailer1.mp4',start:14,style:0},{file:'launch.mp4',start:82,style:1},{file:'trailer2.mp4',start:158,style:2}],cues:[{from:0,to:3.25,text:'¿Qué nota le pondrías tú a GTA seis?',emphasis:'qué nota'},{from:3.25,to:6.5,text:'Suscríbete a Zinko para más curiosidad.',emphasis:'suscríbete a Zinko'},{from:6.5,to:10,text:'Y mira el siguiente vídeo, está justo aquí.',emphasis:'siguiente vídeo'}]}
];

const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
const pop=(f:number,d=0)=>spring({frame:Math.max(0,f-d),fps:FPS,config:{mass:.55,damping:12,stiffness:185}});
const media=(s:string)=>staticFile('gta6-zinko-v5/'+s);

const cutsAt=[0,100,200];
const stills:Record<string,[string,string,string]> = {
 record:['jason-lucia-17.jpg','vice-city-14.jpg','jason-lucia-03.jpg'],
 welcome:['vice-city-14.jpg','vice-city-17.jpg','vice-city-20.jpg'],
 score:['jason-duval-14.jpg','vice-city-17.jpg','vice-city-25.jpg'],
 timeline:['jason-lucia-03.jpg','vice-city-01.jpg','vice-city-14.jpg'],
 ranking:['vice-city-20.jpg','vice-city-25.jpg','jason-lucia-09.jpg'],
 world:['grassrivers-07.jpg','leonida-keys-06.jpg','grassrivers-06.jpg'],
 duo:['jason-lucia-05.jpg','jason-lucia-09.jpg','jason-lucia-17.jpg'],
 hours:['vice-city-10.jpg','port-gellhorn-01.jpg','ambrosia-01.jpg'],
 reviews:['vice-city-17.jpg','vice-city-20.jpg','vice-city-25.jpg'],
 fps:['port-gellhorn-01.jpg','vice-city-10.jpg','grassrivers-01.jpg'],
 performance:['grassrivers-06.jpg','ambrosia-01.jpg','port-gellhorn-01.jpg'],
 pacing:['jason-duval-14.jpg','jason-lucia-03.jpg','vice-city-14.jpg'],
 realism:['grotti-cheetah-01.jpg','leonida-keys-01.jpg','port-gellhorn-01.jpg'],
 preorders:['vice-city-01.jpg','jason-lucia-17.jpg','vice-city-25.jpg'],
 comparison:['vice-city-20.jpg','vice-city-17.jpg','vice-city-14.jpg'],
 split:['jason-lucia-09.jpg','vice-city-10.jpg','grassrivers-07.jpg'],
 verdict:['mount-kalaga-02.jpg','vice-city-13.jpg','jason-lucia-17.jpg'],
 outro:['vice-city-14.jpg','jason-lucia-05.jpg','vice-city-01.jpg']
};
// Each moving insert is assigned to the exact subject being discussed.
const videoPlan:Record<string,Record<number,{file:string;start:number}>>={
 record:{0:{file:'cover-animation.mp4',start:0}},
 welcome:{0:{file:'opening.mp4',start:0}},
 world:{1:{file:'coast.mp4',start:0}},
 duo:{0:{file:'jason.mp4',start:0},1:{file:'lucia.mp4',start:0}},
 fps:{1:{file:'action.mp4',start:0}},
 performance:{1:{file:'action.mp4',start:0}},
 realism:{1:{file:'lowrider.mp4',start:0}},
 verdict:{1:{file:'rockstar.mp4',start:0}},
 outro:{1:{file:'crowd.mp4',start:0}}
};
function Footage({scene,index}:{scene:Story;index:number}){
 return <AbsoluteFill>
  {scene.cuts.map((c,i)=><Sequence key={i} from={cutsAt[i]} durationInFrames={100}>
   <Shot cut={c} index={index} part={i} kind={scene.kind}/>
  </Sequence>)}
 </AbsoluteFill>;
}
function Shot({cut,index,part,kind}:{cut:Cut;index:number;part:number;kind:string}){
 const f=useCurrentFrame();
 const p=clamp(f/18);
 const image=stills[kind]?.[part]||stills.world[part];
 const phase=clamp(f/99);
 const zoom=1.055+phase*(cut.style===0?.15:cut.style===1?.20:.12)+0.018*Math.sin(f*.07+index*1.2+part);
 const panX=(cut.style===1?1:-1)*phase*(cut.style===2?5:8)+Math.sin(f*.045+index+part*2)*1.6;
 const panY=(cut.style===2?-1:1)*phase*3+Math.cos(f*.035+index*.7+part)*1.1;
 const rot=[-.7,.55,-.35,.42,.8,-.5][(index+part)%6];
 const insert=videoPlan[kind]?.[part];
 const video=insert?.file;
 return <AbsoluteFill style={{background:'#070710',overflow:'hidden'}}>
  {!video&&<Img src={media('stills/'+image)} style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale('+zoom+') translate('+panX+'%,'+panY+'%) rotate('+rot+'deg)',filter:'saturate(1.16) contrast(1.1) brightness(.88)'}}/>}
  {video&&<div style={{position:'absolute',inset:0,overflow:'hidden',clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)'}}>
   <Loop durationInFrames={100}><OffthreadVideo src={media('clips/'+video)} startFrom={Math.round((insert?.start??0)*FPS)} muted playbackRate={1.04} style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale(1.12) translate('+panX+'%,'+panY+'%)',filter:'saturate(1.22) contrast(1.12) brightness(.9)'}}/></Loop>
  </div>}
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(4,4,14,.28),transparent 23%,transparent 64%,rgba(4,4,14,.46))'}}/>
  {video&&<div style={{position:'absolute',right:42,top:155,width:350,height:196,border:'2px solid rgba(255,255,255,.78)',boxShadow:'0 15px 35px #000c',transform:'rotate(2deg)',overflow:'hidden'}}><Img src={media('stills/'+image)} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',left:0,bottom:0,padding:'5px 10px',background:'#050510dd',color:WHITE,fontFamily:'ImpactLocal',fontSize:15,letterSpacing:1.4}}>{kind==='world'?'LEONIDA / OPEN WORLD':kind==='duo'&&part===0?'JASON DUVAL / OFFICIAL CLIP':kind==='duo'&&part===1?'LUCIA CAMINOS / OFFICIAL CLIP':kind==='fps'||kind==='performance'?'GAMEPLAY / ACTION':kind==='realism'?'VEHICLES / DETAIL':kind==='record'?'OFFICIAL COVER ANIMATION':'OFFICIAL GAME IMAGE'}</div></div>}
  <div style={{position:'absolute',inset:0,border:'1px solid rgba(255,255,255,.09)',boxShadow:'inset 0 0 120px rgba(0,0,0,.22)'}}/>
 </AbsoluteFill>;
}

function Caption({cue,frame,accent}:{cue:Cue;frame:number;accent:string}){
 const local=frame-Math.round(cue.from*FPS);
 const p=pop(local,0);
 const words=cue.text.split(' ');
 const hi=cue.emphasis.toLowerCase();
 return <div style={{position:'absolute',left:110,right:110,bottom:38,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
  <div style={{maxWidth:1660,display:'flex',justifyContent:'center',alignItems:'center',flexWrap:'wrap',gap:'0 12px',textAlign:'center',fontFamily:'CaptionLocal',fontSize:48,lineHeight:1.12,fontWeight:900,color:YELLOW,WebkitTextStroke:'3px #090914',paintOrder:'stroke fill',textShadow:'2px 5px 0 #090914,0 9px 22px #000c'}}>
   {words.map((w,i)=>{const active=hi.includes(w.replace(/[.,:¿?¡!]/g,'').toLowerCase())||cue.emphasis.toLowerCase().includes(w.toLowerCase());return <span key={i} style={{display:'inline-block',opacity:local>=i*2?1:0,transform:'translateY('+(local>=i*2?(1-p)*18:18)+'px) scale('+(local>=i*2?.9+.1*p:.9)+')',color:active?WHITE:YELLOW,textShadow:active?'0 0 15px '+accent+',2px 5px 0 #090914,0 9px 22px #000c':'2px 5px 0 #090914,0 9px 22px #000c'}}>{w}</span>})}
  </div>
 </div>;
}

function Nico({index,frame,accent}:{index:number;frame:number;accent:string}){
 const useQuestion=[0,9,10,11,15].includes(index);
 const show=[0,1,3,5,6,8,9,11,12,15,16,17].includes(index);
 if(!show)return null;
 const p=pop(frame,8);
 const leave=clamp((300-frame)/22);
 const enter=clamp(frame/14);
 const scale=0.84+0.16*p;
 const right=[6,7,12,16].includes(index);
 return <div style={{position:'absolute',left:right?'auto':26,right:right?24:'auto',bottom:104,width:300,opacity:enter*leave,transform:'translateX('+(right?(1-p)*150:(1-p)*-150)+'px) translateY('+(Math.sin(frame*.09)*5)+'px) scale('+scale+') rotate('+(Math.sin(frame*.045+index)*1.6)+'deg)',transformOrigin:right?'bottom right':'bottom left',filter:'drop-shadow(0 15px 25px #000d)',pointerEvents:'none'}}>
  <Img src={media('nico/'+(useQuestion?'nico-question.webp':'nico-happy.webp'))} style={{width:'100%',height:'auto',objectFit:'contain'}}/>
  <div style={{position:'absolute',left:right?0:94,bottom:24,padding:'8px 13px',background:accent,color:INK,fontFamily:'ImpactLocal',fontSize:17,letterSpacing:1.5,boxShadow:'0 7px 18px #000a',transform:'rotate(-4deg)'}}>{useQuestion?'¿EN SERIO?':'ZINKO REACCIONA'}</div>
 </div>;
}

function BigWord({text,accent,frame,x='50%',y='19%',size=106,angle=-3}:{text:string;accent:string;frame:number;x?:string;y?:string;size?:number;angle?:number}){
 const p=pop(frame,3);
 return <div style={{position:'absolute',left:x,top:y,transform:'translate(-50%,'+((1-p)*-65)+'px) perspective(900px) rotateX('+(8*(1-p))+'deg) rotateY('+(frame%2===0?1:-1)*5*(1-p)+'deg) rotate('+angle+'deg) scale('+(0.74+.26*p)+')',fontFamily:'ImpactLocal',fontSize:size,letterSpacing:2,lineHeight:.9,color:WHITE,WebkitTextStroke:'2px #090914',paintOrder:'stroke fill',textShadow:'5px 7px 0 #090914,0 0 26px '+accent+'99',whiteSpace:'nowrap',opacity:clamp((frame-2)/8)}}>{text}</div>;
}
function Tape({text,accent,frame,x='50%',y='12%',angle=2}:{text:string;accent:string;frame:number;x?:string;y?:string;angle?:number}){
 const p=pop(frame,5);
 return <div style={{position:'absolute',left:x,top:y,transform:'translate(-50%,'+((1-p)*-36)+'px) rotate('+angle+'deg) scale('+(0.8+.2*p)+')',background:accent,color:INK,padding:'8px 20px',fontFamily:'ImpactLocal',fontSize:22,letterSpacing:2,boxShadow:'0 8px 18px #000a',whiteSpace:'nowrap',opacity:clamp((frame-3)/6)}}>{text}</div>;
}
function MetricCard({frame,x,y,w,label,value,accent,note,angle=0}:{frame:number;x:string;y:string;w:number;label:string;value:string;accent:string;note?:string;angle?:number}){
 const p=pop(frame,6);
 return <div style={{position:'absolute',left:x,top:y,width:w,padding:'15px 19px 17px',background:'linear-gradient(145deg,#111126f5,#050510f2)',border:'2px solid '+accent,boxShadow:'0 18px 32px #000b,0 0 24px '+accent+'55',transform:'perspective(1100px) translateY('+(1-p)*55+'px) rotateX('+(12*(1-p))+'deg) rotateY('+(angle*1.4)+'deg) rotate('+angle+'deg) scale('+(0.72+.28*p)+')',opacity:clamp((frame-4)/8)}}>
  <div style={{fontFamily:'ImpactLocal',fontSize:19,letterSpacing:2,color:accent}}>{label}</div>
  <div style={{fontFamily:'ImpactLocal',fontSize:58,lineHeight:1,color:WHITE,textShadow:'3px 4px 0 #000,0 0 16px '+accent+'66'}}>{value}</div>
  {note&&<div style={{fontFamily:'CaptionLocal',fontSize:17,fontWeight:900,color:'#e5e0ec',marginTop:5}}>{note}</div>}
 </div>;
}
function Graphic({scene,frame,index}:{scene:Story;frame:number;index:number}){
 const kind=scene.kind, a=scene.accent;
 const beat=Math.floor(frame/100), local=frame%100;
 if(kind==='record')return <><BigWord text={beat===0?'28 AÑOS':beat===1?'RÉCORD IGUALADO':'PERO HAY PEGAS'} accent={a} frame={local} x="55%" y="15%" size={beat===2?88:116}/><Tape text={beat===0?'UNA MARCA HISTÓRICA':beat===1?'GTA VI · 99/100':'NO TODO ES PERFECTO'} accent={beat===2?PINK:ORANGE} frame={local} x="69%" y="33%" angle={-4}/><div style={{position:'absolute',right:75,top:300,fontFamily:'ImpactLocal',fontSize:72,color:WHITE,textShadow:'4px 6px 0 #000',transform:'rotate(7deg)'}}>{beat===0?'1998':beat===1?'2026':'?!'}</div></>;
 if(kind==='welcome')return <><BigWord text={beat===0?'ZINKO':'GTA VI'} accent={a} frame={local} x="50%" y="14%" size={130}/><Tape text={beat===1?'LO BUENO':beat===2?'LO MALO + VEREDICTO':'CURIOSIDAD GAMER'} accent={beat===1?TEAL:beat===2?PINK:ORANGE} frame={local} x="50%" y="32%" angle={-2}/><MetricCard frame={local} x="58%" y="57%" w={380} label="HOY EN EL VIDEO" value={beat===0?'18 ESCENAS':beat===1?'AMOR / CRÍTICAS':'VEREDICTO'} accent={a}/></>;
 if(kind==='score')return <><MetricCard frame={local} x="65%" y="23%" w={430} label="METACRITIC" value="99 / 100" accent={ORANGE} note="MÁS DE 140 CRÍTICOS"/><div style={{position:'absolute',left:'56%',top:'56%',width:300,height:24,background:'#ffffff44',border:'3px solid white',transform:'rotate(-4deg)',boxShadow:'0 9px 22px #000'}}><div style={{height:'100%',width:(local<45?Math.min(99,local*2.2):99)+'%',background:ORANGE,boxShadow:'0 0 18px '+ORANGE}}/></div><Tape text="CASI PERFECTO" accent={ORANGE} frame={local} x="70%" y="67%" angle={3}/></>;
 if(kind==='timeline')return <><Tape text="ANTES / AHORA" accent={TEAL} frame={local} x="68%" y="17%"/><div style={{position:'absolute',left:'55%',top:'36%',width:690,height:8,background:WHITE,boxShadow:'0 0 15px '+TEAL}}/><div style={{position:'absolute',left:'55%',top:'32%',fontFamily:'ImpactLocal',fontSize:58,color:ORANGE,textShadow:'3px 5px #000'}}>1998</div><div style={{position:'absolute',left:'85%',top:'32%',fontFamily:'ImpactLocal',fontSize:58,color:TEAL,textShadow:'3px 5px #000'}}>2026</div><MetricCard frame={local} x="65%" y="52%" w={390} label="EL MISMO PUNTAJE" value="99 / 100" accent={TEAL} note="28 AÑOS DESPUÉS"/></>;
 if(kind==='ranking')return <><Tape text="PUNTUACIONES DE LA SAGA" accent={TEAL} frame={local} x="68%" y="15%"/>{[['GTA IV','98'],['GTA V','97'],['GTA VI','99']].map((v,i)=>{const p=pop(local,8+i*9);return <div key={v[0]} style={{position:'absolute',left:(54+i*14)+'%',bottom:190,width:130,height:150,background:i===2?ORANGE:TEAL,transform:'translateY('+(1-p)*180+'px) scale('+(0.7+.3*p)+')',boxShadow:'0 15px 28px #000a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><b style={{fontFamily:'ImpactLocal',fontSize:31,color:INK}}>{v[0]}</b><strong style={{fontFamily:'ImpactLocal',fontSize:62,color:INK}}>{v[1]}</strong></div>})}<Tape text={beat===2?'0 RESEÑAS NEGATIVAS':'RÉCORD DE LA SAGA'} accent={beat===2?ORANGE:TEAL} frame={local} x="71%" y="69%" angle={-3}/></>;
 if(kind==='world')return <><BigWord text={beat===0?'MUNDO ABIERTO':beat===1?'LLENO DE VIDA':'TE SIENTES DENTRO'} accent={TEAL} frame={local} x="58%" y="15%" size={beat===2?78:90}/><Tape text="LEONIDA · VICE CITY" accent={TEAL} frame={local} x="71%" y="32%" angle={2}/><div style={{position:'absolute',right:65,bottom:190,display:'flex',gap:12}}>{['EXPLORAR','DESCUBRIR','VIVIR'].map((s,i)=><div key={s} style={{padding:'12px 15px',background:'#080817dd',border:'2px solid '+[TEAL,ORANGE,PINK][i],fontFamily:'ImpactLocal',fontSize:20,color:WHITE,transform:'rotate('+[-3,2,-2][i]+'deg)'}}>{s}</div>)}</div></>;
 if(kind==='duo')return <><BigWord text={beat===0?'JASON + LUCIA':beat===1?'UNA PAREJA CREÍBLE':'TUS DECISIONES'} accent={PINK} frame={local} x="57%" y="15%" size={beat===0?96:82}/><Tape text={beat===2?'LA HISTORIA CAMBIA CONTIGO':'DOS PROTAGONISTAS'} accent={PINK} frame={local} x="70%" y="33%" angle={-3}/><MetricCard frame={local} x="65%" y="57%" w={400} label="EL CORAZÓN DE LA HISTORIA" value={beat===2?'ELECCIONES':'QUÍMICA'} accent={PINK}/></>;
 if(kind==='hours')return <><Tape text="TIEMPO DE JUEGO" accent={ORANGE} frame={local} x="68%" y="15%"/><MetricCard frame={local} x="56%" y="30%" w={290} label="HISTORIA PRINCIPAL" value="60 H" accent={ORANGE}/><MetricCard frame={local} x="74%" y="54%" w={310} label="CON TODO" value="100 H+" accent={TEAL}/><div style={{position:'absolute',left:'56%',top:'75%',width:'39%',height:15,background:'#fff5',borderRadius:30}}><div style={{height:'100%',width:(local/100*100)+'%',background:ORANGE,borderRadius:30}}/></div></>;
 if(kind==='reviews')return <><Tape text="MEDIOS ESPECIALIZADOS" accent={ORANGE} frame={local} x="69%" y="15%"/>{['IGN','GameSpot','Eurogamer'].map((v,i)=>{const p=pop(local,7+i*8);return <div key={v} style={{position:'absolute',left:(54+i*13)+'%',top:(34+i%2*17)+'%',padding:'17px 22px',background:['#f5f1e8','#e6e6e6','#fff'][i],color:'#15131a',fontFamily:'ImpactLocal',fontSize:28,boxShadow:'0 16px 30px #000b',transform:'translateY('+(1-p)*80+'px) rotate('+[-5,3,-2][i]+'deg)'}}>{v}<div style={{fontSize:38,color:'#e47b23'}}>100/100</div></div>})}<Tape text="LAS MÁS BAJAS ≈ 80" accent={ORANGE} frame={local} x="70%" y="76%" angle={2}/></>;
 if(kind==='fps')return <><BigWord text={beat===0?'AHORA LAS PEGAS':beat===1?'30 FPS':'¿Y LOS 60?'} accent={PINK} frame={local} x="58%" y="15%" size={beat===1?122:94}/><MetricCard frame={local} x="56%" y="42%" w={275} label="RENDIMIENTO" value="30 FPS" accent={PINK} note="EN CONSOLAS"/><MetricCard frame={local} x="76%" y="56%" w={260} label="MODO 60" value="NO" accent={ORANGE}/><Tape text="INCLUSO PS5 PRO" accent={PINK} frame={local} x="69%" y="78%" angle={-3}/></>;
 if(kind==='performance')return <><Tape text="CUANDO HAY MUCHA ACCIÓN" accent={PINK} frame={local} x="70%" y="15%"/><div style={{position:'absolute',left:'54%',top:'34%',width:580,height:230,padding:20,background:'#070711e8',border:'2px solid '+PINK,boxShadow:'0 15px 35px #000b'}}><svg viewBox="0 0 580 220" width="100%" height="100%"><path d="M0 45 H580 M0 110 H580 M0 175 H580" stroke="#ffffff2a" strokeDasharray="6 8"/><path d="M0 70 L55 67 L95 75 L150 68 L205 73 L260 145 L315 160 L370 88 L420 72 L475 77 L530 71 L580 73" fill="none" stroke={PINK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/><circle cx="285" cy="151" r="12" fill={ORANGE}/></svg><div style={{fontFamily:'ImpactLocal',fontSize:22,color:WHITE}}>FRAME TIME / CAÍDAS</div></div><Tape text={beat===2?'TAMBIÉN HAY OPINIONES POSITIVAS':'ZONAS LLENAS · TIROTEOS'} accent={beat===2?TEAL:PINK} frame={local} x="71%" y="68%" angle={2}/></>;
 if(kind==='pacing')return <><BigWord text={beat===0?'RITMO DESIGUAL':beat===1?'INICIO LENTO':'MÁS CINEMÁTICO QUE JUGABLE'} accent={PINK} frame={local} x="59%" y="15%" size={beat===2?70:91}/><div style={{position:'absolute',left:'54%',top:'47%',width:650,display:'flex',gap:7,alignItems:'center'}}>{[1,1,1,2,2,2,3,3,3,3,1,1].map((n,i)=><div key={i} style={{height:n*27,width:38,background:i<3?PINK:i<9?ORANGE:TEAL,opacity:.9,transform:'skewX(-8deg)'}}/>)}</div><Tape text="MISIONES GUIADAS · ESCENAS LARGAS" accent={PINK} frame={local} x="70%" y="67%" angle={-2}/></>;
 if(kind==='realism')return <><BigWord text={beat===0?'MÁS REALISMO':beat===1?'MÁS CONSECUENCIAS':'CAMBIA TU RUTINA'} accent={ORANGE} frame={local} x="58%" y="15%" size={beat===1?95:86}/><div style={{position:'absolute',left:'54%',top:'43%',display:'flex',gap:12}}>{['COCHES','GASTOS','TAREAS'].map((v,i)=><div key={v} style={{width:150,padding:'22px 12px',background:'#080817ed',border:'2px solid '+[ORANGE,PINK,TEAL][i],fontFamily:'ImpactLocal',fontSize:24,color:WHITE,textAlign:'center',transform:'rotate('+[-3,2,-2][i]+'deg)',boxShadow:'0 12px 25px #000b'}}>{v}</div>)}</div><Tape text="NO ES EL MISMO GTA V" accent={ORANGE} frame={local} x="69%" y="68%" angle={3}/></>;
 if(kind==='preorders')return <><BigWord text="17M+" accent={ORANGE} frame={local} x="68%" y="22%" size={140}/><MetricCard frame={local} x="56%" y="47%" w={390} label="SENSOR TOWER" value="17 MILLONES+" accent={ORANGE} note="ESTIMACIÓN DE TERCEROS"/><Tape text="NO ES CIFRA OFICIAL" accent={PINK} frame={local} x="69%" y="78%" angle={-2}/></>;
 if(kind==='comparison')return <><Tape text="COMPARACIÓN" accent={ORANGE} frame={local} x="69%" y="14%"/><MetricCard frame={local} x="53%" y="34%" w={300} label="GTA V · DÍA 1" value="11 M" accent={ORANGE}/><div style={{position:'absolute',left:'69%',top:'49%',fontFamily:'ImpactLocal',fontSize:62,color:WHITE,textShadow:'3px 5px #000'}}>VS</div><MetricCard frame={local} x="75%" y="34%" w={310} label="GTA VI · PREVENTAS" value="17 M+" accent={TEAL} note="ESTIMACIÓN"/><Tape text="VENTAS ≠ PREVENTAS" accent={PINK} frame={local} x="69%" y="72%" angle={2}/></>;
 if(kind==='split')return <><BigWord text={beat===0?'CRÍTICOS: SÍ':beat===1?'JUGADORES: MATICES':'APLAUSO CASI UNÁNIME'} accent={TEAL} frame={local} x="58%" y="16%" size={beat===2?76:90}/><MetricCard frame={local} x="54%" y="49%" w={280} label="PRENSA" value="99/100" accent={TEAL}/><MetricCard frame={local} x="75%" y="49%" w={280} label="OBJECIONES" value="30 FPS" accent={PINK}/></>;
 if(kind==='verdict')return <><BigWord text={beat===0?'HISTÓRICO':beat===1?'NO ES PERFECTO':'LA ÚLTIMA PALABRA ES TUYA'} accent={TEAL} frame={local} x="58%" y="16%" size={beat===2?72:112}/><Tape text="VEREDICTO ZINKO" accent={TEAL} frame={local} x="70%" y="36%" angle={-2}/><MetricCard frame={local} x="60%" y="56%" w={410} label="AMBICIÓN" value="ENORME" accent={TEAL} note="PEGAS TÉCNICAS Y DE RITMO"/></>;
 if(kind==='outro')return <><BigWord text={beat===0?'¿QUÉ NOTA LE PONES?':beat===1?'SUSCRÍBETE A ZINKO':'SIGUIENTE VÍDEO'} accent={PINK} frame={local} x="50%" y="16%" size={beat===0?90:beat===1?104:96}/><Tape text="MÁS CURIOSIDAD GAMER" accent={TEAL} frame={local} x="50%" y="36%" angle={-2}/><div style={{position:'absolute',right:60,bottom:155,width:370,height:210,border:'4px solid '+PINK,background:'#050510cc',boxShadow:'0 0 32px '+PINK+'66',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'ImpactLocal',fontSize:32,color:WHITE,transform:'rotate(2deg)'}}>TU PRÓXIMO VÍDEO</div></>;
 return null;
}


function MotionHUD({frame,index,accent}:{frame:number;index:number;accent:string}){
 const sweep=(frame*19)%2100;
 const pulse=.55+.25*Math.sin(frame*.16);
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  <div style={{position:'absolute',left:26,top:26,width:92,height:42,borderTop:'2px solid '+accent,borderLeft:'2px solid '+accent,opacity:.62}}/>
  <div style={{position:'absolute',right:26,top:26,width:92,height:42,borderTop:'2px solid '+accent,borderRight:'2px solid '+accent,opacity:.62}}/>
  <div style={{position:'absolute',left:26,bottom:26,width:92,height:42,borderBottom:'2px solid '+accent,borderLeft:'2px solid '+accent,opacity:.62}}/>
  <div style={{position:'absolute',right:26,bottom:26,width:92,height:42,borderBottom:'2px solid '+accent,borderRight:'2px solid '+accent,opacity:.62}}/>
  <div style={{position:'absolute',left:0,top:sweep-120,width:'100%',height:2,background:'linear-gradient(90deg,transparent,'+accent+'88,transparent)',boxShadow:'0 0 18px '+accent,opacity:.42}}/>
  <div style={{position:'absolute',left:38,bottom:44,fontFamily:'ImpactLocal',fontSize:13,letterSpacing:2,color:WHITE,opacity:.58}}>ZINKO / FIELD REPORT / GTA VI</div>
  <div style={{position:'absolute',right:42,bottom:44,fontFamily:'ImpactLocal',fontSize:13,letterSpacing:2,color:accent,opacity:pulse}}>REC ● {String(index+1).padStart(2,'0')}:{String(Math.floor(frame/30)).padStart(2,'0')}</div>
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:4,background:'#ffffff20'}}><div style={{height:'100%',width:((index*300+frame)/5400*100)+'%',background:accent,boxShadow:'0 0 14px '+accent}}/></div>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.12}}>
   <path d={'M '+(sweep-180)+' 0 L '+(sweep+120)+' 1080'} stroke={accent} strokeWidth="2"/>
   <path d="M0 210 H1920 M0 870 H1920" stroke="white" strokeWidth="1" strokeDasharray="3 22"/>
  </svg>
 </AbsoluteFill>;
}
function SceneImpact({frame,index,accent}:{frame:number;index:number;accent:string}){
 if(frame>16)return null;
 const p=1-frame/16;
 const tilt=index%2===0?1:-1;
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  <div style={{position:'absolute',inset:0,background:accent,opacity:p*.2,mixBlendMode:'screen'}}/>
  <div style={{position:'absolute',left:'-15%',top:'43%',width:'130%',height:Math.max(4,42*p),background:WHITE,transform:'rotate('+(tilt*9)+'deg) translateX('+(frame*85-600)+'px)',boxShadow:'0 0 35px '+accent,opacity:p}}/>
  <div style={{position:'absolute',left:'50%',top:'50%',width:320+frame*30,height:320+frame*30,border:'2px solid '+accent,borderRadius:'50%',transform:'translate(-50%,-50%) scale('+(1-p*.35)+')',opacity:p*.7}}/>
 </AbsoluteFill>;
}

function BeatFlash({frame,index}:{frame:number;index:number}){
 const local=frame%100;
 if(local>10)return null;
 const p=1-local/10;
 const c=[TEAL,PINK,ORANGE][(index+Math.floor(frame/100))%3];
 return <AbsoluteFill style={{background:c,opacity:p*.24,mixBlendMode:'screen',pointerEvents:'none'}}/>;
}
function SceneView({index}:{index:number}){
 const frame=useCurrentFrame();
 const scene=scenes[index];
 const cue=scene.cues.find(c=>frame/FPS>=c.from&&frame/FPS<c.to)??scene.cues[0];
 const beat=Math.floor(frame/100);
 const beatFrame=frame-beat*100;
 const showNico=[0,1,3,5,6,8,9,11,12,15,16,17].includes(index);
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
  <Footage scene={scene} index={index}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(5,5,15,.12),rgba(5,5,15,.02) 42%,rgba(5,5,15,.34))'}}/>
  <div style={{position:'absolute',left:42,top:32,display:'flex',alignItems:'center',gap:15,opacity:.98}}>
   <div style={{fontFamily:'ImpactLocal',fontSize:24,letterSpacing:4,color:WHITE,textShadow:'0 3px 8px #000'}}>ZINKO</div>
   <div style={{height:4,width:130,background:'#ffffff55'}}><div style={{height:'100%',width:((index+1)/18*100)+'%',background:scene.accent,boxShadow:'0 0 14px '+scene.accent}}/></div>
   <div style={{fontFamily:'ImpactLocal',fontSize:18,color:WHITE,textShadow:'0 2px 6px #000'}}>{String(index+1).padStart(2,'0')} / 18</div>
  </div>
  <Tape text={scene.title} accent={scene.accent} frame={frame} x="69%" y="8%" angle={index%2===0?-2:2}/>
  <Graphic scene={scene} frame={frame} index={index}/>
  <MotionHUD frame={frame} index={index} accent={scene.accent}/>
  <SceneImpact frame={frame} index={index} accent={scene.accent}/>
  {showNico&&<Nico index={index} frame={frame} accent={scene.accent}/>}
  <Caption cue={cue} frame={frame} accent={scene.accent}/>
  <BeatFlash frame={frame} index={index}/>
  {index===0&&frame<22&&<div style={{position:'absolute',inset:0,background:WHITE,opacity:Math.max(0,1-frame/22)*.7}}/>}
  <Audio src={media('voice/'+scene.voice)} volume={1}/>
  <Sequence from={28} durationInFrames={18}><Audio src={media('sfx/hit.wav')} volume={.38}/></Sequence>
  <Sequence from={112} durationInFrames={18}><Audio src={media('sfx/whoosh.wav')} volume={.3}/></Sequence>
  <Sequence from={212} durationInFrames={18}><Audio src={media('sfx/pop.wav')} volume={.32}/></Sequence>
 </AbsoluteFill>;
}
const V5:React.FC=()=>{
 const [handle]=useState(()=>delayRender('Cargando tipografías y recursos ZINKO V5'));
 useEffect(()=>{
  const fonts=[new FontFace('CaptionLocal','url('+media('fonts/Caption.ttf')+')'),new FontFace('ImpactLocal','url('+media('fonts/Impact.ttf')+')')];
  Promise.all(fonts.map(f=>f.load())).then(loaded=>{loaded.forEach(f=>document.fonts.add(f));continueRender(handle)}).catch(cancelRender);
 },[handle]);
 return <AbsoluteFill style={{background:INK}}>
  {scenes.map((s,i)=><Sequence key={i} from={i*300} durationInFrames={300} premountFor={30}><SceneView index={i}/></Sequence>)}
 </AbsoluteFill>;
};
export const GTA6ZinkoMotionV5=V5;
