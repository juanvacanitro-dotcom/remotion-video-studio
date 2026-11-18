import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Beat = {start:number; end:number; headline:string; accent:string; subtitle:string};
const beats: Beat[][] = [
 [
  {start:0,end:120,headline:'19 DE NOVIEMBRE',accent:'19',subtitle:'El juego más esperado de la década sale este diecinueve de noviembre.'},
  {start:120,end:210,headline:'MILLONES ESPERANDO',accent:'MILLONES',subtitle:'Millones de personas llevan años esperándolo.'},
  {start:210,end:300,headline:'¿ÉXITO O DECEPCIÓN?',accent:'DECEPCIÓN',subtitle:'Pero ¿será un éxito de verdad?'}
 ],
 [
  {start:0,end:120,headline:'BIENVENIDO',accent:'BIEN',subtitle:'Bienvenido a Zinko, el canal de la curiosidad.'},
  {start:120,end:210,headline:'2 PREGUNTAS',accent:'2',subtitle:'Hoy respondemos dos preguntas sobre GTA seis.'},
  {start:210,end:300,headline:'¿SUPERARÁ LO ESPERADO?',accent:'ESPERADO',subtitle:'¿Será un éxito y superará las expectativas?'}
 ],
 [
  {start:0,end:120,headline:'GTA 6',accent:'6',subtitle:'GTA seis es el nuevo juego de Rockstar Games.'},
  {start:120,end:210,headline:'19 · NOV · 2026',accent:'19',subtitle:'Sale el diecinueve de noviembre de dos mil veintiséis.'},
  {start:210,end:300,headline:'EN CONSOLAS',accent:'CONSOLAS',subtitle:'En PlayStation cinco y Xbox Series.'}
 ]
];

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const NeonLine:React.FC<{style?:React.CSSProperties}> = ({style}) => <div style={{height:3,background:'linear-gradient(90deg,transparent,#36e5e0,#ff4db8,transparent)',boxShadow:'0 0 20px #36e5e0',...style}}/>;

const Nico:React.FC<{frame:number; reaction:number}> = ({frame,reaction}) => {
 const bob=Math.sin(frame/8)*7;
 const tilt=Math.sin(frame/17)*3+(reaction===2?-5:reaction===1?3:0);
 const arm= Math.sin(frame/9)*12;
 return <div style={{position:'absolute',right:260,bottom:95,width:270,height:480,transform:`translateY(${bob}px) rotate(${tilt}deg)`,transformOrigin:'bottom center',filter:'drop-shadow(0 18px 26px rgba(0,0,0,.42))'}}>
  <div style={{position:'absolute',left:67,top:0,width:132,height:132,border:'8px solid #f7f3ff',borderRadius:'50%',background:'#17162b',boxShadow:'0 0 0 7px rgba(255,255,255,.08),0 0 34px rgba(61,225,220,.25)'}}/>
  <div style={{position:'absolute',left:75,top:-13,width:124,height:42,background:'#ff4eae',border:'6px solid #f7f3ff',borderRadius:'65% 65% 15% 15%',transform:'rotate(-8deg)'}}/>
  <div style={{position:'absolute',left:168,top:17,width:60,height:17,background:'#ff4eae',border:'5px solid #f7f3ff',borderRadius:'0 20px 20px 0',transform:'rotate(7deg)'}}/>
  <div style={{position:'absolute',left:52,top:35,width:34,height:70,border:'9px solid #39ddd8',borderRight:0,borderRadius:'28px 0 0 28px'}}/>
  <div style={{position:'absolute',left:183,top:35,width:34,height:70,border:'9px solid #39ddd8',borderLeft:0,borderRadius:'0 28px 28px 0'}}/>
  <div style={{position:'absolute',left:106,top:53,width:13,height:13,borderRadius:'50%',background:'#fff'}}/>
  <div style={{position:'absolute',left:155,top:53,width:13,height:13,borderRadius:'50%',background:'#fff'}}/>
  <div style={{position:'absolute',left:119,top:91,width:42,height:9,borderBottom:'5px solid #fff',borderRadius:'50%',transform:reaction===2?'rotate(-10deg)':'none'}}/>
  <div style={{position:'absolute',left:102,top:137,width:68,height:166,background:'#f7f3ff',borderRadius:'30px 30px 12px 12px',clipPath:'polygon(14% 0,86% 0,100% 100%,0 100%)'}}/>
  <div style={{position:'absolute',left:80,top:154,width:24,height:130,background:'#f7f3ff',borderRadius:20,transform:`rotate(${-24+arm}deg)`,transformOrigin:'top center'}}/>
  <div style={{position:'absolute',left:171,top:154,width:24,height:130,background:'#f7f3ff',borderRadius:20,transform:`rotate(${reaction===1? -55:22-arm}deg)`,transformOrigin:'top center'}}/>
  <div style={{position:'absolute',left:111,top:290,width:22,height:150,background:'#f7f3ff',borderRadius:20,transform:'rotate(4deg)'}}/>
  <div style={{position:'absolute',left:150,top:290,width:22,height:150,background:'#f7f3ff',borderRadius:20,transform:'rotate(-4deg)'}}/>
  <div style={{position:'absolute',left:94,top:425,width:65,height:20,background:'#ff4eae',borderRadius:18,transform:'rotate(-8deg)'}}/>
  <div style={{position:'absolute',left:143,top:425,width:65,height:20,background:'#39ddd8',borderRadius:18,transform:'rotate(8deg)'}}/>
 </div>;
};

