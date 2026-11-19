import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Img, OffthreadVideo, Sequence, cancelRender, continueRender, delayRender, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';

const FPS=30, YELLOW='#ffeb1d', INK='#100e15';
const file=(name:string)=>staticFile(`zinko-proof/${name}`);
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
function Film({name,f,zoom=1}:{name:string;f:number;zoom?:number}){
 return <AbsoluteFill style={{overflow:'hidden'}}><OffthreadVideo src={file(name)} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${zoom+.0003*f}) translateX(${3*Math.sin(f*.04)}px)`,filter:'saturate(1.06)'}}/><AbsoluteFill style={{background:'linear-gradient(transparent 58%, #09091c44)'}}/><div style={{position:'absolute',bottom:12,left:20,font:'12px sans-serif',color:'#ddd',textShadow:'0 1px 2px black'}}>Imágenes del juego: Rockstar Games</div></AbsoluteFill>
}
function Calendar({f}:{f:number}){
 const p=pop(f,3,13),flip=pop(f,20,15);
 return <div style={{position:'absolute',left:806+10*Math.sin(f*.04),top:327,width:395,height:438,transform:`translate(-50%,-50%) perspective(1300px) translateY(${(1-ease(f/12))*90}px) rotateX(${(1-p)*-65}deg) rotateY(${(1-p)*25+4*Math.sin(f*.045)}deg) rotateZ(${-5+2*Math.sin(f*.05)}deg) scale(${.6+.4*p})`,filter:'drop-shadow(12px 20px 9px #0003)',transformStyle:'preserve-3d'}}>
 {[2,1].map(i=><div key={i} style={{position:'absolute',inset:0,background:i===2?'#deddd5':'#f0efe8',border:`2px solid ${INK}`,transform:`translate(${i*7}px,${i*6}px) rotate(${i*1.5}deg)`}}/>)}
 <div style={{position:'absolute',inset:0,background:'#fffef6',border:`3px solid ${INK}`,clipPath:'polygon(0 0,100% 0,100% 96%,96% 98%,91% 96%,86% 99%,81% 97%,76% 100%,71% 98%,66% 100%,61% 97%,56% 99%,51% 97%,46% 99%,41% 97%,36% 100%,31% 98%,26% 100%,21% 97%,16% 99%,11% 97%,6% 100%,0 97%)'}}>
 <div style={{background:YELLOW,height:86,display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'ImpactLocal',fontSize:43,color:INK}}>NOVIEMBRE</div>
 <div style={{position:'absolute',top:80,left:0,right:0,textAlign:'center',fontFamily:'ImpactLocal',fontSize:210,lineHeight:1.22,color:INK,transform:`perspective(800px) rotateX(${(1-flip)*-74}deg) scale(${.82+.18*flip})`,transformOrigin:'50% 0%'}}>19</div>
 <div style={{position:'absolute',bottom:35,left:0,right:0,textAlign:'center',fontFamily:'ImpactLocal',fontSize:50,color:INK}}>2026</div></div>
 {[85,300].map(x=><div key={x} style={{position:'absolute',top:-11,left:x,width:14,height:28,borderRadius:9,background:INK}}/>)}
 </div>
}
const cues:[number,number,string][]=[[.05,1.48,'El juego más esperado'],[1.48,1.97,'de la década'],[1.97,2.57,'sale este'],[2.57,4.03,'19 de noviembre'],[4.20,5.30,'Millones de personas'],[5.30,7.02,'llevan años esperándolo']];
function Captions({frame}:{frame:number}){
 const t=frame/FPS,c=cues.find(([s,e])=>t>=s&&t<e);if(!c)return null;
 const p=pop(frame-c[0]*FPS,0,17);
 return <div style={{position:'absolute',left:0,right:0,bottom:28,textAlign:'center',fontFamily:'CaptionLocal',fontSize:65,color:YELLOW,WebkitTextStroke:`4px ${INK}`,paintOrder:'stroke fill',textShadow:`2px 5px 0 ${INK}`,transform:`translateY(${(1-p)*16}px) scale(${.95+.05*p})`,whiteSpace:'nowrap'}}>{c[2]}</div>
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
 return <AbsoluteFill><Paper f={f+200}/><Nico f={f} pose="question" x={353} y={416} width={380} delay={2} angle={-2}/>
 <Type x={164} y={218} size={136} f={f} delay={6} angle={-17}>?</Type>
 <div style={{position:'absolute',inset:0,transform:`translate(${4*Math.sin(f*.07)}px,${3*Math.sin(f*.09)}px)`}}>
 <Type x={862} y={242} size={65} f={f} delay={3} angle={-6} color="#fffef8">¿SERÁ UN</Type>
 <Type x={840} y={367} size={155} f={f} delay={13} angle={-6} depth={9}>ÉXITO</Type>
 <Type x={840} y={521} size={76} f={f} delay={33} angle={-6} color="#fffef8" depth={5}>DE VERDAD?</Type>
 </div></AbsoluteFill>;
}
const starts=[0,57,124,214];
function Layer({index,style={}}:{index:number;style?:React.CSSProperties}){return <AbsoluteFill style={style}><Sequence from={starts[index]}><Scene index={index}/></Sequence></AbsoluteFill>}
function jagged(p:number){const x=-75+1430*p,pts=['0px 0px'];for(let y=0;y<=720;y+=20)pts.push(`${x+14*Math.sin(y*.19)+8*Math.cos(y*.47)}px ${y}px`);pts.push('0px 720px');return `polygon(${pts.join(',')})`}
function Video(){
 const frame=useCurrentFrame();const [handle]=useState(()=>delayRender('Local fonts'));
 useEffect(()=>{const fonts=[new FontFace('CaptionLocal',`url(${file('Caption.ttf')})`),new FontFace('ImpactLocal',`url(${file('Impact.ttf')})`)];Promise.all(fonts.map(f=>f.load())).then(f=>{f.forEach(a=>document.fonts.add(a));continueRender(handle)}).catch(cancelRender)},[handle]);
 let index=0;starts.forEach((s,i)=>{if(frame>=s)index=i});
 const age=frame-starts[index],transition=index>0&&age<8,p=ease(age/7);
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}><div style={{position:'absolute',width:1280,height:720,transform:'scale(1.5)',transformOrigin:'top left',overflow:'hidden'}}>
 {transition&&index!==2?<><Layer index={index-1}/><Layer index={index} style={{clipPath:jagged(p)}}/></>:transition?<><Layer index={index}/><Layer index={index-1} style={{transform:`perspective(1800px) rotateY(${-96*p}deg) translateX(${-240*p}px)`,transformOrigin:'0% 50%',opacity:1-clamp((p-.7)/.3),filter:'drop-shadow(16px 8px 12px #0005)'}}/></>:<Layer index={index}/>}
 <Captions frame={frame}/></div><Audio src={file('audio.m4a')}/></AbsoluteFill>
}
const Root=()=> <Composition id="ZinkoRemotionProof" component={Video} durationInFrames={279} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
