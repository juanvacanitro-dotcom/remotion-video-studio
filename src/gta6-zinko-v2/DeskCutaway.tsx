import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {mode:string; label:string; value:string; note:string; accent:string};

const WHITE = '#fffdf7';
const YELLOW = '#ffeb1d';
const PINK = '#ff3c91';
const TEAL = '#24f2dc';
const ORANGE = '#ff9b3d';

const Graphic:React.FC<{mode:string;accent:string;f:number;p:number}> = ({mode,accent,f,p}) => {
 const glow = 'drop-shadow(0 0 18px '+accent+'66)';
 if(mode==='trophy') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'translateY('+(1-p)*45+'px) rotate(-4deg)'}}>
  <path d="M245 95 L455 95 L430 250 Q350 320 270 250 Z" fill="#ffba5322" stroke={ORANGE} strokeWidth="12"/>
  <path d="M245 130 Q105 55 135 195 Q155 285 285 260 M455 130 Q595 55 565 195 Q545 285 415 260" fill="none" stroke={ORANGE} strokeWidth="14"/>
  <path d="M350 320 L350 380 M265 390 L435 390" stroke={WHITE} strokeWidth="13" strokeLinecap="round"/>
  <path d="M350 35 L365 70 L405 75 L375 100 L385 140 L350 118 L315 140 L325 100 L295 75 L335 70 Z" fill={YELLOW}/>
 </svg>;
 if(mode==='score') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'scale('+(0.9+.1*p)+')'}}>
  <circle cx="350" cy="230" r="160" fill="#090915" stroke="#ffffff33" strokeWidth="30"/>
  <circle cx="350" cy="230" r="160" fill="none" stroke={ORANGE} strokeWidth="30" strokeDasharray="1005" strokeDashoffset={1005*(1-.99*p)} strokeLinecap="round" transform="rotate(-90 350 230)"/>
  <text x="350" y="260" textAnchor="middle" fontFamily="ImpactLocal" fontSize="118" fill={WHITE}>99</text>
  <text x="350" y="312" textAnchor="middle" fontFamily="CaptionLocal" fontSize="28" fill={YELLOW}>/100</text>
 </svg>;
 if(mode==='map') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'rotate(-4deg) scale('+(0.92+.08*p)+')'}}>
  <rect x="55" y="42" width="590" height="385" rx="35" fill="#101528" stroke={TEAL} strokeWidth="8"/>
  <path d="M70 120 L630 330 M85 350 L590 75 M240 55 L300 415 M465 50 L400 420 M70 235 L630 220" stroke="#ffffff33" strokeWidth="17" fill="none"/>
  <path d="M105 345 Q220 270 310 290 T585 110" stroke={YELLOW} strokeWidth="9" fill="none" strokeDasharray="15 12"/>
  <circle cx="105" cy="345" r="19" fill={PINK}/><circle cx="585" cy="110" r="19" fill={TEAL}/>
  <circle cx={350+Math.sin(f/8)*35} cy={220+Math.cos(f/8)*25} r="14" fill={YELLOW}/>
 </svg>;
 if(mode==='controller') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'rotate(-7deg) scale('+(0.9+.1*p)+')'}}>
  <path d="M110 160 Q140 95 235 105 L465 105 Q560 95 590 160 L650 315 Q660 385 590 392 L520 395 Q475 390 435 315 L265 315 Q225 390 180 395 L110 392 Q40 385 50 315 Z" fill="#121322" stroke={WHITE} strokeWidth="13"/>
  <path d="M190 205 L190 285 M150 245 L230 245" stroke={TEAL} strokeWidth="18" strokeLinecap="round"/>
  <circle cx="500" cy="205" r="19" fill={PINK}/><circle cx="545" cy="245" r="19" fill={ORANGE}/>
  <circle cx="465" cy="275" r="16" fill={TEAL}/><circle cx="510" cy="310" r="16" fill={WHITE}/>
 </svg>;
 if(mode==='car') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'rotate(-5deg) scale('+(0.9+.1*p)+')'}}>
  <path d="M85 285 L145 210 Q170 170 245 165 L450 165 Q505 165 555 225 L625 280 L640 340 L65 340 Z" fill="#ff9b3d22" stroke={ORANGE} strokeWidth="12"/>
  <path d="M205 205 L250 135 L430 135 L495 215" stroke={WHITE} strokeWidth="9" fill="none"/>
  <circle cx="190" cy="345" r="54" fill="#0b0b15" stroke={WHITE} strokeWidth="12"/><circle cx="520" cy="345" r="54" fill="#0b0b15" stroke={WHITE} strokeWidth="12"/>
  <path d="M110 280 L590 280" stroke={ORANGE} strokeWidth="7" opacity=".8"/>
 </svg>;
 if(mode==='coins') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'rotate(-4deg) scale('+(0.92+.08*p)+')'}}>
  {[0,1,2].map((n)=><g key={n} transform={'translate('+(170+n*145)+' '+(300-n*35)+')'}>
   <ellipse cx="0" cy="0" rx="82" ry="27" fill="#ffce65" stroke={ORANGE} strokeWidth="8"/>
   <path d="M-82 0 L-82 55 Q0 100 82 55 L82 0" fill="#b97724" stroke={ORANGE} strokeWidth="8"/>
   <ellipse cx="0" cy="0" rx="82" ry="27" fill="#ffd978" stroke={ORANGE} strokeWidth="8"/>
   <text x="0" y="12" textAnchor="middle" fontFamily="ImpactLocal" fontSize="34" fill="#8a4b12">$</text>
  </g>)}
  <path d="M460 80 L610 80 L625 190 L475 190 Z" fill="#111323" stroke={TEAL} strokeWidth="8"/>
  <path d="M500 115 L585 115 M500 145 L565 145" stroke={WHITE} strokeWidth="7" strokeLinecap="round"/>
 </svg>;
 if(mode==='bars') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow}}>
  <path d="M75 390 L625 390" stroke={WHITE} strokeWidth="8"/>
  <rect x="150" y={390-210*p} width="150" height={210*p} rx="20" fill={ORANGE}/>
  <rect x="405" y={390-320*p} width="150" height={320*p} rx="20" fill={TEAL}/>
  <text x="225" y="355" textAnchor="middle" fontFamily="ImpactLocal" fontSize="55" fill={WHITE}>11M</text>
  <text x="480" y="315" textAnchor="middle" fontFamily="ImpactLocal" fontSize="55" fill={WHITE}>17M</text>
 </svg>;
 if(mode==='split') return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'rotate(-3deg)'}}>
  <rect x="55" y="85" width="275" height="300" rx="25" fill="#0b1720" stroke={TEAL} strokeWidth="9"/>
  <rect x="370" y="85" width="275" height="300" rx="25" fill="#1c0d19" stroke={PINK} strokeWidth="9"/>
  <path d="M115 220 L165 275 L270 165" stroke={TEAL} strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M435 180 L580 300 M580 180 L435 300" stroke={PINK} strokeWidth="18" strokeLinecap="round"/>
  <text x="192" y="340" textAnchor="middle" fontFamily="ImpactLocal" fontSize="34" fill={WHITE}>CRÍTICOS</text>
  <text x="508" y="340" textAnchor="middle" fontFamily="ImpactLocal" fontSize="34" fill={WHITE}>JUGADORES</text>
 </svg>;
 return <svg viewBox="0 0 700 470" width="700" height="470" style={{filter:glow,transform:'rotate(-4deg)'}}>
  <path d="M350 80 L350 365 M190 365 L510 365" stroke={WHITE} strokeWidth="12" strokeLinecap="round"/>
  <path d="M155 150 L545 150 M230 150 L160 270 L300 270 Z M470 150 L400 270 L540 270 Z" stroke={TEAL} strokeWidth="10" fill="none" strokeLinejoin="round"/>
  <circle cx="350" cy="75" r="25" fill={YELLOW}/>
  <path d="M210 305 L490 305" stroke={accent} strokeWidth="9" strokeDasharray="14 10"/>
 </svg>;
};

