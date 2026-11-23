import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, staticFile, interpolate, spring,
  useCurrentFrame, useVideoConfig, Easing
} from 'remotion';

const VOICE = 'valio-espera/voice.mp3';
const C = { bg:'#080714', white:'#f8f7ff', pink:'#ff168e', teal:'#00e9df', orange:'#ff9b3d', muted:'#a9a5bd', ink:'#080714' };
type SceneData = { start:number; end:number; title:string; kicker:string; caption:string; accent:string; kind:number };
const scenes:SceneData[] = [
{start:0,end:9.7176,title:'RÉCORD DE 28 AÑOS',kicker:'GTA 6 · RESEÑAS HISTÓRICAS',caption:'Un juego acaba de igualar un récord de veintiocho años. Es GTA seis, y las reseñas son históricas. Pero tiene pegas que casi nadie cuenta.',accent:C.orange,kind:0},
{start:9.7176,end:18.6253,title:'BIENVENIDO A ZINKO',kicker:'EL CANAL DE LA CURIOSIDAD',caption:'Bienvenido a Zinko, el canal de la curiosidad. Hoy veremos qué aman, qué critican y si valió la espera. Y al final, mi veredicto.',accent:C.teal,kind:1},
{start:18.6253,end:26.9845,title:'99 / 100',kicker:'METACRITIC · MÁS DE 140 CRÍTICOS',caption:'Las reseñas salieron con una nota casi perfecta. Noventa y nueve sobre cien en Metacritic. Más de ciento cuarenta críticos lo puntuaron.',accent:C.orange,kind:2},
{start:26.9845,end:36.1535,title:'EMPATE HISTÓRICO',kicker:'OCARINA OF TIME · 1998',caption:'Solo un juego había llegado a noventa y nueve. Ocarina of Time, de mil novecientos noventa y ocho. Veintiocho años después, GTA seis lo alcanza.',accent:C.teal,kind:3},
{start:36.1535,end:44.8261,title:'CERO NEGATIVAS',kicker:'GTA IV · 98  /  GTA V · 97',caption:'En la saga, GTA cuatro tiene noventa y ocho. GTA cinco, noventa y siete. Y en el recuento inicial no había ni una reseña negativa.',accent:C.teal,kind:4},
{start:44.8261,end:52.6367,title:'MUNDO ABIERTO',kicker:'ENORME · VIVO · DETALLADO',caption:'Lo primero que alaban es el mundo abierto. Enorme, vivo y lleno de detalles. Dicen que te hace sentir dentro de él.',accent:C.teal,kind:5},
{start:52.6367,end:62.2759,title:'DOS PROTAGONISTAS',kicker:'UNA PAREJA CREÍBLE',caption:'Los dos protagonistas son lo más elogiado de la historia. Una pareja que, según los críticos, se siente creíble. Y que tú ayudas a moldear con tus decisiones.',accent:C.pink,kind:6},
{start:62.2759,end:69.8253,title:'+100 HORAS',kicker:'HISTORIA PRINCIPAL · 60 H',caption:'La historia principal dura unas sesenta horas. Y con todo lo demás, pasa de cien. Es muchísimo juego por lo que cuesta.',accent:C.orange,kind:7},
{start:69.8253,end:79.6996,title:'NOTA MÁXIMA',kicker:'IGN · GAMESPOT · EUROGAMER',caption:'IGN, GameSpot y Eurogamer le dieron la nota máxima. Uno de ellos lo llamó el juego de la generación. Las notas más bajas rondan el ochenta.',accent:C.orange,kind:8},
{start:79.6996,end:89.5739,title:'30 FPS',kicker:'SIN MODO DE 60 FPS',caption:'Ahora, las pegas. La más repetida: treinta fotogramas por segundo. En todas las consolas, incluso en PS5 Pro. Y sin un modo de sesenta.',accent:C.pink,kind:9},
{start:89.5739,end:98.0114,title:'CAÍDAS DE RENDIMIENTO',kicker:'ZONAS LLENAS · TIROTEOS',caption:'Varias reseñas notan caídas de rendimiento. Sobre todo en zonas muy llenas y en tiroteos. Aunque otros críticos lo ven fluido y estable.',accent:C.pink,kind:10},
{start:98.0114,end:106.6057,title:'RITMO DESIGUAL',kicker:'INICIO LENTO · MISIONES GUIADAS',caption:'También critican un ritmo desigual en la historia. Un inicio lento y misiones muy guiadas. Y escenas largas en las que casi no controlas.',accent:C.pink,kind:11},
{start:106.6057,end:115.4351,title:'CURVA DE APRENDIZAJE',kicker:'COCHES · GASTOS · RUTINAS',caption:'Y el realismo tiene curva de aprendizaje. Coches más frágiles, gastos y tareas del día a día. Si vienes de GTA cinco, te sorprenderá.',accent:C.orange,kind:12},
{start:115.4351,end:125.3094,title:'+17 MILLONES*',kicker:'PREVENTAS · ESTIMACIÓN DE TERCEROS',caption:'Las preventas superaron lo esperado, dice Take-Two. Sensor Tower calcula más de diecisiete millones. A casi ochenta o casi cien dólares cada una.',accent:C.orange,kind:13},
{start:125.3094,end:134.4784,title:'11 MILLONES',kicker:'VENTAS DE GTA V · PRIMER DÍA',caption:'Para comparar: GTA cinco vendió once millones el primer día. Según esa estimación, las preventas ya lo superan. Faltan las cifras oficiales.',accent:C.orange,kind:14},
{start:134.4784,end:145.5543,title:'CASI UNÁNIME',kicker:'CRÍTICOS: SÍ · JUGADORES: MATICES',caption:'¿Superó las expectativas? Para los críticos, sí. Para algunos jugadores hay matices, sobre todo con los treinta fotogramas. Y aun así, el aplauso es casi unánime.',accent:C.teal,kind:15},
{start:145.5543,end:155.9249,title:'HISTÓRICO',kicker:'NO ES PERFECTO · ES AMBICIOSO',caption:'Mi veredicto: no es perfecto, pero es histórico. Las pegas son técnicas y de ritmo, no de ambición. Y la última palabra la tienes tú, jugándolo.',accent:C.teal,kind:16},
{start:155.9249,end:164.049,title:'¿QUÉ NOTA LE DAS?',kicker:'SUSCRÍBETE A ZINKO',caption:'¿Qué nota le pondrías tú a GTA seis? Suscríbete a Zinko para más curiosidad. Y mira el siguiente vídeo, está justo aquí.',accent:C.pink,kind:17}
];