const Room:React.FC<{frame:number; scene:number}> = ({frame,scene}) => {
 const tvGlow=.5+Math.sin(frame/7)*.15;
 return <AbsoluteFill>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 52% 48%,#24214a 0%,#111329 45%,#080a16 100%)'}}/>
  <div style={{position:'absolute',left:0,right:0,top:100,height:4,background:'linear-gradient(90deg,transparent,#ff4eae,#39ddd8,transparent)',opacity:.7}}/>
  <div style={{position:'absolute',left:160,top:150,width:1600,height:610,border:'2px solid rgba(255,255,255,.12)',borderRadius:30,background:'linear-gradient(135deg,rgba(255,255,255,.035),transparent)',boxShadow:'inset 0 0 70px rgba(65,215,220,.08)'}}/>
  <div style={{position:'absolute',left:580,top:235,width:760,height:430,border:'12px solid #f5f0ff',borderRadius:24,background:'linear-gradient(135deg,#15182e,#080b18)',boxShadow:`0 0 80px rgba(57,221,216,${tvGlow}),0 0 130px rgba(255,78,174,.16)`,transform:`perspective(900px) rotateY(${Math.sin(frame/40)*2}deg)`}}>
   <div style={{position:'absolute',inset:20,border:'2px solid rgba(57,221,216,.4)',borderRadius:10,background:'radial-gradient(circle at 50% 55%,rgba(57,221,216,.18),transparent 65%)'}}/>
  </div>
  <div style={{position:'absolute',left:480,top:680,width:960,height:70,background:'#24213d',border:'4px solid #eee8ff',borderRadius:24,boxShadow:'0 18px 35px #050610'}}/>
  <div style={{position:'absolute',left:840,top:650,width:220,height:38,background:'#111426',border:'3px solid #39ddd8',borderRadius:12,boxShadow:'0 0 25px rgba(57,221,216,.4)'}}/>
  <div style={{position:'absolute',left:180,top:710,width:440,height:140,background:'#25213f',border:'4px solid #f5f0ff',borderRadius:'45px 45px 15px 15px'}}/>
  <div style={{position:'absolute',left:150,top:220,width:18,height:470,background:'linear-gradient(#ff4eae,#39ddd8)',boxShadow:'0 0 35px #ff4eae',opacity:.65}}/>
  <div style={{position:'absolute',right:160,top:220,width:18,height:470,background:'linear-gradient(#39ddd8,#ff4eae)',boxShadow:'0 0 35px #39ddd8',opacity:.65}}/>
  <div style={{position:'absolute',bottom:0,left:0,right:0,height:170,background:'linear-gradient(transparent,rgba(2,3,12,.85))'}}/>
  {scene===0 && <div style={{position:'absolute',left:1450,top:190,width:190,height:190,border:'5px solid #ff9c52',borderRadius:'50%',boxShadow:'0 0 36px rgba(255,156,82,.35)',transform:`rotate(${frame*1.3}deg)`}}/>}
 </AbsoluteFill>;
};

