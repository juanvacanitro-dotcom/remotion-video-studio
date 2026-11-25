import React, {useEffect, useState} from 'react';
import {AbsoluteFill, CanvasImage, cancelRender, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import type {Caption} from '@remotion/captions';
import cues from './captions.json';

export const Y='#ffeb1d', INK='#15121b', WHITE='#fffef8', GREEN='#4dde8d', ORANGE='#ff714a';
export const common=(name:string)=>staticFile(`zinko-proof/${name}`);
export const clamp=(x:number)=>Math.min(1,Math.max(0,x));
export const ease=(x:number)=>{x=clamp(x);return x*x*(3-2*x)};
export const depth=(n=8)=>Array.from({length:n},(_,i)=>`${i*.7+1}px ${i+2}px 0 ${INK}`).join(',');

export function useFonts(){
  const [handle]=useState(()=>delayRender('ZINKO original fonts'));
  useEffect(()=>{
    const faces=[new FontFace('ZinkoCaption',`url(${common('Caption.ttf')})`),new FontFace('ZinkoImpact',`url(${common('Impact.ttf')})`)];
    Promise.all(faces.map(f=>f.load())).then(fs=>{fs.forEach(f=>document.fonts.add(f));continueRender(handle)}).catch(cancelRender);
  },[handle]);
}
export function Paper(){
  const f=useCurrentFrame();
  return <AbsoluteFill style={{background:WHITE}}><CanvasImage src={common('paper.jpg')} style={{position:'absolute',inset:-30,width:1140,height:1980,objectFit:'cover',translate:`${4*Math.sin(f*.025)}px ${5*Math.cos(f*.019)}px`}}/></AbsoluteFill>;
}
export function Label({text,y,x=500,size=120,color=Y,angle=-4,delay=0,width=850,settled=false}:{text:string;y:number;x?:number;size?:number;color?:string;angle?:number;delay?:number;width?:number;settled?:boolean}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),f=frame-delay;
  if(f<0)return null;
  const s=spring({frame:f+(settled?14:0),fps,config:{mass:.72,damping:15,stiffness:190}});
  return <div data-safe-text style={{position:'absolute',left:x-width/2,top:y,width,textAlign:'center',fontFamily:'ZinkoImpact',fontSize:size,lineHeight:1.12,whiteSpace:'pre-line',color,WebkitTextStroke:`3px ${INK}`,paintOrder:'stroke fill',textShadow:depth(Math.min(12,Math.round(size/20)))+', 3px 15px 16px #0003',transform:`perspective(1200px) rotateY(${(1-s)*-24}deg) rotate(${angle+Math.sin(f*.04)*.6}deg) translateY(${(1-s)*40}px) scale(${.72+.28*s})`,opacity:clamp((f+(settled?4:0))/3)}}>{text}</div>;
}
export function Nico({pose='happy',x=500,y=980,width=480,delay=0,angle=0,settled=false}:{pose?:'happy'|'question';x?:number;y?:number;width?:number;delay?:number;angle?:number;settled?:boolean}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),f=frame-delay;
  if(f<0)return null;
  const p=spring({frame:f+(settled?13:0),fps,config:{mass:.8,stiffness:175,damping:14}});
  return <CanvasImage src={common(`nico-${pose}.webp`)} style={{position:'absolute',left:x-width/2,top:y,width,translate:`${4*Math.sin(f*.055)}px ${5*Math.sin(f*.075)}px`,rotate:`${angle+1.3*Math.sin(f*.052)}deg`,scale:Math.max(.01,p),filter:'drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 4px 0 white) drop-shadow(12px 17px 10px #0004)'}}/>;
}
export function Logo({x=500,y=220,width=330,angle=-5}:{x?:number;y?:number;width?:number;angle?:number}){
  const f=useCurrentFrame();
  return <CanvasImage src={common('gta-logo.webp')} style={{position:'absolute',left:x-width/2,top:y,width,rotate:`${angle+Math.sin(f*.035)*1.8}deg`,translate:`0px ${4*Math.sin(f*.055)}px`,filter:'drop-shadow(4px 4px 0 white) drop-shadow(12px 15px 11px #0006)'}}/>;
}
export function Footage({src,position='50% 50%',zoom=1.04,shade=.25}:{src:string;position?:string;zoom?:number;shade?:number}){
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  return <AbsoluteFill style={{overflow:'hidden',background:INK}}><Video src={staticFile(src)} muted premountFor={fps} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:position,scale:zoom+Math.min(f,180)*.0004}}/><AbsoluteFill style={{background:`linear-gradient(#15121b99,transparent 44%,rgba(21,18,27,${shade}) 67%,#15121bd9)`}}/></AbsoluteFill>;
}
export function CaptionLine({scene,y=1450}:{scene:keyof typeof cues;y?:number}){
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const cue=(cues[scene] as Caption[]).find(c=>f/fps*1000>=c.startMs&&f/fps*1000<c.endMs);
  if(!cue)return null;
  const age=f-cue.startMs/1000*fps;
  return <div data-caption style={{position:'absolute',left:90,top:y,width:800,fontFamily:'ZinkoCaption',fontSize:72,lineHeight:1.11,textAlign:'center',whiteSpace:'pre-line',color:Y,WebkitTextStroke:`5px ${INK}`,paintOrder:'stroke fill',textShadow:`2px 6px 0 ${INK}`,translate:`0px ${interpolate(age,[0,5],[12,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}px`}}>{cue.text}</div>;
}
export function Credit({children,light=false,y=1645}:{children:React.ReactNode;light?:boolean;y?:number}){
  return <div style={{position:'absolute',top:y,left:95,width:780,font:'24px Arial',color:light?'#fffef8':'#625a66',textShadow:light?'1px 2px 3px #000':undefined}}>{children}</div>;
}
export function Arrow({y=1180,color=INK}:{y?:number;color?:string}){
  const f=useCurrentFrame();
  return <svg width={1080} height={1920} style={{position:'absolute',inset:0}}><path d={`M150 ${y} Q75 ${y+130} 170 ${y+260} M132 ${y+244} L173 ${y+267} L186 ${y+224}`} stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="430" strokeDashoffset={430*(1-ease((f-20)/22))}/></svg>;
}
export function Swipe({paper=false}:{paper?:boolean}){
  const f=useCurrentFrame(),{durationInFrames}=useVideoConfig();
  const x=interpolate(f,[0,durationInFrames/2,durationInFrames-1],[-1500,0,1500]);
  return <div style={{position:'absolute',left:x-100,top:-140,width:1300,height:2200,rotate:'-11deg',background:paper?WHITE:Y,boxShadow:`20px 0 0 ${INK}`,clipPath:paper?'polygon(0 0,98% 0,100% 8%,97% 17%,100% 23%,97% 35%,100% 44%,98% 51%,100% 63%,97% 74%,100% 86%,97% 100%,0 100%)':undefined}}>{paper&&<Paper/>}</div>;
}
