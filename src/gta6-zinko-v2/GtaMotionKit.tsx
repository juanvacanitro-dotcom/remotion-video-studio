import React from 'react';
import {Img, spring, staticFile} from 'remotion';

const INK = '#100e15';
const WHITE = '#fffdf7';
const YELLOW = '#ffeb1d';
const PINK = '#ff3c91';
const TEAL = '#24f2dc';
const ORANGE = '#ff9b3d';

const clamp01 = (n:number) => Math.max(0,Math.min(1,n));

export function punchMotion(frame:number,startFrame:number){
  const t=frame-startFrame;
  if(t<0||t>34) return {scale:1,shake:0};
  const hit=Math.exp(-Math.max(0,t-3)/8);
  const approach=clamp01(t/5);
  return {scale:1+0.105*approach*hit,shake:t<9?Math.sin(t*2.8)*5*hit:0};
}

export const KineticCaption:React.FC<{text:string;emphasis?:string;accent?:string;frame:number;startFrame:number}> = ({text,emphasis,accent=YELLOW,frame,startFrame})=>{
  const tokens=[...text.matchAll(/\S+/g)];
  const lower=text.toLowerCase();
  const hiStart=emphasis?lower.indexOf(emphasis.toLowerCase()):-1;
  const hiEnd=hiStart>=0?hiStart+emphasis!.length:-1;
  let cursor=0;
  return <div style={{position:'absolute',left:105,right:105,bottom:42,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:1660,display:'flex',justifyContent:'center',alignItems:'center',flexWrap:'wrap',columnGap:13,rowGap:2,textAlign:'center',fontFamily:'CaptionLocal',fontSize:49,lineHeight:1.12,fontWeight:900,color:YELLOW,WebkitTextStroke:'3px '+INK,paintOrder:'stroke fill',textShadow:'2px 5px 0 '+INK+',0 8px 18px #0009'}}>
      {tokens.map((m,i)=>{
        const word=m[0];
        const start=m.index??cursor;
        const end=start+word.length;
        cursor=end;
        const hot=hiStart>=0&&start<hiEnd&&end>hiStart;
        const local=frame-startFrame-i*3;
        const p=spring({frame:Math.max(0,local),fps:30,config:{mass:.55,damping:12,stiffness:210}});
        const visible=local>=0;
        return <span key={i} style={{display:'inline-block',whiteSpace:'pre',opacity:visible?1:0,transform:'translateY('+(visible?(1-p)*22:22)+'px) scale('+(visible ? .88+.12*p : .88)+') rotateX('+(visible?(1-p)*18:18)+'deg)',transformOrigin:'50% 100%',color:hot?WHITE:accent,textShadow:hot?'0 0 16px '+accent+',2px 5px 0 '+INK+',0 8px 18px #0009':'2px 5px 0 '+INK+',0 8px 18px #0009'}}>{word}</span>;
      })}
    </div>
  </div>;
};

export const ImpactTransition:React.FC<{index:number;frame:number}> = ({index,frame})=>{
  if(index===0||frame>=14) return null;
  const p=clamp01(frame/14);
  const variant=index%4;
  const opacity=1-p;
  return <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',opacity}}>
    {variant===0&&<>
      <div style={{position:'absolute',top:0,bottom:0,left:-700+ p*2800,width:540,transform:'skewX(-22deg)',background:'linear-gradient(90deg,transparent,rgba(36,242,220,.18),#fff,rgba(255,60,145,.85),transparent)',filter:'blur(3px)',boxShadow:'0 0 65px '+TEAL}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 35%,rgba(255,255,255,.28) 50%,transparent 65%)'}}/>
    </>}
    {variant===1&&<>
      <div style={{position:'absolute',inset:0,background:WHITE,opacity:Math.max(0,1-frame/3)*.65}}/>
      {[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:-200+i*430+p*220,top:0,width:95,height:'100%',transform:'skewX(-18deg)',background:i%2?PINK:TEAL,opacity:.7}}/>)}
    </>}
    {variant===2&&<>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%,transparent '+(p*80)+'%,rgba(255,155,61,.75) '+(p*80+2)+'%,transparent '+(p*100+18)+'%)'}}/>
      <div style={{position:'absolute',left:'50%',top:'50%',width:180+p*1900,height:180+p*1900,border:'8px solid '+ORANGE,borderRadius:'50%',transform:'translate(-50%,-50%)',boxShadow:'0 0 40px '+ORANGE}}/>
    </>}
    {variant===3&&<>
      {[0,1,2,3,4,5,6].map(i=><div key={i} style={{position:'absolute',left:0,top:110+i*125,width:'100%',height:18,background:i%2?TEAL:PINK,transform:'translateX('+(i%2?1:-1)*(1-p)*620+'px)',opacity:.65}}/>)}
      <div style={{position:'absolute',inset:0,background:WHITE,opacity:Math.max(0,1-frame/2)*.5}}/>
    </>}
  </div>;
};

