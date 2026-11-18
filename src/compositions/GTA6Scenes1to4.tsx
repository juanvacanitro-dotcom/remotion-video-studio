import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';

const durations=[338,312,306,337];
const starts=[0,338,650,956];
const colors={pink:'#ff4fa3',teal:'#43e6d2',orange:'#ff9b52',white:'#f8f6ff',ink:'#090b20'};
const ease=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
const Stickman:React.FC<{x?:number;y?:number;scale?:number;wave?:number}> = ({x=0,y=0,scale=1,wave=0}) => <g transform={'translate('+x+' '+y+') scale('+scale+')'} stroke={colors.white} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
 <circle cx="0" cy="-105" r="34" fill={colors.ink}/><path d="M-22 -125 Q0 -155 27 -125" stroke={colors.pink} strokeWidth="10"/><path d="M-38 -150 Q0 -170 38 -150 L32 -132 L-34 -132Z" fill={colors.pink}/>
 <path d="M-27 -70 Q0 -86 27 -70 L35 12 L-35 12Z" fill={colors.white} strokeWidth="6"/>
 <path d={'M-26 -57 L-65 '+(-15-wave*22)+' M26 -57 L65 '+(-12+wave*24)} />
 <path d="M-15 12 L-28 82 M15 12 L30 82"/>
 <path d="M-28 82 L-52 88 M30 82 L55 88"/>
 <path d="M-12 -108 Q0 -98 12 -108" strokeWidth="4"/><circle cx="-12" cy="-114" r="3" fill={colors.white}/><circle cx="12" cy="-114" r="3" fill={colors.white}/>
 <path d="M-48 -36 Q-62 -23 -54 -6 M48 -36 Q62 -23 54 -6" stroke={colors.teal} strokeWidth="5"/>
 </g>;
const Backdrop:React.FC<{city?:boolean}> = ({city=false}) => <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',inset:0}}>
 <defs><radialGradient id="glow"><stop stopColor="#29204f"/><stop offset="1" stopColor="#090b20"/></radialGradient></defs>
 <rect width="1920" height="1080" fill="url(#glow)"/>
 {Array.from({length:28},(_,i)=><circle key={i} cx={(i*271)%1920} cy={(i*137)%900} r={i%3===0?3:1.5} fill={i%2?colors.teal:colors.pink} opacity=".45"/>)}
 <path d="M0 875 Q480 840 960 875 T1920 875" stroke={colors.teal} opacity=".55" strokeWidth="3" fill="none"/>
 {city && <g stroke={colors.white} strokeWidth="5" fill="none" opacity=".8"><path d="M80 875V590H260V875 M300 875V500H480V875 M1400 875V540H1580V875 M1630 875V630H1850V875"/><path d="M110 640h120m-120 60h120m-120 60h120m120-200h120m-120 60h120m1320 0h130m-130 60h130"/></g>}
 <path d="M0 940H1920" stroke={colors.white} strokeWidth="5" opacity=".6"/>
 </svg>;