const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const Line:React.FC<{x1:number;y1:number;x2:number;y2:number;color:string;w?:number;dash?:string}> = ({x1,y1,x2,y2,color,w=5,dash}) =>
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash}/>;

const NeonCity:React.FC<{f:number}> = ({f}) => <svg viewBox="0 0 900 520" style={{width:900,height:520,overflow:'visible'}}>
  <path d="M0 445 Q200 420 410 445 T900 430" stroke={C.teal} strokeWidth="5" fill="none" opacity=".8"/>
  {Array.from({length:11},(_,i)=><g key={i} transform={`translate(${i*90-25} 0)`}>
    <rect x="5" y={260-(i%4)*35} width="62" height={185+(i%4)*35} fill="#111126" stroke={C.white} strokeWidth="3"/>
    {Array.from({length:6},(_,j)=><rect key={j} x="15" y={280-(i%4)*35+j*24} width="12" height="12" fill={j%2?C.pink:C.teal} opacity={.55+.35*Math.sin(f/9+j)}/>)}
  </g>)}
  <circle cx="705" cy="135" r="58" fill={C.orange} opacity=".9" style={{filter:'drop-shadow(0 0 28px #ff9b3d)'}}/>
  <path d="M0 490 L900 490" stroke={C.white} strokeWidth="3" opacity=".5"/>
  {Array.from({length:12},(_,i)=><path key={i} d={`M450 490 L${i*90} 520`} stroke={C.teal} strokeWidth="2" opacity=".35"/>)}
