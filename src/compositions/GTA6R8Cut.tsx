import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const CaptionBar:React.FC=()=> {
 const f=useCurrentFrame();
 const {width}=useVideoConfig();
 const enter=interpolate(f,[0,14],[0,1],clamp);
 const outro=interpolate(f,[760,804],[1,0],clamp);
 const scan=interpolate(f,[0,804],[-width,width],clamp);
 return <AbsoluteFill style={{pointerEvents:'none',fontFamily:'Arial,Helvetica,sans-serif',opacity:outro}}>
  <div style={{position:'absolute',inset:0,border:'18px solid rgba(7,8,18,.0)',boxShadow:'inset 0 0 90px rgba(0,0,0,.28)'}}/>
  <div style={{position:'absolute',left:70,right:70,top:48,display:'flex',alignItems:'center',justifyContent:'space-between',opacity:enter}}>
   <div style={{display:'flex',alignItems:'center',gap:14}}>
    <div style={{width:12,height:12,background:'#ffca37',borderRadius:'50%',boxShadow:'0 0 18px #ffca37'}}/>
    <span style={{fontSize:19,fontWeight:900,letterSpacing:5,color:'#fff',textShadow:'0 2px 10px #000'}}>ZINKO</span>
    <span style={{fontSize:14,fontWeight:800,letterSpacing:3,color:'#ffd43b'}}>ORIGINAL</span>
   </div>
   <span style={{fontSize:14,fontWeight:900,letterSpacing:3,color:'#fff',textShadow:'0 2px 10px #000'}}>GTA VI / ESPECIAL</span>
  </div>
  <div style={{position:'absolute',left:70,right:70,top:88,height:2,background:'linear-gradient(90deg,transparent,#ffd43b 20%,#ff4eae 70%,transparent)',opacity:.8}}/>
  <div style={{position:'absolute',left:70,bottom:65,display:'flex',alignItems:'center',gap:14,transform:`translateX(${interpolate(enter,[0,1],[ -50,0],clamp)}px)`,opacity:enter}}>
   <div style={{width:5,height:66,background:'linear-gradient(#ffd43b,#ff4eae)',boxShadow:'0 0 22px #ff4eae'}}/>
   <div>
    <div style={{fontSize:13,fontWeight:900,letterSpacing:4,color:'#ffd43b',textShadow:'0 2px 8px #000'}}>EL FENÓMENO</div>
    <div style={{fontSize:27,fontWeight:1000,letterSpacing:1,color:'#fff',textShadow:'0 3px 12px #000'}}>GRAND THEFT AUTO VI</div>
   </div>
  </div>
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:4,background:'rgba(255,255,255,.15)'}}>
   <div style={{height:'100%',width:`${Math.min(100,f/804*100)}%`,background:'linear-gradient(90deg,#ffd43b,#ff4eae,#39ddd8)',boxShadow:'0 0 18px #ff4eae'}}/>
  </div>
  <div style={{position:'absolute',top:0,bottom:0,width:5,left:scan,background:'linear-gradient(transparent,rgba(255,212,59,.8),transparent)',filter:'blur(1px)',opacity:.6}}/>
 </AbsoluteFill>;
};

export const GTA6R8Cut:React.FC=()=>{
 const f=useCurrentFrame();
 const intro=interpolate(f,[0,22],[0,1],clamp);
 const titleScale=interpolate(f,[0,18,48],[.82,1.04,1],{...clamp,easing:Easing.out(Easing.back(1.1))});
 const titleOut=interpolate(f,[80,105],[1,0],clamp);
 const flash=interpolate(f,[0,4,8],[0,.22,0],clamp);
 return <AbsoluteFill style={{background:'#080914',overflow:'hidden'}}>
  <OffthreadVideo src={staticFile('media/GTA6-R7-source.mp4')} muted={false} />
  <AbsoluteFill style={{background:'linear-gradient(110deg,rgba(5,7,18,.25),transparent 55%,rgba(5,7,18,.15))'}}/>
  <AbsoluteFill style={{background:'#080914',opacity:flash}}/>
  <AbsoluteFill style={{opacity:titleOut,justifyContent:'center',alignItems:'center'}}>
   <div style={{transform:`scale(${titleScale}) translateY(${interpolate(intro,[0,1],[35,0],clamp)}px)`,textAlign:'center',padding:'24px 48px',borderTop:'3px solid #ffd43b',borderBottom:'3px solid #ff4eae',background:'linear-gradient(90deg,transparent,rgba(7,9,24,.68),transparent)'}}>
    <div style={{fontSize:24,fontWeight:900,letterSpacing:12,color:'#ffd43b',textShadow:'0 3px 15px #000'}}>ZINKO PRESENTA</div>
    <div style={{fontSize:118,fontWeight:1000,letterSpacing:-7,color:'#fff',lineHeight:1.02,textShadow:'7px 8px 0 #10101b,0 0 38px rgba(57,221,216,.45)'}}>GTA <span style={{color:'#ffd43b'}}>VI</span></div>
    <div style={{fontSize:19,fontWeight:900,letterSpacing:8,color:'#ff4eae'}}>¿ÉXITO O DECEPCIÓN?</div>
   </div>
  </AbsoluteFill>
  <CaptionBar/>
 </AbsoluteFill>;
};
