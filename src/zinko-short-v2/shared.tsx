import React from 'react';
import {AbsoluteFill, CanvasImage, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import captions from './captions.json';
export {useFonts} from '../zinko-short/shared';

export const Y='#ffeb1d', INK='#15121b', W='#fffef8', ORANGE='#ff714a', GREEN='#4dde8d';
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const pop=(f:number)=>spring({frame:Math.max(0,f)+2,fps:30,config:{damping:12,stiffness:310,mass:.45}});
export const jolt=(f:number)=>f>=0&&f<12?Math.sin(f*2.2)*18*Math.exp(-f*.21):0;

export function Punch({children,top,size=145,color=Y,angle=-4,delay=0,left=70,width=870}:{children:React.ReactNode;top:number;size?:number;color?:string;angle?:number;delay?:number;left?:number;width?:number}){
 const f=useCurrentFrame()-delay;
 if(f<0)return null;
 return <div style={{position:'absolute',left,top,width,textAlign:'center',fontFamily:'ZinkoImpact',fontSize:size,lineHeight:1.03,color,whiteSpace:'pre-line',WebkitTextStroke:`${size>170?5:3}px ${INK}`,paintOrder:'stroke fill',textShadow:`3px 4px 0 ${INK},6px 8px 0 ${INK},10px 13px 0 ${INK}`,rotate:`${angle}deg`,scale:pop(f),translate:`${jolt(f)}px ${-Math.max(0,1-pop(f))*90}px`}}>{children}</div>;
}
export function Paper(){
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:W}}><CanvasImage src={staticFile('zinko-proof/paper.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',scale:1.03,translate:`${Math.sin(f/9)*3}px 0px`}}/></AbsoluteFill>;
}
export function Character({pose='question',x=500,y=850,width=490,delay=0,angle=0}:{pose?:'question'|'happy';x?:number;y?:number;width?:number;delay?:number;angle?:number}){
 const f=useCurrentFrame()-delay;
 if(f<0)return null;
 return <CanvasImage src={staticFile(`zinko-proof/nico-${pose}.webp`)} style={{position:'absolute',left:x-width/2,top:y,width,scale:pop(f),rotate:`${angle+Math.sin(f*.16)*2}deg`,translate:`${jolt(f)*.6}px ${Math.sin(f*.2)*5}px`,filter:'drop-shadow(6px 0 0 white) drop-shadow(-6px 0 0 white) drop-shadow(0 6px 0 white) drop-shadow(13px 17px 0 #15121b55)'}}/>;
}
export function FullVideo({src,trim=0,rate=1,shade=.22}:{src:string;trim?:number;rate?:number;shade?:number}){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 return <AbsoluteFill style={{overflow:'hidden',background:INK}}>
   <Video src={staticFile(src)} muted objectFit="cover" trimBefore={Math.round(trim*fps)} playbackRate={rate} premountFor={fps} style={{position:'absolute',width:1080,height:1920,scale:1.06+f*.0015,translate:`${jolt(f)}px 0px`}}/>
   <AbsoluteFill style={{background:`linear-gradient(#15121b55,transparent 42%,rgba(21,18,27,${shade}) 60%,#15121bcc)`}}/>
 </AbsoluteFill>;
}
export function Burst({x=520,y=900,color=Y,delay=0}:{x?:number;y?:number;color?:string;delay?:number}){
 const f=useCurrentFrame()-delay;
 if(f<0||f>17)return null;
 return <svg width={1080} height={1920} style={{position:'absolute',inset:0,opacity:1-clamp(f/17)}}>
   {Array.from({length:14},(_,i)=>{
     const a=i/14*Math.PI*2;
     const r=120+f*20;
     return <line key={i} x1={x+Math.cos(a)*r} y1={y+Math.sin(a)*r} x2={x+Math.cos(a)*(r+120)} y2={y+Math.sin(a)*(r+120)} stroke={color} strokeWidth={12-i%3*2}/>;
   })}
 </svg>;
}
export function SpeedLines(){
 const f=useCurrentFrame();
 return <svg width={1080} height={1920} style={{position:'absolute',inset:0,opacity:.65}}>
 {Array.from({length:16},(_,i)=><path key={i} d={`M${i%2?1050:20} ${80+i*115} l${i%2?-230:230} ${Math.sin(i)*50}`} stroke={i%3?W:Y} strokeWidth={3+i%4} strokeDasharray="130 100" strokeDashoffset={-f*25}/>)}</svg>;
}
export function Brand(){
 return <div style={{position:'absolute',left:78,top:145,font:'38px ZinkoImpact',color:Y,letterSpacing:4,textShadow:`2px 3px 0 ${INK}`,rotate:'-3deg'}}>ZINKO</div>;
}
export function Captions(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const c=captions.find(c=>f/fps*1000>=c.startMs&&f/fps*1000<c.endMs);
 if(!c)return null;
 return <div style={{position:'absolute',left:80,top:1430,width:850,font:'76px ZinkoCaption',lineHeight:1.08,textAlign:'center',whiteSpace:'pre-line',color:Y,WebkitTextStroke:`5px ${INK}`,paintOrder:'stroke fill',textShadow:`2px 7px 0 ${INK}`,translate:`0px ${interpolate(f-c.startMs/1000*fps,[0,3],[9,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}px`}}>{c.text}</div>;
}
export function TransitionMarks(){
 const f=useCurrentFrame();
 const edges=[72,96,138,186,204,274,310,384];
 const t=edges.find(e=>f>=e&&f<e+3);
 if(t===undefined)return null;
 return <AbsoluteFill style={{borderLeft:`${Math.max(0,3-(f-t))*45}px solid ${f%2?Y:W}`,borderRight:`${Math.max(0,3-(f-t))*20}px solid ${INK}`,pointerEvents:'none'}}/>;
}