</svg>;

const Trophy:React.FC<{f:number}> = ({f}) => <svg viewBox="0 0 520 430" style={{width:520,height:430,overflow:'visible'}}>
  <ellipse cx="260" cy="370" rx="185" ry="25" fill={C.orange} opacity=".16"/>
  <path d="M190 80 L330 80 L310 235 Q260 300 210 235 Z" fill="#ffb64a" fillOpacity=".2" stroke={C.orange} strokeWidth="9"/>
  <path d="M190 110 Q85 60 105 180 Q118 250 225 240 M330 110 Q435 60 415 180 Q402 250 295 240" fill="none" stroke={C.orange} strokeWidth="12"/>
  <path d="M260 300 L260 350 M190 355 L330 355" stroke={C.white} strokeWidth="12" strokeLinecap="round"/>
  {Array.from({length:7},(_,i)=><path key={i} d={`M${160+i*34} 72 l-18 -30 m${18} 30 l18 -26`} stroke={C.white} strokeWidth="2" opacity={.5}/>)}
  <path d="M180 95 Q260 40 340 95" fill="none" stroke={C.white} strokeWidth="3" strokeDasharray="8 12" opacity=".7"/>
  <path d={`M260 80 L260 ${80+110*(.5+.5*Math.sin(f/12))}`} stroke={C.white} strokeWidth="3" opacity=".35"/>
</svg>;

const RingScore:React.FC<{f:number}> = ({f}) => {
 const p=interpolate(f,[0,45],[0,.99],clamp);
 return <svg viewBox="0 0 520 520" style={{width:520,height:520,overflow:'visible'}}>
  <circle cx="260" cy="260" r="175" stroke="#ffffff22" strokeWidth="35" fill="none"/>
  <circle cx="260" cy="260" r="175" stroke={C.orange} strokeWidth="35" fill="none" strokeLinecap="round" strokeDasharray={2*Math.PI*175} strokeDashoffset={2*Math.PI*175*(1-p)} transform="rotate(-90 260 260)" style={{filter:'drop-shadow(0 0 18px #ff9b3d)'}}/>
  <text x="260" y="290" fill={C.white} textAnchor="middle" fontSize="100" fontWeight="900">99</text>
  {Array.from({length:24},(_,i)=><Line key={i} x1={260+197*Math.cos(i*Math.PI/12)} y1={260+197*Math.sin(i*Math.PI/12)} x2={260+214*Math.cos(i*Math.PI/12)} y2={260+214*Math.sin(i*Math.PI/12)} color={C.white} w={4}/>)}
 </svg>;
};

const Bars:React.FC<{f:number;values:number[]}> = ({f,values}) => <svg viewBox="0 0 620 450" style={{width:620,height:450}}>
  {values.map((v,i)=>{const h=v*3.2*interpolate(f,[0,28],[0,1],clamp);return <g key={i}><rect x={60+i*180} y={370-h} width="105" height={h} rx="12" fill={i===2?C.orange:C.teal} opacity=".9" style={{filter:'drop-shadow(0 0 15px '+(i===2?C.orange:C.teal)+')'}}/><text x={112+i*180} y={410} fill={C.white} fontSize="32" textAnchor="middle" fontWeight="800">{values[i]}</text></g>})}
  <Line x1={25} y1={372} x2={590} y2={372} color={C.white} w={4}/>
 </svg>;
};