const City:React.FC<{frame:number}> = ({frame}) => <AbsoluteFill>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#0b1027 0%,#191a3d 48%,#2c2142 72%,#080b18 100%)'}}/>
 <div style={{position:'absolute',width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,#ffad68,#ff6e7e 65%,transparent 70%)',left:1270,top:130,boxShadow:'0 0 110px rgba(255,100,125,.35)'}}/>
 {Array.from({length:13},(_,i)=><div key={i} style={{position:'absolute',bottom:250,left:i*155-30,width:120+(i%3)*24,height:180+(i%4)*70,background:'#11162d',border:'2px solid rgba(255,255,255,.18)',boxShadow:'0 0 20px rgba(57,221,216,.08)'}}><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,padding:15}}>{Array.from({length:9},(_,j)=><div key={j} style={{height:15,background:j%2?'rgba(255,78,174,.5)':'rgba(57,221,216,.5)'}}/>)}</div></div>)}
 <div style={{position:'absolute',bottom:0,left:0,right:0,height:250,background:'repeating-linear-gradient(90deg,#11162c 0 90px,#1a1d37 90px 94px)',transform:`perspective(500px) rotateX(58deg) translateY(${Math.sin(frame/12)*7}px)`,transformOrigin:'bottom'}}/>
 <div style={{position:'absolute',left:300,bottom:210,width:18,height:440,background:'#f4efff',transform:'rotate(7deg)',borderRadius:20}}/>
 <div style={{position:'absolute',left:200,bottom:580,width:240,height:22,borderTop:'12px solid #39ddd8',borderRadius:'50%',transform:'rotate(-22deg)'}}/>
 <div style={{position:'absolute',left:230,bottom:600,width:230,height:22,borderTop:'12px solid #39ddd8',borderRadius:'50%',transform:'rotate(20deg)'}}/>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(7,9,22,.45),transparent 30%,transparent 70%,rgba(7,9,22,.35))'}}/>
 </AbsoluteFill>;

