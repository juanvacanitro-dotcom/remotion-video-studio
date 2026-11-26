import React from 'react';
import {AbsoluteFill, CanvasImage, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import {useFonts} from '../zinko-short/shared';
import edit from './fast-edit.json';
import captions from './fast-captions.json';

export const INK='#101026', TEAL='#43eddb', PINK='#ff5ca8', YELLOW='#ffeb1d', WHITE='#fffef8';
const clamp=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,v));

function Repair({scene}:{scene:1|2|3}){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const seg=edit.scenes[scene-1].segments.find(s=>f>=s.fromFrame&&f<s.fromFrame+s.frames);
 const t=seg?seg.sourceStart+(f-seg.fromFrame)/fps*seg.rate:10;
 return <>
  {scene===2&&t>=3.3&&t<6.9&&<>
   <div style={{position:'absolute',left:0,top:0,width:1920,height:296,background:`linear-gradient(${INK} 92%,${INK}00)`}}/>
   <div style={{position:'absolute',left:0,top:260,width:470,height:85,background:`linear-gradient(${INK} 78%,${INK}00)`}}/>
   <div style={{position:'absolute',left:110,top:56,width:1700,textAlign:'center',font:'150px ZinkoImpact',color:WHITE,rotate:'-1deg',textShadow:`5px 7px 0 ${INK}`}}>¿Y SI <span style={{color:'#ffae66'}}>ENTRARAS?</span></div>
  </>}
  {scene===3&&t<3.65&&<div style={{position:'absolute',left:0,top:0,width:660,height:158,background:INK,clipPath:'polygon(0 0,100% 0,97% 100%,0 100%)'}}>
   <div style={{position:'absolute',left:50,top:29,font:'65px ZinkoImpact',letterSpacing:6,color:TEAL}}>ZINKO</div>
  </div>}
 </>;
}

export function SpeedLines({power=1,color=WHITE}:{power?:number;color?:string}){
 const f=useCurrentFrame();
 return <svg width={1920} height={1080} style={{position:'absolute',inset:0,opacity:power}}>
  {Array.from({length:24},(_,i)=>{
   const a=i/24*Math.PI*2+.07;
   const r=510+((i*127+f*33)%420),len=80+(i%4)*45;
   return <path key={i} d={`M${960+Math.cos(a)*r*1.6} ${540+Math.sin(a)*r} l${Math.cos(a)*len*1.6} ${Math.sin(a)*len}`} stroke={i%3===0?TEAL:color} strokeWidth={i%4===0?8:3} opacity={.45+(i%3)*.14}/>;
  })}
 </svg>;
}

export function CaptionPunch({scene}:{scene:1|2|3}){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const cue=captions[String(scene) as keyof typeof captions].find(c=>f/fps*1000>=c.startMs&&f/fps*1000<c.endMs);
 if(!cue)return null;
 const age=f-cue.startMs/1000*fps;
 const pop=spring({frame:age+2,fps,config:{stiffness:420,damping:22,mass:.45}});
 const strong=/SUCCIONANDO|24 HORAS|SOBREVIVIR|GTA 6|AY, NO/.test(cue.text);
 return <div style={{position:'absolute',left:130,top:910,width:1660,textAlign:'center',font:'88px ZinkoCaption',lineHeight:1.05,color:YELLOW,WebkitTextStroke:`6px ${INK}`,paintOrder:'stroke fill',textShadow:`3px 7px 0 ${INK},0 8px 20px #0009`,scale:.91+.09*pop,rotate:strong?`${Math.sin(age*.16)*.6}deg`:'0deg',translate:`0px ${(1-pop)*18}px`}}>{cue.text}</div>;
}

type ShotProps={scene:1|2|3;start:number;zoom:number;endZoom?:number;cx?:number;cy?:number;tilt?:number;fx?:'none'|'shock'|'glitch'|'rush'};
export function Shot({scene,start,zoom,endZoom=zoom+.045,cx=960,cy=540,tilt=0,fx='none'}:ShotProps){
 useFonts();
 const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig();
 const f=frame-start;
 const p=clamp(f/Math.max(1,durationInFrames-1));
 const scale=zoom+(endZoom-zoom)*(1-Math.pow(1-p,2));
 const shake=fx==='shock'?Math.sin(f*2.1)*17*Math.exp(-f*.18):fx==='glitch'?Math.sin(f*1.7)*9*Math.exp(-f*.13):0;
 const x=clamp(960-cx*scale,1920-1920*scale,0)+shake;
 const y=clamp(540-cy*scale,1080-1080*scale,0);
 return <AbsoluteFill style={{background:INK,overflow:'hidden'}}>
  <div style={{position:'absolute',width:1920,height:1080,transformOrigin:'0 0',scale,translate:`${x}px ${y}px`,rotate:`${tilt*Math.exp(-f*.09)}deg`}}>
   <Video src={staticFile(`zinko-entrar/fast-0${scene}.mp4`)} muted premountFor={fps} objectFit="cover" style={{width:1920,height:1080}}/>
   <Repair scene={scene}/>
  </div>
  {(fx==='shock'||fx==='rush')&&<SpeedLines power={fx==='rush'?.65:Math.max(0,1-f/13)}/>}
  {fx==='glitch'&&f<10&&<>
   <div style={{position:'absolute',top:210+(f%3)*110,left:0,right:0,height:8,background:TEAL,opacity:.6}}/>
   <div style={{position:'absolute',top:630-(f%4)*60,left:30,right:0,height:4,background:PINK,opacity:.8}}/>
  </>}
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:210,background:'linear-gradient(transparent,#07081699)'}}/>
  <CaptionPunch scene={scene}/>
 </AbsoluteFill>;
}