const Motif:React.FC<{kind:number;f:number;accent:string}> = ({kind,f,accent}) => {
 const pulse=1+.035*Math.sin(f/7);
 if(kind===0||kind===3) return <div style={{transform:`scale(${pulse}) rotate(${Math.sin(f/20)*2}deg)`}}><Trophy f={f}/></div>;
 if(kind===1) return <svg viewBox="0 0 620 430" width="620" height="430"><path d="M80 300 L540 300 L540 80 L80 80 Z" stroke={C.white} strokeWidth="6" fill="#101026"/><rect x="180" y="145" width="260" height="125" rx="15" fill="#080714" stroke={C.teal} strokeWidth="6"/><path d="M140 330 L480 330" stroke={C.white} strokeWidth="9"/><path d="M235 195 l28 28 60 -70" stroke={C.teal} strokeWidth="9" fill="none"/><path d="M420 155 l85 85 M505 155 l-85 85" stroke={C.pink} strokeWidth="10" strokeLinecap="round"/></svg>;
 if(kind===2) return <RingScore f={f}/>;
 if(kind===4) return <Bars f={f} values={[98,97,99]}/>;
 if(kind===5) return <div style={{transform:`scale(${pulse}) translateY(${Math.sin(f/9)*8}px)`}}><NeonCity f={f}/></div>;
 if(kind===6) return <svg viewBox="0 0 620 430" width="620" height="430"><circle cx="170" cy="135" r="65" stroke={C.pink} strokeWidth="8" fill="none"/><circle cx="450" cy="135" r="65" stroke={C.teal} strokeWidth="8" fill="none"/><path d="M235 135 Q310 30 385 135 M235 155 Q310 300 385 155" stroke={C.white} strokeWidth="6" fill="none" strokeDasharray="12 12"/><path d="M310 280 L310 360 M260 360 L360 360" stroke={accent} strokeWidth="9"/><path d="M270 300 L310 270 L350 300" stroke={accent} strokeWidth="8" fill="none"/></svg>;
 if(kind===7) return <svg viewBox="0 0 620 430" width="620" height="430"><circle cx="300" cy="210" r="145" stroke={C.orange} strokeWidth="12" fill="none" strokeDasharray="8 12"/><path d="M300 210 L300 100 M300 210 L395 250" stroke={C.white} strokeWidth="12" strokeLinecap="round"/><circle cx="300" cy="210" r="12" fill={C.orange}/><path d="M90 370 L520 370" stroke={C.teal} strokeWidth="5"/>{Array.from({length:6},(_,i)=><rect key={i} x={105+i*70} y={335-(i%2)*30} width="42" height="35+(i%2)*30" fill={C.teal} opacity=".7"/>)}</svg>;
 if(kind===8||kind===13||kind===14) return <div style={{transform:`scale(${pulse})`}}><Bars f={f} values={kind===8?[100,96,80]:kind===13?[17,10,7]:[11,8,5]}/></div>;
 if(kind===9) return <svg viewBox="0 0 620 430" width="620" height="430"><text x="310" y="235" textAnchor="middle" fill={C.pink} fontSize="155" fontWeight="900">30</text><text x="310" y="300" textAnchor="middle" fill={C.white} fontSize="34" fontWeight="800">FPS</text><path d="M80 350 L540 350" stroke={C.white} strokeWidth="5"/>{Array.from({length:8},(_,i)=><path key={i} d={`M${95+i*60} 335 v${i%2? -65:-35}`} stroke={C.pink} strokeWidth="9"/>)}</svg>;
 if(kind===10) return <svg viewBox="0 0 620 430" width="620" height="430"><path d="M55 350 L55 75 M55 350 L565 350" stroke={C.white} strokeWidth="5"/><path d={`M55 310 ${Array.from({length:14},(_,i)=>`L${90+i*34} ${270-70*Math.sin(i*1.8+f/8)-40*(i%4===0?1:0)}`).join(' ')} L565 310`} stroke={C.pink} strokeWidth="9" fill="none" strokeLinejoin="round"/><circle cx="390" cy={180+30*Math.sin(f/6)} r="18" fill={C.orange}/></svg>;
 if(kind===11) return <svg viewBox="0 0 620 430" width="620" height="430"><path d="M65 215 L210 215 L265 105 L355 325 L420 215 L555 215" stroke={C.pink} strokeWidth="10" fill="none" strokeLinejoin="round"/><rect x="65" y="365" width="490" height="18" rx="8" fill="#ffffff22"/><rect x="65" y="365" width={Math.min(490,f*9)} height="18" rx="8" fill={C.pink}/></svg>;
 if(kind===12) return <svg viewBox="0 0 620 430" width="620" height="430"><path d="M100 285 L160 185 L420 185 L500 285 L520 340 L80 340 Z" fill="#ffffff12" stroke={C.orange} strokeWidth="8"/><circle cx="180" cy="340" r="38" fill={C.bg} stroke={C.white} strokeWidth="8"/><circle cx="420" cy="340" r="38" fill={C.bg} stroke={C.white} strokeWidth="8"/><path d="M235 185 L270 120 L360 120 L395 185" stroke={C.white} strokeWidth="6" fill="none"/><path d="M130 70 L490 70" stroke={C.pink} strokeWidth="7" strokeDasharray="12 10"/></svg>;
 if(kind===15) return <svg viewBox="0 0 620 430" width="620" height="430"><path d="M310 90 L310 345 M170 145 L450 145 M220 145 L165 260 L275 260 Z M400 145 L345 260 L455 260 Z" stroke={C.white} strokeWidth="8" fill="none"/><path d="M115 350 L505 350" stroke={C.teal} strokeWidth="12"/><circle cx="310" cy="85" r="20" fill={C.orange}/></svg>;
 return <svg viewBox="0 0 620 430" width="620" height="430"><path d="M310 50 L390 190 L310 330 L230 190 Z" stroke={accent} strokeWidth="9" fill="#ffffff0a"/><path d="M265 190 L300 225 L365 145" stroke={C.teal} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
};

