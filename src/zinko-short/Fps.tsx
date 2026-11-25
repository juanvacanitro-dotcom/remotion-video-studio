import React from 'react';
import {AbsoluteFill,CanvasImage,staticFile,useCurrentFrame} from 'remotion';
import {Paper,Label,CaptionLine,Credit,ORANGE,WHITE,INK,useFonts,ease} from './shared';

export const Fps=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill><Paper/>
   <Label text={f<90?'LA MÁS REPETIDA':'EN CONSOLAS'} y={240} size={90} color={WHITE} settled/>
   <Label text="30" y={430} size={360} color={ORANGE} delay={25}/>
   <Label text="FPS" y={830} size={155} color={WHITE} delay={40}/>
   {f>=90&&<><CanvasImage src={staticFile('zinko-full/ps5.webp')} style={{position:'absolute',left:195,top:1010,width:150,rotate:'-8deg',translate:`0px ${(1-ease((f-90)/14))*180}px`,filter:'drop-shadow(13px 15px 10px #0005)'}}/><CanvasImage src={staticFile('zinko-full/xbox.webp')} style={{position:'absolute',left:665,top:1050,width:185,rotate:'8deg',translate:`0px ${(1-ease((f-98)/14))*180}px`,filter:'drop-shadow(13px 15px 10px #0005)'}}/></>}
   {f<90&&<svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M180 1130H840" stroke={INK} strokeWidth="7"/>{[0,1,2,3,4,5,6,7,8,9,10,11].map(i=><path key={i} d={`M${210+i*54} 1098v64`} stroke={f>45+i*2?ORANGE:'#c8c3bd'} strokeWidth="15"/>)}</svg>}
   {f>=125&&<Label text="INCLUSO PS5 PRO" x={500} y={1335} size={65} angle={-3} delay={125} color={WHITE} width={790}/>}
   <CaptionLine scene="fps"/>
   <Credit>Modo de consola descrito en las reseñas del video</Credit>
 </AbsoluteFill>;
};
