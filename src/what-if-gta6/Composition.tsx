import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, spring} from 'remotion';
import {scenes, SceneData} from './scenes';

const C={bg:'#080916',ink:'#f5f2ff',pink:'#ff3fa8',teal:'#35e0d0',orange:'#ff914d',violet:'#8d68ff',muted:'#8790a9'};
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const mix=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],clamp);
const drift=(f:number,amp:number,period:number,phase=0)=>Math.sin((f+phase)/period*Math.PI*2)*amp;

const Glow:React.FC<{x:number;y:number;r:number;color:string;opacity?:number}> = ({x,y,r,color,opacity=.3})=><circle cx={x} cy={y} r={r} fill={color} opacity={opacity} filter="url(#blur)"/>;
const Starfield:React.FC<{frame:number;count?:number}> = ({frame,count=64})=><g>{Array.from({length:count},(_,i)=>{const x=(i*173+41)%1920,y=(i*97+23)%1080,rad=1+(i%3),o=.15+((i*7)%8)/10;return <circle key={i} cx={(x-frame*(.2+i%3*.12)+1920)%1920} cy={y} r={rad} fill="#d9d9ff" opacity={o}/>})}</g>;

const City:React.FC<{frame:number;night?:boolean}> = ({frame,night=true})=>{
 const shift=(frame*.8)%420;
 return <g>
  <rect width="1920" height="1080" fill={night?'#101126':'#28304a'}/>
  <Glow x={1450} y={230} r={260} color={C.pink} opacity={.18}/><Glow x={380} y={350} r={330} color={C.teal} opacity={.13}/>
  <circle cx="1500" cy="220" r="95" fill={C.orange} opacity={.65}/>
  <path d="M0 650 Q280 610 540 655 T1080 640 T1600 660 T2100 620 V1080 H0Z" fill="#151b32"/>
  {Array.from({length:12},(_,i)=>{const x=i*190-shift%190;const h=210+(i*79)%300;return <g key={i}><rect x={x} y={650-h} width="150" height={h} fill={i%3===0?'#252b48':'#1b2039'} stroke="#4a4b70" strokeWidth="3"/>{Array.from({length:Math.floor(h/48)},(_,j)=><g key={j}>{Array.from({length:3},(_,k)=><rect key={k} x={x+20+k*42} y={670-h+j*48} width="14" height="20" rx="3" fill={(i+j+k)%4===0?C.pink:(i+j+k)%3===0?C.teal:'#e7b76d'} opacity=".7"/>)}</g>)}<path d={`M${x+12} ${650-h+28} H${x+138}`} stroke="#72749b" opacity=".5" strokeWidth="3"/></g>})}
  <path d="M0 820 Q400 790 760 830 T1500 815 T2000 820 V1080 H0Z" fill="#11192a"/>
  <path d="M0 870 H1920" stroke={C.teal} opacity=".45" strokeWidth="4"/>
  <path d="M0 1000 H1920" stroke="#4a5270" strokeWidth="3" strokeDasharray="70 42"/>
  {Array.from({length:8},(_,i)=><g key={i} transform={`translate(${(i*300-frame*3+2400)%2400-200},0)`}><path d="M0 850 l45 -45 h110 l48 45 v60 H0Z" fill={i%2?C.pink:'#263b58'} stroke="#f7f2ff" strokeWidth="4"/><circle cx="45" cy="915" r="19" fill="#080916" stroke="#aab0c6" strokeWidth="6"/><circle cx="155" cy="915" r="19" fill="#080916" stroke="#aab0c6" strokeWidth="6"/></g>)}
  <path d="M0 1030 H1920" stroke={C.orange} strokeWidth="3" opacity=".6"/>
 </g>
};