export const AvatarSticker:React.FC<{index:number;frame:number}> = ({index,frame})=>{
  const beats:Record<number,{delay:number;label:string;question?:boolean}> = {
    0:{delay:10,label:'ZINKO PRESENTA'},
    1:{delay:18,label:'VAMOS AL GRANO'},
    9:{delay:12,label:'AHORA, LAS PEGAS',question:true},
    16:{delay:18,label:'MI VEREDICTO'},
    17:{delay:10,label:'¿Y TÚ QUÉ OPINAS?'}
  };
  const beat=beats[index];
  if(!beat) return null;
  const local=frame-beat.delay;
  if(local<0||local>92) return null;
  const enter=spring({frame:Math.max(0,local),fps:30,config:{mass:.7,damping:12,stiffness:150}});
  const leave=clamp01((92-local)/12);
  const p=enter*leave;
  const src=staticFile(beat.question?'zinko-proof/nico-question.webp':'zinko-proof/nico-happy.webp');
  return <div style={{position:'absolute',left:28,bottom:118,width:300,opacity:p,transform:'translateX('+((1-enter)*-150)+'px) translateY('+(Math.sin(frame*.12)*4)+'px) scale('+(0.78+.22*enter)+')',transformOrigin:'bottom left',filter:'drop-shadow(0 18px 24px #000b)',pointerEvents:'none'}}>
    <Img src={src} style={{width:'100%',height:'auto',objectFit:'contain'}}/>
    <div style={{position:'absolute',left:105,bottom:28,padding:'9px 16px',background:beat.question?PINK:TEAL,color:INK,fontFamily:'ImpactLocal',fontSize:19,letterSpacing:1.4,whiteSpace:'nowrap',borderRadius:5,transform:'rotate(-4deg)',boxShadow:'0 7px 18px #0009'}}>{beat.label}</div>
  </div>;
};


const glyphs:Record<string,string> = {
 hook:'99',welcome:'ZINKO',score:'99',timeline:'28',ranking:'IV · V · VI',world:'WORLD',duo:'02',
 hours:'60H',reviews:'100',fps:'30',performance:'FPS',pacing:'RHYTHM',realism:'DRIVE',
 preorders:'17M',comparison:'VS',split:'SÍ / PERO',verdict:'W',outro:'NEXT'
};