const Scene:React.FC<{data:SceneData;index:number}> = ({data,index}) => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const intro=spring({frame:f,fps,config:{damping:17,stiffness:120,mass:.8}});
 const drift=Math.sin(f/17)*12;
 const accent=data.accent;
 const nico=index===3||index===9||index===10||index===11? 'nico-question.webp':'nico-happy.webp';
 const captionOpacity=interpolate(f,[0,14,Math.max(15,(data.end-data.start)*fps-18),(data.end-data.start)*fps],[0,1,1,0],clamp);
 return <AbsoluteFill style={{background:C.bg,overflow:'hidden',fontFamily:'Arial,Helvetica,sans-serif',color:C.white}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 17% 47%,#30103a 0%,transparent 42%),radial-gradient(ellipse at 82% 48%,#06363a 0%,transparent 43%),linear-gradient(125deg,#080714,#0d0b1d 60%,#05050c)'}}/>
  <div style={{position:'absolute',inset:0,opacity:.13,backgroundImage:'linear-gradient(#ffffff20 1px,transparent 1px),linear-gradient(90deg,#ffffff20 1px,transparent 1px)',backgroundSize:'74px 74px',transform:`translate(${(f%74)}px,${(f%74)*.3}px)`}}/>
  <div style={{position:'absolute',left:78,top:54,fontSize:21,fontWeight:900,letterSpacing:7,color:C.muted}}>ZINKO <span style={{color:accent}}>/</span> GTA VI · ANÁLISIS</div>
  <div style={{position:'absolute',right:80,top:54,fontSize:20,letterSpacing:4,color:C.muted}}>{String(index+1).padStart(2,'0')} / 18</div>
  <div style={{position:'absolute',left:90,top:190,width:1000,opacity:intro,transform:`translateY(${(1-intro)*44}px) rotate(-1deg)`}}>
    <div style={{fontSize:25,letterSpacing:5,color:accent,fontWeight:900,marginBottom:24}}>CAPÍTULO {String(index+1).padStart(2,'0')}</div>
    <div style={{fontSize:data.title.length>19?68:92,lineHeight:.98,fontWeight:1000,letterSpacing:-3,textShadow:`0 0 24px ${accent}66,5px 7px 0 #05050c`}}>{data.title}</div>
    <div style={{fontSize:29,letterSpacing:3,color:accent,fontWeight:900,marginTop:30}}>{data.kicker}</div>
  </div>
  <div style={{position:'absolute',right:75,top:170,transform:`translateY(${drift}px) scale(${.95+.03*Math.sin(f/10)})`,filter:`drop-shadow(0 0 24px ${accent}55)`}}>
    <Motif kind={data.kind} f={f} accent={accent}/>
  </div>
  <div style={{position:'absolute',left:35,bottom:-40,transform:`translateY(${drift}px) rotate(${Math.sin(f/23)*1.2}deg)`,filter:'drop-shadow(0 8px 18px #0009)'}}>
    <Img src={staticFile('zinko-proof/'+nico)} style={{width:390,height:520,objectFit:'contain'}}/>
  </div>
  <div style={{position:'absolute',left:80,right:80,bottom:56,padding:'18px 28px',background:'rgba(5,5,15,.88)',borderLeft:`7px solid ${accent}`,borderRadius:'0 16px 16px 0',fontSize:27,lineHeight:1.22,fontWeight:700,opacity:captionOpacity,transform:`translateY(${(1-captionOpacity)*18}px)`,boxShadow:'0 12px 30px #0007'}}>{data.caption}</div>
  <div style={{position:'absolute',left:0,bottom:0,height:7,width:`${Math.min(100,f/((data.end-data.start)*fps)*100)}%`,background:accent,boxShadow:`0 0 18px ${accent}`}}/>
  <Sequence from={3}><Audio src={staticFile('valio-espera/sfx-scratch.wav')} volume={.32}/></Sequence>
  <Sequence from={Math.round(4*fps)}><Audio src={staticFile('valio-espera/sfx-whoosh.wav')} volume={.45}/></Sequence>
  <Sequence from={Math.round(7*fps)}><Audio src={staticFile('valio-espera/sfx-ping.wav')} volume={.38}/></Sequence>
 </AbsoluteFill>;
};