const Bedroom:React.FC<{frame:number}> = ({frame})=><g>
 <rect width="1920" height="1080" fill="#0a0b19"/><path d="M0 0 H1920 V740 H0Z" fill="#17172b"/>
 <Glow x={350} y={250} r={300} color={C.pink} opacity={.14}/><Glow x={1520} y={340} r={350} color={C.teal} opacity={.12}/>
 <path d="M0 740 H1920 V1080 H0Z" fill="#101321"/><path d="M0 740 L960 590 L1920 740" fill="none" stroke="#30334f" strokeWidth="5"/>
 <rect x="1030" y="190" width="690" height="430" rx="24" fill="#05060c" stroke="#8d8da7" strokeWidth="12"/>
 <rect x="1055" y="215" width="640" height="380" rx="8" fill="#10152c"/>
 <City frame={frame*.12}/>
 <rect x="1055" y="215" width="640" height="380" fill="#080916" opacity=".3"/>
 <path d="M1020 625 H1730 L1800 670 H960Z" fill="#292c44" stroke="#777894" strokeWidth="5"/>
 <rect x="180" y="540" width="650" height="260" rx="28" fill="#20243b" stroke="#5b5d7a" strokeWidth="7"/>
 <path d="M210 570 Q500 500 800 570 V690 H210Z" fill="#353957"/>
 <rect x="245" y="510" width="260" height="120" rx="25" fill="#555873"/>
 <rect x="570" y="510" width="220" height="120" rx="25" fill="#424763"/>
 <path d="M210 800 V950 M800 800 V950" stroke="#777894" strokeWidth="22"/>
 <rect x="1330" y="700" width="270" height="22" fill="#55536f"/><path d="M1360 720 V920 M1570 720 V920" stroke="#55536f" strokeWidth="18"/>
 <rect x="1370" y="620" width="185" height="82" rx="10" fill="#141a30" stroke={C.teal} strokeWidth="4"/>
 <path d="M1450 620 V580" stroke="#d6d7e8" strokeWidth="7"/><circle cx="1450" cy="570" r="18" fill={C.orange}/>
 </g>;

const Beach:React.FC<{frame:number}> = ({frame})=><g><rect width="1920" height="1080" fill="#10142b"/><Glow x={1450} y={240} r={320} color={C.orange} opacity={.24}/><circle cx="1450" cy="240" r="110" fill={C.orange} opacity=".7"/><path d="M0 550 Q400 480 900 560 T1920 520 V1080 H0Z" fill="#172c4b"/><path d="M0 690 Q350 600 700 690 T1400 675 T2100 680" fill="none" stroke={C.teal} strokeWidth="18" opacity=".65"/><path d="M0 780 Q350 690 700 780 T1400 765 T2100 770" fill="none" stroke="#4b9ab1" strokeWidth="8" opacity=".6"/><path d="M0 830 Q500 760 1000 850 T1920 820 V1080 H0Z" fill="#b47754"/>{[180,520,1740].map((x,i)=><g key={x} transform={`translate(${x} 0)`}><path d="M0 700 Q-30 460 55 310 Q110 230 200 275 Q110 330 90 450 Q50 580 70 700Z" fill="#253d3a"/><path d="M50 325 Q-50 200 -120 260 M65 325 Q120 160 220 220 M65 325 Q5 120 10 100" fill="none" stroke="#287c70" strokeWidth="25" strokeLinecap="round"/></g>)}</g>;

const Arcade:React.FC<{frame:number}> = ({frame})=><g><rect width="1920" height="1080" fill="#090b1a"/>{Array.from({length:7},(_,i)=><g key={i}><rect x={i*300+80} y="130" width="220" height="810" rx="24" fill="#20233e" stroke={i%2?C.pink:C.teal} strokeWidth="7"/><rect x={i*300+100} y="170" width="180" height="300" rx="12" fill="#060914" stroke="#8388aa" strokeWidth="5"/><rect x={i*300+118} y="190" width="144" height="250" fill={i===3?'#3d1b50':'#121a31'}/><path d={`M${i*300+120} 400 l50 -100 50 100`} fill="none" stroke={C.teal} strokeWidth="7"/><circle cx={i*300+190} cy="540" r="26" fill={C.orange}/><circle cx={i*300+235} cy="540" r="15" fill={C.pink}/><path d={`M${i*300+110} 620 H${i*300+270}`} stroke="#626783" strokeWidth="7"/></g>)}<Glow x={960} y={380} r={400} color={C.pink} opacity={.14}/></g>;