const SceneMotif:React.FC<{type:string;accent:string;frame:number}> = ({type,accent,frame})=>{
 const bob=Math.sin(frame*.055)*12;
 const turn=Math.sin(frame*.028)*5;
 const stroke={fill:'none',stroke:accent,strokeWidth:12,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 let art:React.ReactNode=null;
 if(type==='hook') art=<g>
  <path d="M205 125 H395 L372 290 Q300 360 228 290 Z" fill={accent+'22'} stroke={accent} strokeWidth="14"/>
  <path d="M205 160 Q85 105 112 220 Q132 286 245 284 M395 160 Q515 105 488 220 Q468 286 355 284" {...stroke}/>
  <path d="M300 360 V430 M220 442 H380" stroke={WHITE} strokeWidth="16" strokeLinecap="round"/>
  <path d="M300 25 L326 78 L384 86 L342 126 L352 184 L300 155 L248 184 L258 126 L216 86 L274 78 Z" fill={YELLOW}/>
 </g>;
 else if(type==='welcome') art=<g>
  <rect x="80" y="115" width="180" height="270" rx="24" fill="#111323" stroke={TEAL} strokeWidth="10" transform="rotate(-10 170 250)"/>
  <rect x="340" y="75" width="180" height="270" rx="24" fill="#111323" stroke={PINK} strokeWidth="10" transform="rotate(8 430 210)"/>
  <path d="M145 200 H205 M175 170 V230 M390 175 L430 215 L390 255" stroke={WHITE} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M280 80 L250 240 L320 210 L290 390" stroke={YELLOW} strokeWidth="14" fill="none" strokeLinejoin="round"/>
 </g>;
 else if(type==='score') art=<g>
  <circle cx="300" cy="250" r="190" fill="#090915" stroke="#ffffff44" strokeWidth="22"/>
  <circle cx="300" cy="250" r="190" fill="none" stroke={accent} strokeWidth="24" strokeDasharray="1194" strokeDashoffset={1194*(.12+.06*Math.sin(frame*.04))} transform="rotate(-90 300 250)"/>
  <text x="300" y="285" textAnchor="middle" fontSize="132" fontFamily="ImpactLocal" fill={WHITE}>99</text>
  <text x="300" y="342" textAnchor="middle" fontSize="32" fontFamily="ImpactLocal" fill={YELLOW}>/100</text>
 </g>;
 else if(type==='timeline') art=<g>
  <path d="M80 270 H520" stroke={WHITE} strokeWidth="10" strokeLinecap="round"/>
  <path d="M100 270 H500" stroke={accent} strokeWidth="6" strokeDasharray="14 15"/>
  <circle cx="120" cy="270" r="38" fill="#111323" stroke={ORANGE} strokeWidth="12"/>
  <circle cx="480" cy="270" r="38" fill="#111323" stroke={TEAL} strokeWidth="12"/>
  <text x="120" y="180" textAnchor="middle" fontSize="48" fontFamily="ImpactLocal" fill={WHITE}>1998</text>
  <text x="480" y="180" textAnchor="middle" fontSize="48" fontFamily="ImpactLocal" fill={WHITE}>2026</text>
  <rect x="230" y="225" width="140" height="90" rx="16" fill={INK} stroke={YELLOW} strokeWidth="7"/>
  <text x="300" y="283" textAnchor="middle" fontSize="34" fontFamily="ImpactLocal" fill={YELLOW}>28 AÑOS</text>
 </g>;
 else if(type==='ranking') art=<g>
  {[98,97,99].map((v,i)=><g key={i}>
   <rect x={95+i*145} y={400-v*2.3} width="92" height={v*2.3} rx="12" fill={i===2?YELLOW:accent} opacity=".9"/>
   <text x={141+i*145} y={370-v*2.3} textAnchor="middle" fontSize="34" fontFamily="ImpactLocal" fill={WHITE}>{v}</text>
   <text x={141+i*145} y="455" textAnchor="middle" fontSize="24" fontFamily="ImpactLocal" fill={WHITE}>{['IV','V','VI'][i]}</text>
  </g>)}
 </g>;
 else if(type==='world') art=<g>
  <path d="M75 145 L520 95 L470 405 L105 450 Z" fill="#111c2b" stroke={TEAL} strokeWidth="9"/>
  <path d="M90 225 L500 350 M130 420 L450 125 M250 125 L300 430 M410 110 L360 420" stroke="#ffffff55" strokeWidth="15" fill="none"/>
  <path d="M110 390 Q220 275 320 310 T490 145" fill="none" stroke={YELLOW} strokeWidth="12" strokeDasharray="18 12"/>
  <circle cx="110" cy="390" r="20" fill={PINK}/><circle cx="490" cy="145" r="20" fill={TEAL}/>
 </g>;
 else if(type==='duo') art=<g>
  <circle cx="190" cy="230" r="95" fill="#111323" stroke={PINK} strokeWidth="14"/>
  <circle cx="410" cy="230" r="95" fill="#111323" stroke={TEAL} strokeWidth="14"/>
  <path d="M285 230 H315" stroke={WHITE} strokeWidth="14" strokeLinecap="round"/>
  <path d="M300 200 C260 155 220 220 300 280 C380 220 340 155 300 200" fill={PINK} opacity=".9"/>
  <path d="M145 390 Q190 320 235 390 M365 390 Q410 320 455 390" stroke={WHITE} strokeWidth="12" fill="none" strokeLinecap="round"/>
 </g>;
 else if(type==='hours') art=<g>
  <circle cx="300" cy="250" r="190" fill="#111323" stroke={accent} strokeWidth="14"/>
  {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=><path key={i} d="M300 82 V110" stroke={WHITE} strokeWidth="9" transform={'rotate('+i*30+' 300 250)'}/>)}
  <path d={'M300 250 L300 '+(250-120)+' M300 250 L'+(300+105)+' '+(250+40)} stroke={YELLOW} strokeWidth="16" strokeLinecap="round" transform={'rotate('+frame*1.5+' 300 250)'}/>
  <circle cx="300" cy="250" r="18" fill={WHITE}/>
  <text x="300" y="450" textAnchor="middle" fontSize="44" fontFamily="ImpactLocal" fill={WHITE}>60 HORAS</text>
 </g>;
 else if(type==='reviews') art=<g>
  {[0,1,2].map(i=><g key={i} transform={'translate('+(70+i*155)+' '+(140+(i%2)*35)+') rotate('+(-8+i*7)+' 70 130)'}>
   <rect x="0" y="0" width="135" height="250" rx="16" fill="#111323" stroke={i===1?YELLOW:accent} strokeWidth="8"/>
   <path d="M25 60 H110 M25 90 H95 M25 120 H105" stroke={WHITE} strokeWidth="8" strokeLinecap="round"/>
   <text x="68" y="195" textAnchor="middle" fontSize="46" fontFamily="ImpactLocal" fill={i===1?YELLOW:WHITE}>100</text>
  </g>)}
 </g>;
 else if(type==='fps') art=<g>
  <path d="M85 210 Q105 115 200 125 H400 Q495 115 515 210 L560 360 Q570 415 510 420 H450 Q410 415 385 345 H215 Q190 415 150 420 H90 Q30 415 40 360 Z" fill="#111323" stroke={WHITE} strokeWidth="13"/>
  <path d="M145 220 V300 M105 260 H185" stroke={TEAL} strokeWidth="18" strokeLinecap="round"/>
  <circle cx="430" cy="215" r="18" fill={PINK}/><circle cx="470" cy="260" r="18" fill={YELLOW}/>
  <text x="300" y="315" textAnchor="middle" fontSize="68" fontFamily="ImpactLocal" fill={WHITE}>30 FPS</text>
 </g>;
 else if(type==='performance') art=<g>
  {[0,1,2,3,4].map(i=><line key={i} x1="65" y1={130+i*70} x2="540" y2={130+i*70} stroke="#ffffff33" strokeDasharray="8 10"/>)}
  <path d="M65 320 L110 300 L155 325 L205 190 L250 340 L300 245 L350 300 L400 150 L445 335 L495 235 L540 285" stroke={PINK} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
 </g>;
 else if(type==='pacing') art=<g>
  <circle cx="300" cy="250" r="180" fill="#111323" stroke={PINK} strokeWidth="12"/>
  <path d="M300 250 L300 125 M300 250 L410 310" stroke={WHITE} strokeWidth="15" strokeLinecap="round"/>
  <circle cx="300" cy="250" r="18" fill={YELLOW}/>
  <path d="M185 65 L415 65 M210 40 L390 40" stroke={WHITE} strokeWidth="10" strokeLinecap="round"/>
  <path d="M95 430 H220 M240 430 H400 M420 430 H520" stroke={accent} strokeWidth="14" strokeLinecap="round"/>
 </g>;
 else if(type==='realism') art=<g>
  <path d="M55 310 L125 220 Q160 170 245 165 H420 Q490 170 535 235 L565 310 V370 H45 Z" fill="#111323" stroke={accent} strokeWidth="13"/>
  <path d="M170 215 L235 145 H410 L485 230" stroke={WHITE} strokeWidth="10" fill="none"/>
  <circle cx="160" cy="365" r="48" fill="#090915" stroke={WHITE} strokeWidth="12"/><circle cx="460" cy="365" r="48" fill="#090915" stroke={WHITE} strokeWidth="12"/>
 </g>;
 else if(type==='preorders') art=<g>
  {[0,1,2].map(i=><g key={i} transform={'translate('+(130+i*145)+' '+(330-i*40)+')'}>
   <ellipse cx="0" cy="0" rx="76" ry="25" fill="#ffd978" stroke={ORANGE} strokeWidth="9"/>
   <path d="M-76 0 V54 Q0 95 76 54 V0" fill="#b97724" stroke={ORANGE} strokeWidth="9"/>
   <ellipse cx="0" cy="0" rx="76" ry="25" fill="#ffd978" stroke={ORANGE} strokeWidth="9"/>
   <text x="0" y="12" textAnchor="middle" fontSize="34" fontFamily="ImpactLocal" fill="#8a4b12">$</text>
  </g>)}
 </g>;
 else if(type==='comparison'||type==='split') art=<g>
  <rect x="60" y="120" width="220" height="290" rx="22" fill="#101a25" stroke={TEAL} strokeWidth="10"/>
  <rect x="320" y="120" width="220" height="290" rx="22" fill="#20101d" stroke={PINK} strokeWidth="10"/>
  <path d="M110 245 L160 300 L235 205" stroke={TEAL} strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M370 210 L490 330 M490 210 L370 330" stroke={PINK} strokeWidth="18" strokeLinecap="round"/>
 </g>;
 else if(type==='verdict') art=<g>
  <path d="M300 95 V400 M160 160 H440 M200 160 L120 320 H280 Z M400 160 L320 320 H480 Z" stroke={TEAL} strokeWidth="14" fill="none" strokeLinejoin="round"/>
  <circle cx="300" cy="90" r="22" fill={YELLOW}/>
  <path d="M210 430 H390" stroke={WHITE} strokeWidth="15" strokeLinecap="round"/>
 </g>;
 else if(type==='outro') art=<g>
  <rect x="70" y="110" width="250" height="300" rx="24" fill="#101323" stroke={TEAL} strokeWidth="10"/>
  <rect x="350" y="160" width="190" height="250" rx="24" fill="#101323" stroke={PINK} strokeWidth="10"/>
  <path d="M165 190 L165 330 L265 260 Z" fill={YELLOW}/>
  <path d="M385 230 H500 M385 275 H480 M385 320 H500" stroke={WHITE} strokeWidth="10" strokeLinecap="round"/>
 </g>;
 return <svg viewBox="0 0 600 520" width="650" height="565" style={{position:'absolute',left:510,top:165,opacity:.55,filter:'drop-shadow(0 0 24px '+accent+'66)',transform:'translateY('+bob+'px) rotate('+turn+'deg)'}}>{art}</svg>;
};


