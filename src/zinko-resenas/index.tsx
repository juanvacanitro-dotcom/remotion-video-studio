import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Img, OffthreadVideo, Sequence, cancelRender, continueRender, delayRender, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';

const FPS=30, W=1280, H=720, Y='#ffeb1d', INK='#15121b', WHITE='#fffef8', ORANGE='#ff714a';
const common=(s:string)=>staticFile(`zinko-proof/${s}`);
const media=(s:string)=>staticFile(`zinko-resenas/${s}`);
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{n=clamp(n);return n*n*(3-2*n)};
const pop=(f:number,damping=14)=>spring({frame:Math.max(0,f),fps:FPS,config:{mass:.72,damping,stiffness:185}});
const shadow=(depth:number,color=INK)=>Array.from({length:depth},(_,i)=>`${i*.8+1}px ${i+2}px 0 ${color}`).join(',');

function Text({text,x,y,size=90,f,delay=0,angle=-4,color=Y,depth=6,maxWidth=1200}:{text:string;x:number;y:number;size?:number;f:number;delay?:number;angle?:number;color?:string;depth?:number;maxWidth?:number}){
 if(f<delay)return null;
 const a=f-delay,p=pop(a),q=ease(a/13);
 return <div style={{position:'absolute',left:x+2*Math.sin(a*.057),top:y+3*Math.sin(a*.071),maxWidth,whiteSpace:'nowrap',fontFamily:'ZinkoImpact',fontSize:size,lineHeight:1.14,color,WebkitTextStroke:`2.8px ${INK}`,paintOrder:'stroke fill',textShadow:shadow(depth)+', 2px 15px 18px #0003',transform:`translate(-50%,-50%) perspective(1300px) rotateY(${(1-q)*-32}deg) rotateZ(${angle+(1-q)*-7}deg) translateY(${(1-q)*45}px) scale(${.65+.35*p})`,transformOrigin:'50% 65%',opacity:clamp(a/2)}}>{text}</div>
}
function Nico({f,pose='happy',x=640,y=450,width=440,delay=0,angle=0}:{f:number;pose?:'happy'|'question';x?:number;y?:number;width?:number;delay?:number;angle?:number}){
 if(f<delay)return null;
 const a=f-delay;
 return <Img src={common(`nico-${pose}.webp`)} style={{position:'absolute',left:x+5*Math.sin(a*.055),top:y+6*Math.sin(a*.085),width,transform:`translate(-50%,-50%) rotate(${angle+1.5*Math.sin(a*.067)}deg) translateY(${65*(1-ease(a/12))}px) scale(${Math.max(.02,pop(a,12))*(1+.01*Math.sin(a*.095))})`,filter:'drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(10px 14px 7px #0004)'}}/>
}
function Paper({f}:{f:number}){
 return <AbsoluteFill style={{background:WHITE}}><Img src={common('paper.jpg')} style={{position:'absolute',left:-20,top:-15,width:1320,height:750,objectFit:'cover',transform:`translate(${4*Math.sin(f*.02)}px,${4*Math.cos(f*.017)}px) rotate(${.15*Math.sin(f*.021)}deg)`}}/></AbsoluteFill>
}
function Film({name,f,shade=.15}:{name:string;f:number;shade?:number}){
 return <AbsoluteFill style={{overflow:'hidden'}}><OffthreadVideo src={media(name)} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1.025+f*.0005}) translateX(${3*Math.sin(f*.025)}px)`,filter:'saturate(1.05)'}}/><AbsoluteFill style={{background:`linear-gradient(#10121b${Math.round(shade*255).toString(16).padStart(2,'0')},#10121b00 45%,#10121b60)`}}/><div style={{position:'absolute',left:18,bottom:10,font:'12px Arial',color:'#eee',textShadow:'0 1px 2px #000'}}>Imágenes: Rockstar Games · tráiler oficial</div></AbsoluteFill>
}
function Trophy({f,x=850,y=365,size=430}:{f:number;x?:number;y?:number;size?:number}){
 const p=pop(f,13);
 return <div style={{position:'absolute',left:x,top:y,width:size,height:size*1.12,transform:`translate(-50%,-50%) perspective(1200px) rotateY(${18*Math.sin(f*.035)+(1-ease(f/14))*35}deg) rotateZ(${-8+3*Math.sin(f*.065)}deg) scale(${.45+.55*p})`,filter:'drop-shadow(18px 22px 10px #0004)'}}>
 <svg viewBox="0 0 400 450" width="100%" height="100%"><defs><linearGradient id="gold"><stop stopColor="#98600a"/><stop offset=".27" stopColor="#ffe890"/><stop offset=".49" stopColor="#fffad4"/><stop offset=".57" stopColor="#e7a825"/><stop offset="1" stopColor="#9d620d"/></linearGradient><linearGradient id="base"><stop stopColor="#181521"/><stop offset=".45" stopColor="#514a5b"/><stop offset="1" stopColor="#1b1722"/></linearGradient></defs>
 <path d="M112 90H40C38 210 95 225 146 212M288 90H360C362 210 305 225 254 212" fill="none" stroke={INK} strokeWidth="31"/><path d="M112 90H40C38 210 95 225 146 212M288 90H360C362 210 305 225 254 212" fill="none" stroke="url(#gold)" strokeWidth="23"/>
 <path d="M96 66H304L285 182Q277 237 217 252L215 304H252L275 336H125L148 304H185L183 252Q123 237 115 182Z" fill="url(#gold)" stroke={INK} strokeWidth="4" strokeLinejoin="round"/>
 <ellipse cx="200" cy="66" rx="104" ry="18" fill="#ffe89d" stroke={INK} strokeWidth="4"/><ellipse cx="200" cy="66" rx="88" ry="10" fill="#b87915"/>
 <path d="M117 92Q132 200 178 221" fill="none" stroke="#fff6bc" strokeWidth="9" opacity=".8"/><path d="M95 340H305V410H95Z" fill="url(#base)" stroke={INK} strokeWidth="5"/><path d="M95 340L122 322H278L305 340Z" fill="#62596d" stroke={INK} strokeWidth="4"/>
 <rect x="154" y="356" width="92" height="35" rx="2" fill="url(#gold)"/><path d="m200 119 12 25 28 4-20 20 5 28-25-13-25 13 5-28-20-20 28-4Z" fill="#fff0a6" stroke="#a8731a" strokeWidth="3"/>
 </svg></div>
}
function Logo({f,x=640,y=335,width=440}:{f:number;x?:number;y?:number;width?:number}){
 return <Img src={common('gta-logo.webp')} style={{position:'absolute',left:x+3*Math.sin(f*.08),top:y+4*Math.sin(f*.065),width,transform:`translate(-50%,-50%) perspective(1200px) rotateY(${(1-ease(f/13))*-42+5*Math.sin(f*.032)}deg) rotate(${-5+2*Math.sin(f*.04)}deg) scale(${.65+.35*pop(f)})`,filter:'drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(12px 17px 10px #0007)'}}/>
}
function Photo({name,f,x,y,width,angle}:{name:string;f:number;x:number;y:number;width:number;angle:number}){
 if(f<0)return null;
 return <div style={{position:'absolute',left:x+3*Math.sin(f*.04),top:y+6*Math.sin(f*.06),width,height:width*.59,padding:10,paddingBottom:23,background:WHITE,boxShadow:'12px 16px 16px #0004',transform:`translate(-50%,-50%) perspective(1200px) rotateY(${(1-ease(f/13))*-35}deg) rotate(${angle+2*Math.sin(f*.045)}deg) scale(${Math.max(.01,pop(f))})`}}><OffthreadVideo src={media(name)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
}
const starts=[0,42,95,214,278,358,460,515,617,702];
function Scene({index}:{index:number}){
 const f=useCurrentFrame();
 if(index===0)return <AbsoluteFill><Paper f={f}/><Text text="UN RÉCORD" x={440} y={180} size={112} f={f} delay={1} color={WHITE}/><Nico f={f} x={265} y={465} width={355} delay={3} angle={-4}/><Trophy f={f} x={890} y={365} size={460}/><svg width={W} height={H} style={{position:'absolute',inset:0,opacity:ease((f-9)/8)}}><path d="M487 344Q580 245 655 296M630 269L660 298L619 311" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="260" strokeDashoffset={260*(1-ease((f-9)/14))}/></svg></AbsoluteFill>;
 if(index===1)return <AbsoluteFill><Paper f={f+42}/>
 <Text text="28" x={440} y={290} size={290} f={f} delay={1} depth={13} angle={-8}/><Text text="AÑOS" x={875} y={284} size={135} f={f} delay={12} color={WHITE} angle={5} depth={8}/>
 <svg width={W} height={H} style={{position:'absolute',inset:0}}><path d="M165 535H1105" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeDasharray="940" strokeDashoffset={940*(1-ease((f-5)/20))}/>{[165,1105].map(x=><circle key={x} cx={x} cy="535" r="10" fill={Y} stroke={INK} strokeWidth="4"/>)}{Array.from({length:29},(_,i)=><path key={i} d={`M${165+i*940/28} 525v20`} stroke={INK} strokeWidth={i%7===0?4:2} opacity={i/28<ease((f-6)/25)?.5:0}/>)}</svg>
 <Text text="1998" x={215} y={578} size={42} f={f} delay={8} color={WHITE} angle={-3} depth={3}/><Text text="2026" x={1060} y={578} size={42} f={f} delay={25} angle={3} depth={3}/><Nico f={f} pose="question" x={920} y={445} width={180} delay={9}/></AbsoluteFill>;
 if(index===2)return <AbsoluteFill><Film name="reveal.mp4" f={f}/>{f<59?<><Logo f={f} x={615} y={330} width={480}/><Nico f={f} x={1085} y={492} width={245} delay={4} angle={7}/></>:<><Logo f={f-59} x={188} y={178} width={225}/><Text text="RESEÑAS" x={714} y={265} size={92} f={f} delay={59} color={WHITE} angle={-5}/><Text text="HISTÓRICAS" x={700} y={408} size={118} f={f} delay={76} depth={10} angle={-5}/></>}</AbsoluteFill>;
 if(index===3)return <AbsoluteFill><Paper f={f+214}/><Nico f={f} pose="question" x={307} y={412} width={366} delay={1} angle={-4}/><Text text="¿Y LAS" x={845} y={250} size={83} f={f} delay={2} color={WHITE} angle={-6}/><Text text="PEGAS?" x={840} y={399} size={151} f={f} delay={10} depth={11} angle={-6}/><div style={{position:'absolute',left:1045,top:80,transform:`rotate(${15+4*Math.sin(f*.08)}deg) scale(${Math.max(.01,pop(f-15))})`,opacity:clamp((f-15)/3)}}><svg width="115" height="110" viewBox="0 0 115 110"><path d="M57 6L110 101H5Z" fill={ORANGE} stroke={INK} strokeWidth="6" strokeLinejoin="round"/><path d="M57 36V66" stroke={INK} strokeWidth="10" strokeLinecap="round"/><circle cx="57" cy="85" r="5" fill={INK}/></svg></div></AbsoluteFill>;
 if(index===4)return <AbsoluteFill><Paper f={f+278}/><Text text="ZINKO" x={640} y={198} size={190} f={f} delay={1} angle={-4} depth={12}/><Nico f={f} x={646} y={465} width={525} delay={2}/><svg width={W} height={H} style={{position:'absolute',inset:0,opacity:clamp((f-26)/7),transform:`translateY(${5*Math.sin(f*.07)}px)`}}><g fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round"><circle cx="1033" cy="382" r="45" strokeDasharray="283" strokeDashoffset={283*(1-ease((f-26)/15))}/><path d="M1066 417l46 48" strokeDasharray="75" strokeDashoffset={75*(1-ease((f-39)/9))}/><path d="M212 358q-35-55 10-83q43-23 62 14q12 25-23 49v20M260 380v2" strokeDasharray="200" strokeDashoffset={200*(1-ease((f-34)/20))}/></g></svg></AbsoluteFill>;
 if(index===5){
  if(f>=68)return <AbsoluteFill><Sequence from={68}><Film name="night.mp4" f={f-68} shade={.35}/></Sequence><Text text="¿VALIÓ" x={620} y={260} size={133} f={f} delay={68} color={WHITE} angle={-5}/><Text text="LA ESPERA?" x={640} y={417} size={116} f={f} delay={76} depth={9} angle={-5}/></AbsoluteFill>;
  return <AbsoluteFill><Paper f={f+358}/><Photo name="world.mp4" f={f} x={360} y={393} width={530} angle={-7}/><Sequence from={32}><Photo name="city.mp4" f={f-32} x={922} y={395} width={484} angle={8}/></Sequence>{f<21?<Text text="HOY VEREMOS" x={640} y={162} size={85} f={f} delay={1} color={WHITE}/>:<Text text="QUÉ AMAN" x={342} y={176} size={77} f={f} delay={21} angle={-7}/>}<Text text="QUÉ CRITICAN" x={910} y={180} size={65} f={f} delay={40} color={WHITE} angle={8}/></AbsoluteFill>;
 }
 if(index===6)return <AbsoluteFill><Paper f={f+460}/><Text text="AL FINAL" x={604} y={178} size={72} f={f} delay={1} color={WHITE} angle={-5}/><Text text="MI VEREDICTO" x={642} y={330} size={119} f={f} delay={12} depth={11} angle={-5}/><Nico f={f} pose="question" x={1026} y={490} width={235} delay={8} angle={5}/><svg width={W} height={H} style={{position:'absolute',inset:0}}><path d="M200 428Q590 394 984 428M235 443Q580 421 907 448" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="1500" strokeDashoffset={1500*(1-ease((f-18)/23))}/></svg></AbsoluteFill>;
 if(index===7)return <AbsoluteFill><Film name="city.mp4" f={f} shade={.25}/><Nico f={f} x={256} y={473} width={340} delay={2}/>{f<50?<><Text text="LAS RESEÑAS" x={810} y={228} size={81} f={f} delay={3} color={WHITE}/><Text text="APUNTAN AL" x={818} y={352} size={70} f={f} delay={18} color={WHITE}/><Text text="RÉCORD" x={814} y={471} size={107} f={f} delay={30} depth={8}/></>:<><Text text="CASI" x={808} y={260} size={114} f={f} delay={50} color={WHITE} angle={-6}/><Text text="PERFECTA" x={804} y={416} size={122} f={f} delay={64} angle={-6} depth={11}/></>}</AbsoluteFill>;
 if(index===8)return <AbsoluteFill><Paper f={f+617}/><Text text="99" x={442} y={333} size={342} f={f} delay={1} color="#4dde8d" angle={-8} depth={17}/><Text text="/100" x={940} y={391} size={116} f={f} delay={20} color={WHITE} angle={3} depth={7}/><Text text="METACRITIC" x={874} y={235} size={62} f={f} delay={43} angle={3}/><Nico f={f} pose="question" x={1120} y={540} width={160} delay={24}/><svg width={W} height={H} style={{position:'absolute',inset:0}}><path d="M194 542Q474 505 744 548" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="570" strokeDashoffset={570*(1-ease((f-24)/21))}/></svg><div style={{position:'absolute',left:22,bottom:9,font:'14px Arial',color:'#49434d'}}>Metacritic · PS5 · primeras reseñas · 19/11/2026</div></AbsoluteFill>;
 return <AbsoluteFill><Paper f={f+702}/>{Array.from({length:18},(_,i)=>{const a=f-i*2;if(a<0)return null;const x=70+(i*197)%1160,y=-170+(a*4.6+i*71)%1040;return <div key={i} style={{position:'absolute',left:x,top:y,width:98,height:130,background:WHITE,border:`2px solid ${INK}`,boxShadow:'7px 10px 7px #0002',transform:`perspective(800px) rotateY(${26*Math.sin(a*.04+i)}deg) rotate(${(i%2?1:-1)*(12+i%5*4)+a*.2}deg)`,opacity:.72}}><div style={{height:17,margin:10,background:i%3===0?'#4dde8d':Y}}/>{[0,1,2,3].map(j=><div key={j} style={{height:3,margin:'9px 10px',width:j===3?42:73,background:'#a29d9f'}}/>)}</div>})}<div style={{position:'absolute',inset:'105px 160px 143px',background:'radial-gradient(ellipse,#fffef9f2 32%,#fffef900 73%)'}}/><Text text="MÁS DE" x={375} y={174} size={61} f={f} delay={2} color={WHITE} angle={-6}/><Text text="140" x={582} y={337} size={250} f={f} delay={9} depth={13} angle={-6}/><Text text="+" x={875} y={300} size={158} f={f} delay={19} color={WHITE} angle={7} depth={10}/><Text text="CRÍTICOS" x={635} y={511} size={104} f={f} delay={44} color={WHITE} angle={-6} depth={7}/><Nico f={f} x={1130} y={508} width={204} delay={29} angle={8}/><div style={{position:'absolute',left:22,bottom:9,font:'14px Arial',color:'#49434d'}}>Primeras reseñas de prensa · 19/11/2026</div></AbsoluteFill>;
}

const cues:[number,number,string][]=[
 [.03,1.32,'Un juego acaba de igualar'],[1.33,1.94,'un récord de'],[1.94,3.08,'28 años'],
 [3.22,4.98,'Es GTA 6,'],[4.99,5.94,'y las reseñas'],[5.94,7.08,'son históricas.'],
 [7.20,8.15,'Pero tiene pegas'],[8.15,9.18,'que casi nadie cuenta.'],
 [9.38,10.55,'Bienvenido a Zinko,'],[10.55,11.83,'el canal de la curiosidad.'],
 [12.02,12.65,'Hoy veremos'],[12.65,13.10,'qué aman,'],[13.28,13.93,'qué critican'],[13.94,15.20,'y si valió la espera.'],
 [15.41,16.02,'Y al final,'],[16.02,17.02,'mi veredicto.'],
 [17.22,18.45,'Las reseñas salieron'],[18.45,19.00,'con una nota'],[19.00,20.42,'casi perfecta.'],
 [20.63,22.34,'99 sobre 100'],[22.34,23.20,'en Metacritic.'],
 [23.58,25.22,'Más de 140'],[25.22,26.48,'críticos lo puntuaron.']
];
function Captions({frame}:{frame:number}){
 const cue=cues.find(([s,e])=>frame/FPS>=s&&frame/FPS<e);if(!cue)return null;
 const a=frame-cue[0]*FPS,p=pop(a,18);
 return <div style={{position:'absolute',left:42,right:42,bottom:32,textAlign:'center',fontFamily:'ZinkoCaption',fontSize:57,lineHeight:1.14,color:Y,WebkitTextStroke:`4px ${INK}`,paintOrder:'stroke fill',textShadow:`2px 5px 0 ${INK}`,whiteSpace:'nowrap',transform:`translateY(${(1-p)*13}px) scale(${.96+.04*p})`}}>{cue[2]}</div>
}
function Layer({index,style={}}:{index:number;style?:React.CSSProperties}){return <AbsoluteFill style={style}><Sequence from={starts[index]}><Scene index={index}/></Sequence></AbsoluteFill>}
function torn(p:number){const x=-65+1415*p,points=['0px 0px'];for(let y=0;y<=720;y+=16)points.push(`${x+12*Math.sin(y*.21)+8*Math.cos(y*.43)}px ${y}px`);points.push('0px 720px');return `polygon(${points.join(',')})`}
function Video(){
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Zinko local fonts'));
 useEffect(()=>{const fonts=[new FontFace('ZinkoCaption',`url(${common('Caption.ttf')})`),new FontFace('ZinkoImpact',`url(${common('Impact.ttf')})`)];Promise.all(fonts.map(f=>f.load())).then(fs=>{fs.forEach(f=>document.fonts.add(f));continueRender(handle)}).catch(cancelRender)},[handle]);
 let index=0;starts.forEach((s,i)=>{if(frame>=s)index=i});const age=frame-starts[index],p=ease(age/7);
 const tear=[1,3,7,8,9].includes(index)&&age<8;
 const whip=[2,4,6].includes(index)&&age<7;
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}><div style={{position:'absolute',width:W,height:H,transform:'scale(1.5)',transformOrigin:'0 0',overflow:'hidden'}}>
 {tear?<><Layer index={index-1}/><Layer index={index} style={{clipPath:torn(p)}}/></>:whip?<><Layer index={index-1} style={{transform:`translateX(${-1280*p}px)`,filter:`blur(${4*Math.sin(p*Math.PI)}px)`}}/><Layer index={index} style={{transform:`translateX(${1280*(1-p)}px)`,filter:`blur(${4*Math.sin(p*Math.PI)}px)`}}/></>:<Layer index={index}/>}
 <Captions frame={frame}/></div><Audio src={media('audio.m4a')}/>{frame>802&&<AbsoluteFill style={{background:INK,opacity:ease((frame-802)/4)}}/>}</AbsoluteFill>
}
const Root=()=> <Composition id="ZinkoResenas" component={Video} durationInFrames={807} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