export function Sticker({text,x=250,y=250,color=YELLOW,angle=-9,size=130}:{text:string;x?:number;y?:number;color?:string;angle?:number;size?:number}){
 useFonts(); const f=useCurrentFrame(),{fps}=useVideoConfig();
 const s=spring({frame:f+1,fps,config:{stiffness:350,damping:16,mass:.5}});
 return <div style={{position:'absolute',left:x,top:y,color,font:`${size}px ZinkoImpact`,lineHeight:1.03,whiteSpace:'pre-line',WebkitTextStroke:`5px ${INK}`,paintOrder:'stroke fill',textShadow:`7px 9px 0 ${INK},-3px -2px 0 ${WHITE}`,rotate:`${angle+Math.sin(f*.27)*1.2}deg`,scale:s,transformOrigin:'center',translate:`0px ${25*(1-s)}px`}}>{text}</div>;
}

export function GameLogo(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const s=spring({frame:f,fps,config:{stiffness:290,damping:15,mass:.5}});
 return <CanvasImage src={staticFile('zinko-proof/gta-logo.webp')} style={{position:'absolute',left:190,top:360,width:480,scale:s,rotate:`${-8+Math.sin(f*.13)*2}deg`,filter:'drop-shadow(5px 4px 0 white) drop-shadow(14px 16px 0 #101026)'}}/>;
}

export function ClockSlam(){
 useFonts();const f=useCurrentFrame(),{fps}=useVideoConfig();
 const s=spring({frame:f+1,fps,config:{stiffness:320,damping:19,mass:.5}});
 return <div style={{position:'absolute',left:135,top:280,width:570,height:390,background:YELLOW,color:INK,border:`8px solid ${INK}`,boxShadow:`13px 15px 0 ${PINK}`,rotate:`${-7+Math.sin(f*.1)}deg`,scale:s,textAlign:'center'}}>
  <div style={{font:'240px ZinkoImpact',lineHeight:1.1}}>24<span style={{fontSize:125}}>H</span></div>
  <div style={{font:'55px ZinkoImpact',letterSpacing:6}}>SOBREVIVE</div>
  <div style={{position:'absolute',left:24,bottom:16,height:9,width:500*(1-f/64),background:INK}}/>
 </div>;
}

export function RuleSlam({n,color=TEAL}:{n:number;color?:string}){
 useFonts();const f=useCurrentFrame(),{fps}=useVideoConfig();
 const p=spring({frame:f+1,fps,config:{stiffness:360,damping:18,mass:.5}});
 return <>
  <div style={{position:'absolute',left:n===2?1390:150,top:230,font:'390px ZinkoImpact',color,WebkitTextStroke:`7px ${INK}`,paintOrder:'stroke fill',textShadow:`12px 12px 0 ${WHITE}`,rotate:`${(n===2?8:-8)+(1-p)*24}deg`,scale:p,translate:`${(1-p)*(n===2?400:-400)}px 0px`}}>{n}</div>
  <SpeedLines power={Math.max(0,.65-f*.04)} color={color}/>
 </>;
}

export function WhipJoin({kind='slash'}:{kind?:'slash'|'portal'}){
 const f=useCurrentFrame(),{durationInFrames}=useVideoConfig();const p=f/(durationInFrames-1);
 if(kind==='portal'){
  const r=interpolate(p,[0,.45,1],[1250,0,1250]);
  return <svg width={1920} height={1080} style={{position:'absolute',inset:0}}><defs><mask id="fast-hole"><rect width="1920" height="1080" fill="white"/><circle cx="960" cy="540" r={r} fill="black"/></mask></defs><rect width="1920" height="1080" fill={INK} mask="url(#fast-hole)"/><circle cx="960" cy="540" r={r+7} fill="none" stroke={PINK} strokeWidth="24"/><circle cx="960" cy="540" r={r+30} fill="none" stroke={TEAL} strokeWidth="9"/></svg>;
 }
 const x=interpolate(p,[0,1],[-900,3000]);
 return <svg width={1920} height={1080} style={{position:'absolute',inset:0}}><path d={`M${x} -200 l620 0 -470 1480 -620 0Z`} fill={TEAL}/><path d={`M${x-40} -200 l40 0 -470 1480 -40 0Z`} fill={WHITE}/><path d={`M${x+620} -200 l95 0 -470 1480 -95 0Z`} fill={PINK}/></svg>;
}