export const DeskCutaway:React.FC<Props> = ({mode,label,value,note,accent}) => {
 const f=useCurrentFrame();
 const {fps}=useVideoConfig();
 const p=spring({frame:f,fps,config:{mass:.72,damping:16,stiffness:165}});
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 40%,#28263c 0%,#080812 72%)',overflow:'hidden'}}>
  <div style={{position:'absolute',inset:0,opacity:.24,backgroundImage:'linear-gradient(#ffffff18 1px,transparent 1px),linear-gradient(90deg,#ffffff18 1px,transparent 1px)',backgroundSize:'72px 72px'}}/>
  <div style={{position:'absolute',left:130,top:115,width:1660,height:850,borderRadius:48,background:'linear-gradient(145deg,#302e43,#151421 70%)',border:'2px solid #ffffff33',boxShadow:'0 55px 90px #000b',transform:'perspective(1450px) rotateX(15deg) rotateZ(-1.5deg) translateY('+(1-p)*65+'px) scale('+(0.92+.08*p)+')'}}/>
  <div style={{position:'absolute',left:80,top:62,fontFamily:'ImpactLocal',fontSize:27,letterSpacing:5,color:accent,textShadow:'0 0 18px '+accent+'77',transform:'translateY('+(1-p)*-28+'px)'}}>{label}</div>
  <div style={{position:'absolute',left:165,top:210,transform:'translateY('+(1-p)*60+'px) rotate(-2deg) scale('+(0.88+.12*p)+')'}}>
   <Graphic mode={mode} accent={accent} f={f} p={p}/>
  </div>
  <div style={{position:'absolute',right:170,top:220,transform:'perspective(1200px) rotateY(-10deg) rotateZ(3deg) translateY('+(1-p)*70+'px) scale('+(0.84+.16*p)+')'}}>
   <div style={{width:470,height:590,borderRadius:36,background:'linear-gradient(145deg,#171728,#080812)',border:'7px solid #77768b',boxShadow:'0 30px 55px #000b',padding:25,boxSizing:'border-box'}}>
    <div style={{width:90,height:9,background:'#666579',borderRadius:20,margin:'0 auto 28px'}}/>
    <div style={{fontFamily:'ImpactLocal',fontSize:25,letterSpacing:3,color:accent}}>{label}</div>
    <div style={{fontFamily:'ImpactLocal',fontSize:54,lineHeight:1.02,color:WHITE,marginTop:24,textShadow:'0 4px 0 #100e15'}}>{value}</div>
    <div style={{height:10,background:'#ffffff22',borderRadius:20,marginTop:26,overflow:'hidden'}}>
     <div style={{height:'100%',width:(35+60*p)+'%',background:accent,boxShadow:'0 0 18px '+accent}}/>
    </div>
    <div style={{fontFamily:'CaptionLocal',fontSize:22,color:'#dedbe8',marginTop:26,lineHeight:1.25}}>{note}</div>
    <div style={{display:'flex',gap:10,marginTop:35}}>
     {[0,1,2,3].map((v)=><div key={v} style={{height:42,flex:1,borderRadius:10,background:v===1?accent:'#ffffff18',border:'1px solid #ffffff33'}}/>)}
    </div>
    <div style={{height:5,width:90,background:'#77768b',borderRadius:9,margin:'32px auto 0'}}/>
   </div>
  </div>
  <div style={{position:'absolute',left:210,bottom:86,fontFamily:'CaptionLocal',fontSize:18,letterSpacing:3,color:'#ffffff99'}}>ZINKO · VISUAL DATA</div>
  <div style={{position:'absolute',right:115,bottom:88,width:210,height:8,borderRadius:20,background:'#ffffff22',overflow:'hidden'}}>
   <div style={{height:'100%',width:(p*100)+'%',background:accent,boxShadow:'0 0 18px '+accent}}/>
  </div>
 </AbsoluteFill>;
};
