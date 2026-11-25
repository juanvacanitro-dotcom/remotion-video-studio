import React from 'react';
import {AbsoluteFill,CanvasImage,staticFile,useCurrentFrame} from 'remotion';
import {Paper,Label,Nico,Logo,CaptionLine,Arrow,WHITE,INK,Y,useFonts} from './shared';

export const CallToAction=()=>{
 useFonts();const f=useCurrentFrame();
 return <AbsoluteFill><Paper/>
   <Label text="MI VEREDICTO" y={235} size={115} color={WHITE} settled/>
   <Label text="EN EL COMPLETO" y={390} size={101} delay={6}/>
   <div style={{position:'absolute',left:105,top:665,width:790,height:445,padding:12,paddingBottom:22,background:WHITE,rotate:`${-4+Math.sin(f*.03)}deg`,boxShadow:`12px 18px 0 ${INK}`,overflow:'hidden'}}>
     <CanvasImage src={staticFile('zinko-completo/city.webp')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
     <div style={{position:'absolute',inset:12,background:'linear-gradient(transparent,#15121baa)'}}/>
     <div style={{position:'absolute',left:45,top:90,font:'80px ZinkoImpact',lineHeight:1.08,color:Y,WebkitTextStroke:`2px ${INK}`,paintOrder:'stroke fill',textShadow:`4px 6px 0 ${INK}`,rotate:'-3deg'}}>¿VALIÓ<br/>LA ESPERA?</div>
     <CanvasImage src={staticFile('zinko-proof/gta-logo.webp')} style={{position:'absolute',right:45,top:95,width:235,rotate:'7deg',filter:'drop-shadow(6px 8px 5px #0009)'}}/>
   </div>
   <Label text="TOCA EL VÍDEO\nRELACIONADO" y={1190} size={66} color={WHITE} angle={-2} delay={15}/>
   <Arrow y={1280}/><Nico x={820} y={1350} width={190} delay={12} angle={5}/>
   <CaptionLine scene="cta" y={1490}/>
   <div style={{position:'absolute',left:435,top:1670,font:'44px ZinkoImpact',color:INK,rotate:'-3deg'}}>ZINKO</div>
 </AbsoluteFill>;
};