export const SceneBackdrop:React.FC<{type:string;accent:string;frame:number}> = ({type,accent,frame})=>{
 const drift=Math.sin(frame*.018)*22;
 const pulse=.5+.5*Math.sin(frame*.045);
 const glyph=glyphs[type]||'ZINKO';
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'radial-gradient(ellipse at '+(30+Math.sin(frame*.012)*8)+'% '+(42+Math.cos(frame*.015)*6)+'%, '+accent+'30 0%, transparent 44%),radial-gradient(ellipse at 82% 20%, '+PINK+'22 0%, transparent 34%),linear-gradient(135deg,#080914 0%,#151326 48%,#080912 100%)'}}>
  <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px)',backgroundSize:'72px 72px',opacity:.32,transform:'translate('+drift+'px,'+(-drift*.45)+'px)'}}/>
  <div style={{position:'absolute',left:-80,right:-80,bottom:-280,height:610,transform:'perspective(620px) rotateX(66deg)',transformOrigin:'center bottom',backgroundImage:'linear-gradient(rgba(36,242,220,.24) 1px,transparent 1px),linear-gradient(90deg,rgba(36,242,220,.24) 1px,transparent 1px)',backgroundSize:'92px 92px',opacity:.26,maskImage:'linear-gradient(to top,black,transparent 90%)'}}/>
  <div style={{position:'absolute',left:90,top:150,fontFamily:'ImpactLocal',fontSize:300,lineHeight:.9,letterSpacing:3,color:WHITE,opacity:.075,transform:'translateY('+drift+'px) rotate(-7deg)',whiteSpace:'nowrap',textShadow:'0 0 55px '+accent}}>{glyph}</div>
  <SceneMotif type={type} accent={accent} frame={frame}/>
  <div style={{position:'absolute',right:140,top:110,width:520,height:520,border:'2px solid '+accent+'55',borderRadius:'50%',transform:'rotate('+frame*.22+'deg) scale('+(1+pulse*.035)+')',boxShadow:'0 0 55px '+accent+'22,inset 0 0 55px '+accent+'18'}}/>
  <div style={{position:'absolute',right:205,top:175,width:390,height:390,border:'1px dashed '+WHITE+'55',borderRadius:'50%',transform:'rotate('+(-frame*.16)+'deg)'}}/>
  <div style={{position:'absolute',right:0,top:0,width:760,height:'100%',background:'linear-gradient(90deg,transparent,'+accent+'0b)',transform:'skewX(-13deg) translateX('+(Math.sin(frame*.025)*45)+'px)'}}/>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute',inset:0,opacity:.52}}>
   <path d={'M0 '+(790+Math.sin(frame*.025)*18)+' Q480 660 920 800 T1920 700'} fill="none" stroke={accent} strokeWidth="3" strokeDasharray="8 22"/>
   <path d={'M0 '+(850+Math.cos(frame*.021)*22)+' L1920 '+(600+Math.sin(frame*.018)*30)} fill="none" stroke={WHITE} strokeWidth="1" opacity=".35"/>
   {[0,1,2,3,4,5,6,7].map(i=><circle key={i} cx={180+i*220+Math.sin(frame*.02+i)*18} cy={190+(i%3)*210+Math.cos(frame*.024+i)*20} r={3+(i%3)} fill={i%2?accent:WHITE}/>)}
  </svg>
  <div style={{position:'absolute',left:60,right:60,top:95,height:2,background:'linear-gradient(90deg,transparent,'+accent+'88,transparent)',boxShadow:'0 0 22px '+accent,opacity:.55}}/>
 </div>;
};