export const GTA6R8Intro:React.FC=()=>{
 const frame=useCurrentFrame(); const {fps,width,height}=useVideoConfig();
 const scene=Math.min(2,Math.floor(frame/300)); const local=frame-scene*300;
 const list=beats[scene]; const beat=list.find(b=>local>=b.start&&local<b.end)??list[list.length-1];
 const beatProgress=local-beat.start;
 const enter=spring({frame:beatProgress, fps, config:{damping:15,stiffness:130,mass:.7}});
 const headlineOpacity=interpolate(beatProgress,[0,10,beat.end-beat.start-8,beat.end-beat.start],[0,1,1,0],clamp);
 const scale=interpolate(beatProgress,[0,18],[.72,1],{...clamp,easing:Easing.out(Easing.back(1.25))});
 const sceneIntro=interpolate(local,[0,20],[0,1],clamp);
 const sceneOutro=interpolate(local,[278,299],[1,0],clamp);
 const transition=scene===0?interpolate(frame,[280,299],[0,1],clamp):scene===1?interpolate(local,[0,18],[1,0],clamp):interpolate(local,[0,18],[1,0],clamp);
 const captionY=interpolate(enter,[0,1],[40,0],clamp);
 const phrase=beat.headline.split(' ');
 return <AbsoluteFill style={{backgroundColor:'#080a17',overflow:'hidden',fontFamily:'Arial,Helvetica,sans-serif'}}>
  {scene<2?<Room frame={frame} scene={scene}/>:<City frame={frame}/>}
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(4,5,16,.12),transparent 30%,transparent 65%,rgba(4,5,16,.55))'}}/>
  <div style={{position:'absolute',top:62,left:80,right:80,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:18,fontWeight:900,letterSpacing:7,color:'#c9d7f1',opacity:.8}}>
   <span>ZINKO / ORIGINAL</span><span>GTA VI · SPECIAL</span><span>R8 / 001</span>
  </div>
  <NeonLine style={{position:'absolute',top:115,left:80,right:80,opacity:.7}}/>
  {scene===0&&<div style={{position:'absolute',left:300,top:205,width:230,height:230,border:'5px solid rgba(255,156,82,.9)',borderRadius:'50%',boxShadow:'0 0 45px rgba(255,156,82,.3)',transform:`rotate(${frame*.7}deg)`}}>{Array.from({length:12},(_,i)=><div key={i} style={{position:'absolute',left:'50%',top:0,width:4,height:16,background:'#ff9c52',transformOrigin:'50% 115px',transform:`rotate(${i*30}deg)`}}/>)}</div>}
  {scene===1&&<div style={{position:'absolute',left:360,top:230,width:200,height:140,border:'4px solid #39ddd8',borderRadius:'45% 45% 40% 40%',boxShadow:'0 0 35px rgba(57,221,216,.25)',transform:`translateY(${Math.sin(frame/9)*8}px)`}}/>}
  {scene===2&&<div style={{position:'absolute',right:370,top:260,display:'flex',gap:40}}>{[0,1].map(i=><div key={i} style={{width:150,height:78,border:'5px solid #f5f0ff',borderRadius:24,background:'#11162c',boxShadow:`0 0 30px ${i?'rgba(57,221,216,.35)':'rgba(255,78,174,.35)'}`,transform:`translateY(${Math.sin(frame/10+i)*7}px)`}}/>)}</div>}
  <Nico frame={frame} reaction={beatProgress<100?0:scene===0?2:1}/>
  <div style={{position:'absolute',left:100,top:height*.27,width:width*.73,opacity:headlineOpacity,transform:`translateY(${captionY}px) scale(${scale}) rotate(-1deg)`,transformOrigin:'left center'}}>
   <div style={{display:'flex',flexWrap:'wrap',gap:'0 24px',alignItems:'center',maxWidth:1350}}>
    {phrase.map((word,i)=><span key={i} style={{fontSize:phrase.length>2?104:138,fontWeight:1000,letterSpacing:-5,lineHeight:.98,color:word.replace(/[¿?·]/g,'')===beat.accent.replace(/[¿?·]/g,'')?'#ffca55':'#fff',textShadow:'0 6px 0 #10101c,0 12px 35px rgba(0,0,0,.65),0 0 28px rgba(57,221,216,.25)',transform:`translateY(${interpolate(beatProgress,[i*4,i*4+12],[55,0],clamp)}px) rotate(${i%2?-2:1}deg)`}}>{word}</span>)}
   </div>
  </div>
  <div style={{position:'absolute',left:100,right:100,bottom:74,display:'flex',justifyContent:'center',opacity:interpolate(beatProgress,[0,8],[0,1],clamp),transform:`translateY(${interpolate(beatProgress,[0,10],[30,0],clamp)}px)`}}>
   <div style={{fontSize:35,fontWeight:900,color:'#ffd34e',textAlign:'center',lineHeight:1.16,letterSpacing:.3,textShadow:'3px 4px 0 #080914,-2px -2px 0 #080914,2px -2px 0 #080914,-2px 2px 0 #080914,0 8px 20px rgba(0,0,0,.8)',maxWidth:1580}}>{beat.subtitle}</div>
  </div>
  <div style={{position:'absolute',left:80,right:80,bottom:32,height:5,background:'rgba(255,255,255,.15)',borderRadius:10,overflow:'hidden'}}><div style={{height:'100%',width:`${(frame/900)*100}%`,background:'linear-gradient(90deg,#ff4eae,#39ddd8,#ff9c52)',boxShadow:'0 0 18px #39ddd8'}}/></div>
  <AbsoluteFill style={{background:'linear-gradient(90deg,#39ddd8,#ff4eae)',opacity:transition*.75,transform:`translateX(${interpolate(transition,[0,1],[-width,width],clamp)}px) skewX(-18deg)`,width:'28%',left:'36%'}}/>
  <AbsoluteFill style={{backgroundColor:'#070916',opacity:1-sceneIntro}}/>
  <AbsoluteFill style={{backgroundColor:'#070916',opacity:1-sceneOutro}}/>
 </AbsoluteFill>;
};
