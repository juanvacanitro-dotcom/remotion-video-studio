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

export const SceneBackdrop:React.FC<{type:string;accent:string;frame:number}> = ({type,accent,frame})=>{
 const drift=Math.sin(frame*.018)*22;
 const pulse=.5+.5*Math.sin(frame*.045);
 const glyph=glyphs[type]||'ZINKO';
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'radial-gradient(ellipse at '+(30+Math.sin(frame*.012)*8)+'% '+(42+Math.cos(frame*.015)*6)+'%, '+accent+'30 0%, transparent 44%),radial-gradient(ellipse at 82% 20%, '+PINK+'22 0%, transparent 34%),linear-gradient(135deg,#080914 0%,#151326 48%,#080912 100%)'}}>
  <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px)',backgroundSize:'72px 72px',opacity:.32,transform:'translate('+drift+'px,'+(-drift*.45)+'px)'}}/>
  <div style={{position:'absolute',left:-80,right:-80,bottom:-280,height:610,transform:'perspective(620px) rotateX(66deg)',transformOrigin:'center bottom',backgroundImage:'linear-gradient(rgba(36,242,220,.24) 1px,transparent 1px),linear-gradient(90deg,rgba(36,242,220,.24) 1px,transparent 1px)',backgroundSize:'92px 92px',opacity:.26,maskImage:'linear-gradient(to top,black,transparent 90%)'}}/>
  <div style={{position:'absolute',left:90,top:150,fontFamily:'ImpactLocal',fontSize:300,lineHeight:.9,letterSpacing:3,color:WHITE,opacity:.075,transform:'translateY('+drift+'px) rotate(-7deg)',whiteSpace:'nowrap',textShadow:'0 0 55px '+accent}}>{glyph}</div>
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