export const TitleSting:React.FC<{frame:number}> = ({frame})=>{
  if(frame>96) return null;
  const enter=spring({frame:Math.max(0,frame-4),fps:30,config:{mass:.65,damping:10,stiffness:160}});
  const leave=clamp01((96-frame)/16);
  const p=enter*leave;
  return <div style={{position:'absolute',left:0,right:0,top:120,display:'flex',flexDirection:'column',alignItems:'center',opacity:p,transform:'perspective(1000px) translateY('+(1-enter)*-90+'px) rotateX('+(1-enter)*24+'deg) scale('+(0.72+.28*enter)+')',pointerEvents:'none',filter:'drop-shadow(0 18px 28px #000b)'}}>
    <div style={{fontFamily:'ImpactLocal',fontSize:150,lineHeight:.9,letterSpacing:8,color:WHITE,background:'linear-gradient(180deg,#fff 0%,#d9e8f2 24%,#8ca2b6 48%,#fff 56%,#d7a85c 76%,#fff1c9 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',WebkitTextStroke:'2px #111',textShadow:'0 0 28px rgba(36,242,220,.5),0 10px 0 #17111d'}}>GTA 6</div>
    <div style={{marginTop:14,padding:'10px 28px',background:'linear-gradient(90deg,transparent,rgba(5,5,16,.94),transparent)',fontFamily:'ImpactLocal',fontSize:38,letterSpacing:6,color:YELLOW,textShadow:'0 3px 0 '+INK}}>¿VALIÓ LA ESPERA?</div>
  </div>;
};