const Portal:React.FC<{frame:number}> = ({frame})=><g><rect width="1920" height="1080" fill="#080916"/><Starfield frame={frame}/><Glow x={960} y={500} r={500} color={C.violet} opacity={.26}/>{Array.from({length:9},(_,i)=><ellipse key={i} cx="960" cy="500" rx={120+i*54+drift(frame,8,40,i*3)} ry={220+i*26} fill="none" stroke={[C.pink,C.teal,C.violet][i%3]} strokeWidth={5+i%3} opacity={.28+i*.065} transform={`rotate(${frame*.45+i*8} 960 500)`}/>)}<path d="M0 900 Q960 780 1920 900 V1080 H0Z" fill="#14162a"/></g>;

const Chase:React.FC<{frame:number}> = ({frame})=><g><City frame={frame*1.7}/><g opacity=".85" transform={`translate(${drift(frame,26,42)} 0)`}><path d="M200 850 l80 -110 h290 l100 110 v80 H200Z" fill="#243d58" stroke={C.teal} strokeWidth="7"/><circle cx="300" cy="930" r="32" fill="#060914" stroke="#aeb4c8" strokeWidth="9"/><circle cx="580" cy="930" r="32" fill="#060914" stroke="#aeb4c8" strokeWidth="9"/><path d="M370 770 L440 680 H520 L590 770Z" fill="#17263d" stroke="#aeb4c8" strokeWidth="5"/></g>{[0,1,2,3].map(i=><g key={i} opacity={.5+Math.sin(frame*.3+i)*.2}><rect x={i*500+120} y="80" width="210" height="18" fill={i%2?C.teal:C.pink}/></g>)}</g>;

const Stick:React.FC<{kind:'adri'|'lucia'|'jason';frame:number;x:number;y:number;scale?:number;action?:string}> = ({kind,frame,x,y,scale=1,action='idle'})=>{
 const bob=drift(frame,action==='chase'?13:5,34,kind==='adri'?0:10);
 const swing=Math.sin(frame*.16+(kind==='lucia'?1:0))*(action==='idle'?8:28);
 const head=kind==='adri'?C.ink:kind==='lucia'?C.orange:C.teal;
 const torso=kind==='adri'?C.ink:kind==='lucia'?C.orange:C.teal;
 return <g transform={`translate(${x} ${y+bob}) scale(${scale})`} strokeLinecap="round" strokeLinejoin="round">
 <ellipse cx="0" cy="250" rx="72" ry="13" fill="#000" opacity=".42"/>
 <path d="M0 120 L0 210" stroke={torso} strokeWidth="19"/>
 <path d={`M0 142 L-48 ${190+swing*.45} M0 142 L48 ${190-swing*.45}`} stroke={torso} strokeWidth="16"/>
 <path d={`M0 205 L-35 ${275+swing*.35} M0 205 L38 ${275-swing*.35}`} stroke={torso} strokeWidth="18"/>
 <circle cx="0" cy="64" r="49" fill="#080916" stroke={head} strokeWidth="11"/>
 {kind==='adri'?<g><path d="M-48 31 Q0 -18 51 25 L42 5 Q-4 -26 -50 5Z" fill={C.pink} stroke={C.pink} strokeWidth="8"/><path d="M18 10 Q68 -4 76 17" fill="none" stroke={C.pink} strokeWidth="12"/><path d="M-52 112 Q0 128 52 112" fill="none" stroke={C.teal} strokeWidth="10"/><path d="M-54 122 Q-72 96 -55 83 M54 122 Q72 96 55 83" fill="none" stroke={C.teal} strokeWidth="9"/></g>:kind==='lucia'?<path d="M-42 45 Q-64 -12 -5 -10 Q55 -6 45 55" fill="none" stroke="#202038" strokeWidth="17"/>:<path d="M-43 35 Q-30 -22 28 -12 L48 22" fill="none" stroke="#24243a" strokeWidth="18"/>}
 <circle cx="-16" cy="62" r="5" fill={C.ink}/><circle cx="16" cy="62" r="5" fill={C.ink}/>
 <path d={action==='surprised'?'M-12 88 Q0 102 12 88':action==='talk'?'M-10 88 Q0 78 10 88':'M-10 89 Q0 94 10 89'} fill="none" stroke={C.ink} strokeWidth="4"/>
 {kind==='adri'&&<path d="M-19 10 Q0 0 20 10" fill="none" stroke={C.pink} strokeWidth="5"/>}
 </g>
};

