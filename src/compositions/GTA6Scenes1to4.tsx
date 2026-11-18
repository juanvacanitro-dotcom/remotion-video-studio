import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
const scenes = [
{image:'media/Sala-Gamer.jpg',audio:'media/1.mp3',eyebrow:'ZINKO PRESENTA',title:'EL JUEGO MÁS',accent:'ESPERADO',sub:'GTA VI  •  ¿ÉXITO O DECEPCIÓN?',caption:'13 AÑOS DE ESPERA',tone:'#ff4aa8'},
{image:'media/Nico.jpg',audio:'media/2.mp3',eyebrow:'BIENVENIDO A',title:'ZINKO',accent:'CURIOSIDAD',sub:'HOY RESPONDEMOS 2 PREGUNTAS',caption:'¿SERÁ UN ÉXITO?',tone:'#35e4dc'},
{image:'media/Ciudad-Neon.jpg',audio:'media/3.mp3',eyebrow:'EL NUEVO JUEGO DE',title:'ROCKSTAR',accent:'GAMES',sub:'PLAYSTATION 5  •  XBOX SERIES',caption:'LANZAMIENTO: 19 NOV 2026',tone:'#ffb347'},
{image:'media/Escenario-Datos.jpg',audio:'media/4.mp3',eyebrow:'TODO COMENZÓ CON',title:'GTA V',accent:'2013',sub:'MÁS DE 225 MILLONES DE COPIAS',caption:'UNO DE LOS MÁS VENDIDOS',tone:'#35e4dc'}
] as const;
const Scene:React.FC<{index:number}> = ({index}) => {
const f=useCurrentFrame(); const s=scenes[index];
const enter=interpolate(f,[0,24],[0,1],{extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
const zoom=interpolate(f,[0,300],[1.02,1.13],{extrapolateRight:'clamp'});
const y=interpolate(enter,[0,1],[55,0]);
return <AbsoluteFill style={{background:'#070914',overflow:'hidden'}}>
<Img src={staticFile(s.image)} style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale('+zoom+')',filter:'saturate(1.15) contrast(1.08)'}}/>
<AbsoluteFill style={{background:'linear-gradient(90deg,rgba(4,6,17,.88),rgba(4,6,17,.48) 55%,rgba(4,6,17,.12)),linear-gradient(0deg,rgba(4,6,17,.65),transparent 50%)'}}/>
<div style={{position:'absolute',top:65,left:90,right:90,display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{display:'flex',gap:12,alignItems:'center'}}><div style={{width:12,height:12,borderRadius:12,background:s.tone,boxShadow:'0 0 20px '+s.tone}}/><span style={{fontSize:23,fontWeight:900,letterSpacing:7,color:'white'}}>ZINKO</span></div><span style={{fontSize:15,fontWeight:800,letterSpacing:4,color:'#fff'}}>GTA VI / ESPECIAL</span></div>
<div style={{position:'absolute',left:105,top:'29%',width:1050,opacity:enter,transform:'translateY('+y+'px)'}}><div style={{fontSize:22,fontWeight:900,letterSpacing:7,color:s.tone}}>{s.eyebrow}</div><div style={{fontSize:91,fontWeight:1000,lineHeight:.98,letterSpacing:-3,color:'#fff',textShadow:'0 8px 30px #000,5px 5px 0 rgba(0,0,0,.5)',marginTop:20}}>{s.title}</div><div style={{fontSize:88,fontWeight:1000,letterSpacing:-2,color:s.tone,lineHeight:1,textShadow:'0 0 36px '+s.tone+'88,0 6px 20px #000'}}>{s.accent}</div><div style={{height:5,width:interpolate(f,[8,34],[0,660],{extrapolateRight:'clamp'}),background:'linear-gradient(90deg,'+s.tone+',#fff)',marginTop:22}}/><div style={{fontSize:25,fontWeight:800,letterSpacing:3,color:'#fff',marginTop:22}}>{s.sub}</div></div>
<div style={{position:'absolute',left:100,bottom:78,padding:'13px 22px',borderLeft:'5px solid '+s.tone,background:'rgba(3,5,14,.62)',color:'#fff',fontSize:18,fontWeight:900,letterSpacing:4}}>{s.caption}</div>
<div style={{position:'absolute',bottom:0,left:0,right:0,height:5,background:'rgba(255,255,255,.15)'}}><div style={{height:'100%',width:(f/300*100)+'%',background:s.tone,boxShadow:'0 0 20px '+s.tone}}/></div>
<div style={{position:'absolute',inset:20,border:'1px solid rgba(255,255,255,.12)',pointerEvents:'none'}}/>
</AbsoluteFill>; };
export const GTA6Scenes1to4:React.FC=()=> <AbsoluteFill style={{background:'#070914'}}>{scenes.map((s,i)=><Sequence key={i} from={i*300} durationInFrames={300}><Scene index={i}/><Audio src={staticFile(s.audio)}/></Sequence>)}</AbsoluteFill>;