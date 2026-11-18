import React from 'react';
import {AbsoluteFill,Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
type Props={format:'landscape'|'vertical'};
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
export const CinematicShowreel:React.FC<Props>=({format})=>{
 const f=useCurrentFrame(); const {width,height}=useVideoConfig(); const vertical=format==='vertical';
 const intro=interpolate(f,[0,24],[0,1],{...clamp,easing:Easing.out(Easing.cubic)});
 const y=interpolate(f,[20,48],[90,0],{...clamp,easing:Easing.out(Easing.back(1.3))});
 const opacity=interpolate(f,[20,38,116,140],[0,1,1,0],clamp);
 const sweep=interpolate(f,[0,90],[-width*.7,width*1.2],clamp);
 const outro=interpolate(f,[250,299],[1,0],clamp);
 const size=vertical?142:190;
 return <AbsoluteFill style={{backgroundColor:'#05070d',color:'#f5f7fb',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
 <AbsoluteFill style={{opacity:intro,background:'radial-gradient(ellipse at 50% 48%,#172b48 0%,#0a101d 44%,#05070d 80%)'}}/>
 <AbsoluteFill style={{opacity:.25,backgroundImage:'linear-gradient(rgba(130,180,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(130,180,255,.1) 1px,transparent 1px)',backgroundSize:vertical?'54px 54px':'72px 72px',transform:`perspective(700px) rotateX(58deg) scale(1.8) translateY(${f}px)`,transformOrigin:'center bottom'}}/>
 <div style={{position:'absolute',top:'26%',left:sweep,width:width*1.4,height:3,background:'linear-gradient(90deg,transparent,#54d8ff,#fff,transparent)',filter:'blur(1px)'}}/>
 <div style={{position:'absolute',width:vertical?420:760,height:vertical?420:760,border:'1px solid rgba(82,190,255,.25)',borderRadius:'50%',left:'50%',top:'48%',transform:`translate(-50%,-50%) rotate(${f*.25}deg) scale(${1+Math.sin(f/8)*.025})`,boxShadow:'0 0 90px rgba(30,150,255,.15),inset 0 0 80px rgba(30,150,255,.08)'}}/>
 <AbsoluteFill style={{justifyContent:'center',alignItems:'center',padding:vertical?60:100,opacity:opacity*outro,textAlign:'center'}}>
 <div style={{fontSize:vertical?20:24,fontWeight:800,letterSpacing:10,color:'#75dcff',marginBottom:34,opacity:intro}}>THE NEXT ERA STARTS NOW</div>
 <div style={{fontSize:size,lineHeight:.9,fontWeight:1000,letterSpacing:vertical?-7:-12,background:'linear-gradient(180deg,#fff 8%,#c7eaff 52%,#5eb9f3 100%)',WebkitBackgroundClip:'text',color:'transparent',textShadow:'0 12px 50px rgba(54,165,255,.2)',transform:`translateY(${y}px)`}}>{vertical?<>PLAY<br/>BEYOND.</>:'PLAY BEYOND.'}</div>
 <div style={{width:150,height:4,background:'linear-gradient(90deg,transparent,#5ce1ff,transparent)',marginTop:38}}/>
 <div style={{fontSize:vertical?18:22,letterSpacing:6,color:'rgba(235,245,255,.75)',marginTop:28,fontWeight:700}}>BUILT FOR THE MOMENT</div>
 </AbsoluteFill>
 <div style={{position:'absolute',left:60,right:60,bottom:55,display:'flex',justifyContent:'space-between',fontSize:14,letterSpacing:3,color:'#a8bdd3',opacity:.7}}><span>STUDIO / 001</span><span>FRAME YOUR WORLD</span><span>ORIGINAL CONCEPT</span></div>
 <AbsoluteFill style={{backgroundColor:'#020308',opacity:1-outro}}/>
 </AbsoluteFill>;
};