const Frame:React.FC<{scene:number}> = ({scene}) => {
 const f=useCurrentFrame(), d=durations[scene], p=f/d, pop=ease(f,0,20), drift=interpolate(f,[0,d],[0,34]);
 const pulse=1+Math.sin(f/9)*.025;
 const accent=[colors.pink,colors.teal,colors.orange,colors.teal][scene];
 return <AbsoluteFill style={{background:colors.ink,overflow:'hidden'}}>
 <Backdrop city={scene===2}/>
 <div style={{position:'absolute',inset:30,border:'2px solid rgba(255,255,255,.22)',transform:'scale('+pulse+')'}}/>
 <div style={{position:'absolute',top:54,left:78,fontSize:25,fontWeight:900,letterSpacing:9,color:colors.white}}>ZINKO <span style={{color:accent}}>●</span></div>
 {scene===0 && <>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
   <circle cx="960" cy="510" r={interpolate(f,[0,130,270],[80,360,470],{extrapolateRight:'clamp'})} stroke={colors.pink} strokeWidth="8" fill="none" opacity=".8"/>
   {Array.from({length:65},(_,i)=><circle key={i} cx={960+Math.cos(i*6.28/65)*interpolate(f,[40,150],[80,410],{extrapolateRight:'clamp'})} cy={510+Math.sin(i*6.28/65)*interpolate(f,[40,150],[80,410],{extrapolateRight:'clamp'})} r="4" fill={colors.white} opacity={ease(f,40,100)}/>)}
   <path d="M820 180 L960 80 L1100 180" stroke={colors.teal} strokeWidth="9" fill="none" strokeDasharray="18 14" strokeDashoffset={-f*3}/>
  </svg>
  <div style={{position:'absolute',left:210,top:265,transform:'translateY('+(1-pop)*65+'px)',opacity:pop,color:colors.white,fontSize:72,fontWeight:1000,lineHeight:1.02,textShadow:'7px 8px 0 #15142d'}}>EL JUEGO MÁS<br/><span style={{color:colors.pink}}>ESPERADO</span></div>
  <div style={{position:'absolute',right:370,bottom:150,transform:'translateY('+Math.sin(f/8)*12+'px)'}}><svg width="380" height="500" viewBox="-150 -230 300 420"><Stickman x={0} y={0} scale={1.45} wave={Math.sin(f/8)}/></svg></div>
  <div style={{position:'absolute',left:215,bottom:165,color:colors.teal,fontSize:34,fontWeight:900,letterSpacing:4}}>¿ÉXITO DE VERDAD?</div>
 </>}
 {scene===1 && <>
  <div style={{position:'absolute',left:230,top:235,fontSize:64,fontWeight:1000,color:colors.white}}>¡BIENVENIDO A</div>
  <div style={{position:'absolute',left:225,top:325,fontSize:120,fontWeight:1000,color:colors.teal,textShadow:'0 0 35px #43e6d277'}}>ZINKO!</div>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
   {[0,1].map(i=><g key={i} transform={'translate('+(1160+i*300)+' '+(330+i*40)+') scale('+ease(f,25+i*35,65+i*35)+')'}><circle r="100" stroke={i?colors.pink:colors.teal} strokeWidth="8" fill="#11142d"/><circle r="60" stroke={colors.white} strokeWidth="4" strokeDasharray="9 12" fill="none"/></g>)}
  </svg>
  <div style={{position:'absolute',left:730,bottom:105,transform:'translateY('+Math.sin(f/7)*10+'px)'}}><svg width="360" height="430" viewBox="-150 -230 300 420"><Stickman x={0} y={0} scale={1.3} wave={Math.sin(f/7)*1.5}/></svg></div>
  <div style={{position:'absolute',left:220,bottom:150,fontSize:30,fontWeight:900,color:colors.white}}>DOS PREGUNTAS. UNA GRAN EXPECTATIVA.</div>
 </>}
 {scene===2 && <>
  <div style={{position:'absolute',left:180,top:220,fontSize:56,fontWeight:1000,color:colors.white}}>UN NUEVO MUNDO</div>
  <div style={{position:'absolute',left:180,top:300,fontSize:104,fontWeight:1000,color:colors.orange}}>EN NOVIEMBRE</div>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
   <path d="M250 760 Q600 600 960 760 T1680 760" stroke={colors.teal} strokeWidth="7" fill="none" strokeDasharray="20 16" strokeDashoffset={-f*3}/>
   <rect x="760" y="500" width="190" height="120" rx="18" fill="#11142d" stroke={colors.white} strokeWidth="7" transform={'rotate(-4 850 560)'}/>
   <rect x="990" y="500" width="190" height="120" rx="18" fill="#11142d" stroke={colors.pink} strokeWidth="7" transform={'rotate(4 1080 560)'}/>
   <circle cx="960" cy="220" r={40+Math.sin(f/10)*10} fill={colors.orange} opacity=".9"/>
  </svg>
  <div style={{position:'absolute',right:300,bottom:100}}><svg width="300" height="380" viewBox="-150 -230 300 420"><Stickman x={0} y={0} scale={1.15} wave={Math.sin(f/10)}/></svg></div>
 </>}
 {scene===3 && <>
  <div style={{position:'absolute',left:180,top:225,fontSize:52,fontWeight:1000,color:colors.white}}>TODO COMENZÓ CON</div>
  <div style={{position:'absolute',left:180,top:300,fontSize:150,fontWeight:1000,color:colors.teal,textShadow:'8px 8px 0 #1b2540'}}>GTA V</div>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
   <rect x="350" y="570" width={interpolate(f,[0,250],[30,700],{extrapolateRight:'clamp'})} height="62" rx="12" fill={colors.orange}/>
   <path d="M350 670H1120" stroke={colors.white} strokeWidth="5" strokeDasharray="14 16" opacity=".7"/>
   <path d="M1110 535 l55 -55 l55 55" stroke={colors.teal} strokeWidth="12" fill="none" transform={'translate(0 '+Math.sin(f/9)*12+')'}/>
   <path d="M1280 520 l20 -55 l20 55 l55 20 l-55 20 l-20 55 l-20 -55 l-55 -20Z" fill={colors.pink} transform={'rotate('+f*1.5+' 1300 540)'}/>
  </svg>
  <div style={{position:'absolute',right:300,bottom:100}}><svg width="300" height="380" viewBox="-150 -230 300 420"><Stickman x={0} y={0} scale={1.15} wave={Math.sin(f/9)}/></svg></div>
 </>}
 <div style={{position:'absolute',left:75,right:75,bottom:45,height:5,background:'rgba(255,255,255,.2)'}}><div style={{height:5,width:(f/d*100)+'%',background:accent,boxShadow:'0 0 18px '+accent}}/></div>
 </AbsoluteFill>;
};
export const GTA6Scenes1to4:React.FC=()=> <AbsoluteFill style={{background:colors.ink}}>
 {durations.map((d,i)=><Sequence key={i} from={starts[i]} durationInFrames={d}><Frame scene={i}/><Audio src={staticFile('media/voice-'+(i+1)+'.wav')} volume={1}/></Sequence>)}
</AbsoluteFill>;