const EndCard:React.FC=()=> {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,#291034,#080714 67%)',justifyContent:'center',alignItems:'center',fontFamily:'Arial',textAlign:'center',color:C.white}}>
  <div style={{fontSize:28,letterSpacing:9,color:C.teal,fontWeight:900}}>ZINKO · EL CANAL DE LA CURIOSIDAD</div>
  <div style={{fontSize:98,fontWeight:1000,color:C.pink,textShadow:'0 0 28px #ff168e88',marginTop:30,transform:`scale(${1+.025*Math.sin(f/8)})`}}>¿QUÉ NOTA LE DAS?</div>
  <div style={{fontSize:34,color:C.muted,letterSpacing:4,marginTop:38}}>SUSCRÍBETE Y MIRA EL SIGUIENTE VÍDEO</div>
  <div style={{position:'absolute',right:180,top:270,width:180,height:180,border:'4px dashed '+C.teal,borderRadius:'50%',opacity:.8}}/>
  <div style={{position:'absolute',left:180,top:270,width:300,height:170,border:'4px solid '+C.pink,borderRadius:24,opacity:.8}}/>
 </AbsoluteFill>;
};

const Main:React.FC=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill>
  {scenes.map((s,i)=><Sequence key={i} from={Math.round(s.start*fps)} durationInFrames={Math.round((s.end-s.start)*fps)} premountFor={fps}><Scene data={s} index={i}/></Sequence>)}
  <Audio src={staticFile(VOICE)} volume={1}/>
  <Sequence from={Math.round(164.05*fps)} durationInFrames={Math.round(15.95*fps)}><EndCard/></Sequence>
 </AbsoluteFill>;
};
export const ZinkoGTA6Espera:React.FC=()=> <Main/>;
