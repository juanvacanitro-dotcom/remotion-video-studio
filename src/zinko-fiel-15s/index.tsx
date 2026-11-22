import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Img, OffthreadVideo, Sequence, cancelRender, continueRender, delayRender, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';

const FPS=30, YELLOW='#ffeb1d', INK='#100e15';
const file=(name:string)=>staticFile(`zinko-proof/${name}`);
const fullFile=(name:string)=>staticFile(`zinko-full/${name}`);
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
const ease=(x:number)=>{x=clamp(x);return x*x*(3-2*x)};
const pop=(f:number,delay=0,damping=12)=>spring({frame:Math.max(0,f-delay),fps:FPS,config:{mass:.75,damping,stiffness:185}});

type TypeProps={children:React.ReactNode;x:number;y:number;size?:number;f:number;delay?:number;angle?:number;color?:string;depth?:number};
function Type({children,x,y,size=90,f,delay=0,angle=0,color=YELLOW,depth=4}:TypeProps){
 if(f<delay)return null;
 const p=pop(f,delay),q=ease((f-delay)/14);
 return <div style={{position:'absolute',left:x,top:y,transform:`translate(-50%,-50%) perspective(1000px) rotateY(${(1-q)*-36}deg) rotateZ(${angle+(1-q)*-9}deg) translateY(${(1-q)*55}px) scale(${.55+.45*p})`,opacity:clamp((f-delay)/3),transformOrigin:'50% 75%',fontFamily:'ImpactLocal',whiteSpace:'nowrap',fontSize:size,color,WebkitTextStroke:`2.5px ${INK}`,paintOrder:'stroke fill',textShadow:Array.from({length:depth},(_,i)=>`${i+1}px ${i+2}px 0 ${INK}`).join(',')+', 0 10px 18px #0004',lineHeight:1.08}}>{children}</div>
}
type NicoProps={f:number;pose?:'happy'|'question';x?:number;y?:number;width?:number;delay?:number;angle?:number};
function Nico({f,pose='happy',x=665,y=440,width=600,delay=0,angle=0}:NicoProps){
 if(f<delay)return null;
 const a=f-delay,p=pop(a,0,11);
 return <Img src={file(`nico-${pose}.webp`)} style={{position:'absolute',left:x+4*Math.sin(a*.08),top:y+6*Math.sin(a*.11)+70*(1-ease(a/10)),width,transform:`translate(-50%,-50%) rotate(${angle+2*Math.sin(a*.095)}deg) scale(${Math.max(.01,p)*(1+.012*Math.sin(a*.13))})`,filter:'drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(8px 13px 5px #0003)'}}/>
}
function Paper({f}:{f:number}){
 return <AbsoluteFill style={{background:'#fcfcf8',overflow:'hidden'}}><Img src={file('paper.jpg')} style={{width:'105%',height:'105%',objectFit:'cover',transform:`translate(${-12+5*Math.sin(f*.017)}px,${-13+4*Math.cos(f*.021)}px) rotate(${.3*Math.sin(f*.01)}deg)`}}/></AbsoluteFill>
}
function Film({name,f,zoom=1,extended=false}:{name:string;f:number;zoom?:number;extended?:boolean}){
 return <AbsoluteFill style={{overflow:'hidden'}}><OffthreadVideo src={extended?fullFile(name):file(name)} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${zoom+.0003*f}) translateX(${3*Math.sin(f*.04)}px)`,filter:'saturate(1.06)'}}/><AbsoluteFill style={{background:'linear-gradient(transparent 58%, #09091c44)'}}/><div style={{position:'absolute',bottom:12,left:20,font:'12px sans-serif',color:'#ddd',textShadow:'0 1px 2px black'}}>Imágenes del juego: Rockstar Games</div></AbsoluteFill>
}
function Calendar({f}:{f:number}){
 const p=pop(f,3,13),flip=pop(f,20,15);
 return <div style={{position:'absolute',left:806+10*Math.sin(f*.04),top:327,width:395,height:438,transform:`translate(-50%,-50%) perspective(1300px) translateY(${(1-ease(f/12))*90}px) rotateX(${(1-p)*-65}deg) rotateY(${(1-p)*25+4*Math.sin(f*.045)}deg) rotateZ(${-5+2*Math.sin(f*.05)}deg) scale(${.6+.4*p})`,filter:'drop-shadow(12px 20px 9px #0003)',transformStyle:'preserve-3d'}}>
 {[2,1].map(i=><div key={i} style={{position:'absolute',inset:0,background:i===2?'#deddd5':'#f0efe8',border:`2px solid ${INK}`,transform:`translate(${i*7}px,${i*6}px) rotate(${i*1.5}deg)`}}/>)}
 <div style={{position:'absolute',inset:0,background:'#fffef6',border:`3px solid ${INK}`,clipPath:'polygon(0 0,100% 0,100% 96%,96% 98%,91% 96%,86% 99%,81% 97%,76% 100%,71% 98%,66% 100%,61% 97%,56% 99%,51% 97%,46% 99%,41% 97%,36% 100%,31% 98%,26% 100%,21% 97%,16% 99%,11% 97%,6% 100%,0 97%)'}}>
 <div style={{background:YELLOW,height:86,display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'ImpactLocal',fontSize:43,color:INK}}>NOVIEMBRE</div>
 <div style={{position:'absolute',top:80,left:0,right:0,textAlign:'center',fontFamily:'ImpactLocal',fontSize:210,lineHeight:1.22,color:INK,opacity:clamp((f-19)/4),transform:`perspective(800px) rotateX(${(1-flip)*-74}deg) scale(${.82+.18*flip})`,transformOrigin:'50% 0%'}}>19</div>
 <div style={{position:'absolute',bottom:35,left:0,right:0,textAlign:'center',fontFamily:'ImpactLocal',fontSize:50,color:INK}}>2026</div></div>
 {[85,300].map(x=><div key={x} style={{position:'absolute',top:-11,left:x,width:14,height:28,borderRadius:9,background:INK}}/>)}
 </div>
}
const cues:[number,number,string][]=[[.05,1.48,'El juego más esperado'],[1.48,1.97,'de la década'],[1.97,2.57,'sale este'],[2.57,4.03,'19 de noviembre'],[4.20,5.30,'Millones de personas'],[5.30,7.02,'llevan años esperándolo'],[9.37,10.66,'Bienvenido a Zinko'],[10.83,12.27,'el canal de la curiosidad'],[15.37,16.14,'¿Será un éxito'],[16.14,17.75,'y superará las expectativas?'],[17.98,19.38,'GTA 6 es el nuevo juego'],[19.38,21,'de Rockstar Games'],[24.18,25.39,'En PlayStation 5'],[25.39,26.58,'y Xbox Series']];
function Captions({frame}:{frame:number}){
 const t=frame/FPS,c=cues.find(([s,e])=>t>=s&&t<e);if(!c)return null;
 const p=pop(frame-c[0]*FPS,0,17);
 return <div style={{position:'absolute',left:0,right:0,bottom:28,textAlign:'center',fontFamily:'CaptionLocal',fontSize:65,color:YELLOW,WebkitTextStroke:`4px ${INK}`,paintOrder:'stroke fill',textShadow:`2px 5px 0 ${INK}`,transform:`translateY(${(1-p)*16}px) scale(${.95+.05*p})`,whiteSpace:'nowrap'}}>{c[2]}</div>
}
function Photo({name,f,x,y,width,ratio,angle=-6}:{name:string;f:number;x:number;y:number;width:number;ratio:number;angle?:number}){
 const p=pop(f,0,13);
 return <div style={{position:'absolute',left:x,top:y,width,height:width/ratio,padding:9,background:'#fffef9',boxShadow:'10px 16px 15px #0004',transform:`translate(-50%,-50%) perspective(1100px) rotateY(${(1-ease(f/12))*-28}deg) rotate(${angle+2*Math.sin(f*.07)}deg) scale(${Math.max(.01,p)})`}}><OffthreadVideo src={fullFile(name)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
}
function ConsoleProp({name,f,x,y,width,angle}:{name:string;f:number;x:number;y:number;width:number;angle:number}){
 if(f<0)return null;
 return <Img src={fullFile(name)} style={{position:'absolute',left:x+35*Math.sin(f*.06),top:y+15*Math.sin(f*.08),width,transform:`translate(-50%,-50%) perspective(1000px) rotateY(${7*Math.sin(f*.07)}deg) rotate(${angle+6*Math.sin(f*.083)}deg) scale(${Math.max(.01,pop(f,0,13))})`,filter:'drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(11px 17px 8px #0004)'}}/>
}
function Scene({index}:{index:number}){
 const f=useCurrentFrame();
 if(index===0)return <AbsoluteFill>
 <Film name="opening.mp4" f={f} zoom={1.04}/>
 <Img src={file('gta-logo.webp')} style={{position:'absolute',left:80,top:94,width:245,transform:`perspective(900px) rotateY(${(1-ease(f/13))*-40}deg) rotate(${-7+2*Math.sin(f*.06)}deg) scale(${.85+.15*pop(f)})`,filter:'drop-shadow(8px 10px 5px #0006)'}}/>
 <Type x={800} y={129} size={68} f={f} delay={5} angle={-5} color="#fffef8" depth={5}>MÁS ESPERADO</Type>
 <Nico f={f} x={730} y={445} width={610}/></AbsoluteFill>;
 if(index===1)return <AbsoluteFill>
 <Paper f={f}/><Nico f={f} x={267} y={449} width={410} delay={3} angle={-3}/>
 <svg width="1280" height="720" style={{position:'absolute',inset:0,opacity:clamp((f-12)/8)}}><path d="M355 260 Q410 170 542 219 M520 185 L546 221 L503 227" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="260" strokeDashoffset={260*(1-ease((f-12)/14))}/></svg>
 <Calendar f={f}/></AbsoluteFill>;
 if(index===2)return <AbsoluteFill>
 {f<36?<Film name="crowd.mp4" f={f} zoom={1.03}/>:<Sequence from={36}><Film name="lowrider.mp4" f={f-36} zoom={1.03}/></Sequence>}
 <Nico f={f} x={200} y={449} width={300} angle={-5}/><Nico f={f} x={1075} y={452} width={295} delay={3} angle={6}/><Nico f={f} x={640} y={443} width={555} delay={5}/>
 {f<38?<Type x={640} y={130} size={94} f={f} delay={4} angle={-4}>MILLONES</Type>:<Type x={640} y={128} size={73} f={f} delay={38} angle={3} color="#fffef8">AÑOS ESPERANDO</Type>}</AbsoluteFill>;
 if(index===3)return <AbsoluteFill><Paper f={f+200}/><Nico f={f} pose="question" x={353} y={416} width={380} delay={2} angle={-2}/>
 <Type x={164} y={218} size={136} f={f} delay={6} angle={-17}>?</Type>
 <div style={{position:'absolute',inset:0,transform:`translate(${4*Math.sin(f*.07)}px,${3*Math.sin(f*.09)}px)`}}>
 <Type x={862} y={242} size={65} f={f} delay={3} angle={-6} color="#fffef8">¿SERÁ UN</Type>
 <Type x={840} y={367} size={155} f={f} delay={13} angle={-6} depth={9}>ÉXITO</Type>
 <Type x={840} y={521} size={76} f={f} delay={33} angle={-6} color="#fffef8" depth={5}>DE VERDAD?</Type>
 </div></AbsoluteFill>;
 if(index===4)return <AbsoluteFill>
 <Paper f={f+278}/><Type x={640} y={185} size={174} f={f} delay={2} angle={-4} depth={8}>ZINKO</Type>
 <Nico f={f} x={640} y={451} width={595} delay={2}/>
 {f>43&&<svg width="1280" height="720" style={{position:'absolute',inset:0,transform:`translateY(${7*Math.sin(f*.09)}px) rotate(${2*Math.sin(f*.06)}deg)`,opacity:clamp((f-43)/8)}}><g stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round"><circle cx="1053" cy="326" r="48" strokeDasharray="302" strokeDashoffset={302*(1-ease((f-43)/15))}/><path d="M1087 363 L1134 416" strokeDasharray="80" strokeDashoffset={80*(1-ease((f-53)/10))}/></g></svg>}
 </AbsoluteFill>;
 if(index===5)return <AbsoluteFill>
 <Film name="action.mp4" f={f} zoom={1.015} extended/>
 {f<24?<><Type x={280} y={259} size={98} f={f} delay={2} angle={-9} color="#fffef8">HOY</Type><Type x={680} y={402} size={90} f={f} delay={7} angle={-9}>RESPONDEMOS</Type></>:f<53?<Type x={640} y={355} size={124} f={f} delay={24} angle={7} depth={8}>2 PREGUNTAS</Type>:<><Type x={640} y={211} size={65} f={f} delay={53} angle={-6} color="#fffef8">SOBRE</Type><Img src={file('gta-logo.webp')} style={{position:'absolute',left:640,top:430,width:315,transform:`translate(-50%,-50%) perspective(900px) rotateY(${(1-ease((f-53)/13))*-40}deg) rotate(${-6+2*Math.sin(f*.08)}deg) scale(${Math.max(.01,pop(f,53))})`,filter:'drop-shadow(8px 12px 7px #0004)'}}/></>}
 </AbsoluteFill>;
 if(index===6)return <AbsoluteFill><Paper f={f+458}/>
 {f<26?<><Photo name="success.mp4" f={f} x={840} y={330} width={490} ratio={480/398}/><Nico f={f} pose="question" x={300} y={418} width={275}/></>:<>
 <Type x={630} y={152} size={96} f={f} delay={26} angle={-4} depth={5}>EXPECTATIVAS</Type><Nico f={f-26} pose="question" x={745} y={421} width={310}/>
 <Sequence from={36}><Photo name="shock.mp4" f={f-36} x={285} y={376} width={320} ratio={384/368} angle={6}/></Sequence>
 </>}
 </AbsoluteFill>;
 if(index===7)return <AbsoluteFill><Film name="opening.mp4" f={f} zoom={1.025}/><Img src={file('gta-logo.webp')} style={{position:'absolute',left:640+4*Math.sin(f*.12),top:326+5*Math.sin(f*.07),width:440,transform:`translate(-50%,-50%) perspective(1000px) rotateY(${(1-ease(f/12))*-34}deg) rotate(${-5+3*Math.sin(f*.06)}deg) scale(${Math.max(.01,pop(f,0,13))})`,filter:f>=3&&f<=5?'drop-shadow(6px 0 0 #ff3b82) drop-shadow(-6px 0 0 #1bffff)':'drop-shadow(10px 14px 7px #0005)'}}/></AbsoluteFill>;
 if(index===8)return <AbsoluteFill><Film name="rockstar.mp4" f={f} zoom={1.01} extended/></AbsoluteFill>;
 if(index===9)return <AbsoluteFill><Film name="coast.mp4" f={f} zoom={1.015} extended/>
 <Type x={265} y={160} size={56} f={f} delay={3} color="#fffef8" angle={-8}>SALE EL</Type>
 <Type x={375} y={352} size={234} f={f} delay={14} color="#fffef8" angle={-8} depth={9}>19</Type>
 <Type x={830} y={365} size={102} f={f} delay={30} angle={4} depth={6}>NOVIEMBRE</Type>
 <Type x={830} y={490} size={110} f={f} delay={49} color="#fffef8" angle={4} depth={6}>2026</Type>
 </AbsoluteFill>;
 return <AbsoluteFill><Paper f={f+722}/>
 <ConsoleProp name="ps5.webp" f={f-2} x={420} y={335} width={268} angle={-7}/>
 <ConsoleProp name="xbox.webp" f={f-37} x={850} y={370} width={270} angle={7}/>
 <Type x={420} y={576} size={50} f={f} delay={7} color="#fffef8" angle={-3}>PS5</Type>
 <Type x={850} y={576} size={42} f={f} delay={41} color="#fffef8" angle={3}>XBOX SERIES X|S</Type>
 </AbsoluteFill>;
}

const startsNew=[0,56,108,161,207,300,391];
function SceneNew({index}:{index:number}){
 const f=useCurrentFrame();
 if(index===0)return <AbsoluteFill><Film name="opening.mp4" f={f} zoom={1.06}/>
  <Img src={file('gta-logo.webp')} style={{position:'absolute',left:72,top:83,width:230,transform:'rotate(-7deg)',filter:'drop-shadow(6px 9px 5px #0009)'}}/>
  <Nico f={f} x={855} y={445} width={595}/>
  <Type x={730} y={129} size={77} f={f} delay={5} angle={-5} color="#fffef9">RÉCORD DE</Type>
  <Type x={765} y={256} size={155} f={f} delay={18} angle={-5} depth={8}>28 AÑOS</Type>
 </AbsoluteFill>;
 if(index===1)return <AbsoluteFill><Paper f={f+70}/>
  <Nico f={f} x={255} y={449} width={370} angle={-5} delay={3}/>
  <svg width="1280" height="720" style={{position:'absolute',inset:0}}>
   <path d="M450 515 C625 490 820 520 1120 490" fill="none" stroke="#211820" strokeWidth="8" strokeDasharray="670" strokeDashoffset={670*(1-ease(f/20))}/>
   <circle cx="538" cy="505" r={17*ease((f-3)/10)} fill={YELLOW} stroke={INK} strokeWidth="4"/>
   <circle cx="1056" cy="495" r={17*ease((f-18)/9)} fill={YELLOW} stroke={INK} strokeWidth="4"/>
   <path d="M405 310 Q455 260 530 280 M512 258 L534 282 L494 292" fill="none" stroke={INK} strokeWidth="5" strokeDasharray="210" strokeDashoffset={210*(1-ease((f-8)/15))}/>
  </svg>
  <Type x={755} y={140} size={84} f={f} delay={4} angle={-4} color="#fffefa">UN RÉCORD</Type>
  <Type x={814} y={284} size={158} f={f} delay={13} angle={-4}>28</Type>
  <Type x={817} y={392} size={75} f={f} delay={24} angle={-4} color="#fffefa">AÑOS</Type>
  <Type x={525} y={577} size={55} f={f} delay={8} angle={-3}>1998</Type>
  <Type x={1065} y={566} size={55} f={f} delay={29} angle={3}>2026</Type>
 </AbsoluteFill>;
 if(index===2)return <AbsoluteFill><Film name="lowrider.mp4" f={f} zoom={1.05}/>
  <Nico f={f} x={245} y={485} width={370} angle={-5}/>
  <Img src={file('gta-logo.webp')} style={{position:'absolute',left:655,top:317,width:485,transform:'translate(-50%,-50%) rotate(-5deg)',filter:'drop-shadow(14px 16px 7px #0009)'}}/>
  <Type x={800} y={142} size={81} f={f} delay={10} angle={4} color="#fffefa">ES GTA VI</Type>
 </AbsoluteFill>;
 if(index===3)return <AbsoluteFill><Film name="action.mp4" f={f} zoom={1.06} extended/>
  <Type x={644} y={180} size={100} f={f} delay={3} angle={-6} color="#fffefa">RESEÑAS</Type>
  <Type x={643} y={360} size={132} f={f} delay={12} angle={-5} depth={9}>HISTÓRICAS</Type>
  <Nico f={f} x={210} y={503} width={300} angle={-12} delay={8}/>
 </AbsoluteFill>;
 if(index===4)return <AbsoluteFill><Paper f={f+270}/>
  <Nico f={f} pose="question" x={330} y={435} width={450} angle={-6}/>
  <Type x={686} y={145} size={83} f={f} delay={5} angle={-6} color="#fffefa">PERO...</Type>
  <Type x={816} y={295} size={145} f={f} delay={24} angle={-7} depth={9}>HAY PEGAS</Type>
  <Type x={806} y={389} size={51} f={f} delay={44} angle={2} color="#fffefa">QUE NADIE CUENTA</Type>
  <Photo name="shock.mp4" f={f-53} x={915} y={535} width={300} ratio={384/368} angle={7}/>
 </AbsoluteFill>;
 if(index===5)return <AbsoluteFill><Paper f={f+422}/>
  <Type x={640} y={170} size={175} f={f} delay={5} angle={-4} depth={9}>ZINKO</Type>
  <Nico f={f} x={640} y={454} width={585} delay={9}/>
  <svg width="1280" height="720" style={{position:'absolute',inset:0,opacity:ease((f-30)/12)}}>
   <g stroke={INK} fill="none" strokeWidth="5" strokeLinecap="round">
    <path d="M156 160 Q240 90 305 177" strokeDasharray="350" strokeDashoffset={350*(1-ease((f-34)/15))}/>
    <circle cx="1075" cy="287" r="50" strokeDasharray="314" strokeDashoffset={314*(1-ease((f-50)/16))}/>
   </g>
  </svg>
 </AbsoluteFill>;
 return <AbsoluteFill><Paper f={f+530}/>
  <Photo name="success.mp4" f={f} x={375} y={388} width={420} ratio={480/398} angle={-7}/>
  <Photo name="shock.mp4" f={f-10} x={942} y={389} width={418} ratio={384/368} angle={7}/>
  <Nico f={f} pose="question" x={662} y={515} width={265} delay={2}/>
  <Type x={329} y={112} size={66} f={f} delay={4} angle={-5}>¿QUÉ AMAN?</Type>
  <Type x={956} y={112} size={61} f={f} delay={15} angle={5} color="#fffefa">¿QUÉ CRITICAN?</Type>
 </AbsoluteFill>;
}
const newCues:[number,number,string][]=[
[0,1.75,'Un juego acaba de igualar'],
[1.75,3.55,'un récord de veintiocho años'],
[3.6,4.8,'Es GTA seis'],
[4.8,6.92,'y las reseñas son históricas'],
[6.93,9.98,'Pero tiene pegas que casi nadie cuenta'],
[10.00,11.54,'Bienvenido a Zinko'],
[11.54,13.02,'el canal de la curiosidad'],
[13.02,15,'Hoy veremos qué aman y qué critican']
];
function CaptionsNew({frame}:{frame:number}){
 const t=frame/30,c=newCues.find(([a,b])=>t>=a&&t<b);
 if(!c)return null;
 const p=pop(frame-c[0]*30,0,17);
 return <div style={{position:'absolute',bottom:27,left:30,right:30,textAlign:'center',fontFamily:'CaptionLocal',fontWeight:900,whiteSpace:'nowrap',fontSize:c[2].length>35?51:c[2].length>25?56:64,color:YELLOW,WebkitTextStroke:'3.5px '+INK,paintOrder:'stroke fill',textShadow:'2px 5px 1px #09090a',transform:'translateY('+((1-p)*20)+'px) scale('+(.95+.05*p)+')'}}>{c[2]}</div>;
}
function LayerNew({index,style={}}:{index:number;style?:React.CSSProperties}){
 return <AbsoluteFill style={style}><Sequence from={startsNew[index]}><SceneNew index={index}/></Sequence></AbsoluteFill>;
}
function NewVideo(){
 const frame=useCurrentFrame();const [handle]=useState(()=>delayRender('Fonts'));
 useEffect(()=>{const fonts=[new FontFace('CaptionLocal','url('+file('Caption.ttf')+')'),new FontFace('ImpactLocal','url('+file('Impact.ttf')+')')];Promise.all(fonts.map(f=>f.load())).then(fs=>{fs.forEach(f=>document.fonts.add(f));continueRender(handle)}).catch(cancelRender)},[handle]);
 let index=0;startsNew.forEach((s,i)=>{if(frame>=s)index=i});
 const age=frame-startsNew[index],p=ease(age/8),transition=index>0&&age<9,peel=index===1||index===4;
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
  <div style={{position:'absolute',width:1280,height:720,transform:'scale(1.5)',transformOrigin:'top left',overflow:'hidden'}}>
   {transition&&!peel?
    <><LayerNew index={index-1}/><LayerNew index={index} style={{clipPath:'inset(0 '+((1-p)*100)+'% 0 0)'}}/></>:
    transition?
    <><LayerNew index={index}/><LayerNew index={index-1} style={{transform:'perspective(1400px) rotateY('+(-96*p)+'deg) translateX('+(-230*p)+'px)',transformOrigin:'0% 50%',opacity:1-clamp((p-.72)/.28)}}/></>:
    <LayerNew index={index}/>}
   <CaptionsNew frame={frame}/>
  </div>
 </AbsoluteFill>;
}
const NewRoot=()=> <Composition id="ZinkoFiel15s" component={NewVideo} durationInFrames={450} fps={30} width={1920} height={1080}/>;
registerRoot(NewRoot);