const SceneBackdrop:React.FC<{location:SceneData['location'];frame:number}> = ({location,frame})=>location==='bedroom'?<Bedroom frame={frame}/>:location==='city'||location==='street'?<City frame={frame}/>:location==='beach'?<Beach frame={frame}/>:location==='arcade'?<Arcade frame={frame}/>:location==='chase'?<Chase frame={frame}/>:<Portal frame={frame}/>;

const Particles:React.FC<{frame:number;hot?:boolean}> = ({frame,hot=false})=><g>{Array.from({length:44},(_,i)=>{const x=(i*173+frame*(.7+i%4*.3))%1920;const y=(i*89-frame*(.6+i%3*.4)+1500)%1080;return <circle key={i} cx={x} cy={y} r={1+(i%4)} fill={i%2?C.teal:C.pink} opacity={.22+(i%5)*.1}/>})}{hot&&<rect width="1920" height="1080" fill={C.pink} opacity={.045+Math.sin(frame*.55)*.035}/>}</g>;

const KineticTitle:React.FC<{text:string;frame:number;sceneFrame:number;beat:number}> = ({text,frame,sceneFrame,beat})=>{
 const local=sceneFrame-beat*100;
 const p=spring({frame:Math.max(0,local),fps:30,config:{damping:15,stiffness:150,mass:.7}});
 const opacity=interpolate(local,[-10,4,78,96],[0,1,1,0],clamp);
 const y=interpolate(p,[0,1],[90,0]);
 return <g opacity={opacity} transform={`translate(0 ${y})`}><rect x="110" y="120" width="690" height="112" rx="18" fill="#090b18" opacity=".74" stroke={C.teal} strokeWidth="3"/><text x="150" y="195" fill={C.ink} fontSize="58" fontWeight="900" letterSpacing="2" fontFamily="Arial, sans-serif">{text}</text><path d="M110 250 H430" stroke={C.pink} strokeWidth="8"/></g>
};

const CharacterStage:React.FC<{scene:SceneData;frame:number}> = ({scene,frame})=>{
 const positions:Record<string,[number,number,number]>={adri:[930,560,1.12],lucia:[1250,570,1.05],jason:[570,580,1.05]};
 const action=scene.action;
 return <g>{scene.cast.map(kind=>{const [x,y,s]=positions[kind];const move=kind==='adri'?drift(frame,action==='chase'?65:24,80):kind==='lucia'?drift(frame,18,95,15):drift(frame,20,110,32);return <Stick key={kind} kind={kind} frame={frame} x={x+move} y={y} scale={s} action={['chase','drive','swerve','jump','pull'].includes(action)?'chase':action==='meet'||action==='warn'?'talk':'idle'}/>})}</g>
};

const ActionFX:React.FC<{scene:SceneData;frame:number}> = ({scene,frame})=>{
 const a=scene.action;
 return <g>
 {['glitch','pull','open','double'].includes(a)&&<g opacity={.25+Math.sin(frame*.7)*.12}><path d={`M0 ${260+drift(frame,80,22)} H1920`} stroke={C.teal} strokeWidth="5"/><path d={`M0 ${760+drift(frame,50,19)} H1920`} stroke={C.pink} strokeWidth="4"/></g>}
 {['mission','cancel','pause','connect'].includes(a)&&<g transform={`translate(${1180+drift(frame,8,35)} 360)`}><rect x="-120" y="-120" width="240" height="250" rx="24" fill="#0a1020" stroke={C.teal} strokeWidth="7"/><rect x="-92" y="-88" width="184" height="120" rx="8" fill="#17233a"/><path d="M-65 55 H65 M-65 82 H32" stroke={C.pink} strokeWidth="8"/></g>}
 {['sirens','chase','swerve','pressure','stop'].includes(a)&&<g opacity={.35+Math.sin(frame*.5)*.2}><path d="M0 0 L1920 1080 M1920 0 L0 1080" stroke={C.pink} strokeWidth="3" opacity=".35"/><rect width="1920" height="1080" fill={C.pink} opacity={.035+Math.sin(frame*.4)*.025}/></g>}
 {a==='open'&&<ellipse cx="960" cy="520" rx={180+Math.sin(frame*.2)*80} ry="310" fill="none" stroke={C.teal} strokeWidth="14" opacity=".8"/>}
 </g>
};

const Scene:React.FC<{scene:SceneData;index:number}> = ({scene,index})=>{
 const frame=useCurrentFrame();
 const local=frame-index*300;
 const t=local%300;
 const zoom=1.04+Math.sin(t/300*Math.PI)*.035;
 const pan=interpolate(t,[0,150,300],[-24,18,-10],clamp);
 const flash=interpolate(t,[0,8,18,280,299],[0,.22,0,0,.12],clamp);
 const beat=Math.min(2,Math.floor(t/100));
 const beatStart=beat*100;
 const cameraX=drift(t,8,170,index*11);
 return <AbsoluteFill style={{background:C.bg,overflow:'hidden'}}>
  <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
   <defs><filter id="blur"><feGaussianBlur stdDeviation="65"/></filter><linearGradient id="vignette" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#050610"/><stop offset=".5" stopColor="#11142a"/><stop offset="1" stopColor="#050610"/></linearGradient><radialGradient id="shade"><stop offset=".48" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".62"/></radialGradient></defs>
   <g transform={`translate(${cameraX+pan} 0) scale(${zoom}) translate(-960 -540)`}><SceneBackdrop location={scene.location} frame={t}/><Particles frame={t} hot={['glitch','pull','chase','open','jump'].includes(scene.action)}/><CharacterStage scene={scene} frame={t}/><ActionFX scene={scene} frame={t}/></g>
   <rect width="1920" height="1080" fill="url(#shade)"/>
   <KineticTitle text={scene.beatTitles[beat]} frame={frame} sceneFrame={t} beat={0}/>
   {t>100&&<g opacity={interpolate(t,[100,110],[0,1],clamp)}><rect x="120" y="860" width="560" height="8" rx="4" fill="#43445f"/><rect x="120" y="860" width={560*((t-100)/200)} height="8" rx="4" fill={C.pink}/></g>}
   <rect width="1920" height="1080" fill="#fff" opacity={flash}/>
   <text x="1780" y="1000" fill="#e8e8f4" fontSize="25" textAnchor="end" opacity=".42" fontFamily="Arial">ADRI / VICE CITY • {String(scene.id).padStart(2,'0')}</text>
  </svg>
 </AbsoluteFill>
};

export const WhatIfGTA6Film:React.FC = ()=>{
 const frame=useCurrentFrame();
 const index=Math.min(29,Math.floor(frame/300));
 const scene=scenes[index];
 const sceneFrame=frame-index*300;
 const fade=interpolate(sceneFrame,[0,10,288,300],[0,1,1,0],clamp);
 const cut=sceneFrame<10||sceneFrame>288;
 return <AbsoluteFill style={{background:C.bg}}>
  <Scene scene={scene} index={index}/>
  <AbsoluteFill style={{opacity:cut?1-fade:0,background:C.bg,pointerEvents:'none'}}/>
 </AbsoluteFill>
};
