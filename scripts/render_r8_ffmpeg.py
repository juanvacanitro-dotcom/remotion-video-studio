#!/usr/bin/env python3
import os, sys, json, math, glob, random, shutil, subprocess
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT=Path("work")
MEDIA=ROOT/"media"; ASSETS=ROOT/"assets"; STILLS=ROOT/"stills"; OUT=ROOT/"out"; CARDS=ROOT/"cards"; SEG=ROOT/"segments"
for p in [MEDIA,ASSETS,STILLS,OUT,CARDS,SEG]: p.mkdir(parents=True,exist_ok=True)
W,H,FPS=1920,1080,30
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf"
FONT_REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def run(cmd, quiet=False):
    if not quiet: print("RUN", " ".join(map(str,cmd))[:500], flush=True)
    subprocess.run(list(map(str,cmd)),check=True,stdout=subprocess.DEVNULL if quiet else None,stderr=subprocess.STDOUT if quiet else None)
def probe(p):
    try:
        x=subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(p)],text=True).strip()
        return float(x)
    except Exception: return 0.0
def font(size,bold=True):
    p=FONT if bold else FONT_REG
    return ImageFont.truetype(p,size)
def wrap_text(draw,text,fnt,maxw):
    words=text.split(); lines=[]; cur=""
    for word in words:
        test=(cur+" "+word).strip()
        if draw.textbbox((0,0),test,font=fnt,stroke_width=2)[2] <= maxw: cur=test
        else:
            if cur: lines.append(cur)
            cur=word
    if cur: lines.append(cur)
    return lines
def paper_texture(path):
    rng=np.random.default_rng(19)
    low=rng.normal(0,1,(90,160))
    low_img=Image.fromarray(np.uint8(np.clip((low-low.min())/(low.max()-low.min())*255,0,255))).resize((W,H),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(28))
    a=np.asarray(low_img).astype(np.float32)
    fine=rng.normal(0,2.8,(H,W))
    base=np.zeros((H,W,3),dtype=np.float32)
    base[:,:,0]=246+(a-128)*0.035+fine
    base[:,:,1]=243+(a-128)*0.035+fine
    base[:,:,2]=235+(a-128)*0.035+fine
    im=Image.fromarray(np.uint8(np.clip(base,0,255)),"RGB")
    d=ImageDraw.Draw(im,"RGBA")
    for i in range(70):
        x=random.randint(-100,W); y=random.randint(0,H); ln=random.randint(120,700)
        col=(110,100,80,random.randint(3,12))
        d.line((x,y,x+ln,y+random.randint(-22,22)),fill=col,width=random.randint(1,3))
    im=im.filter(ImageFilter.GaussianBlur(0.25))
    im.save(path,quality=94)
def make_nico(src,dst):
    im=Image.open(src).convert("RGB")
    arr=np.asarray(im).astype(np.float32)
    corners=np.array([arr[0,0],arr[0,-1],arr[-1,0],arr[-1,-1]])
    bg=corners.mean(axis=0)
    dist=np.sqrt(((arr-bg)**2).sum(axis=2))
    # Remove the deep indigo studio background while retaining the neon line art and glow.
    alpha=np.clip((dist-18)*5.4,0,255).astype(np.uint8)
    alpha=Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8))
    bbox=alpha.point(lambda v:255 if v>28 else 0).getbbox()
    if bbox: 
        pad=22; bbox=(max(0,bbox[0]-pad),max(0,bbox[1]-pad),min(im.width,bbox[2]+pad),min(im.height,bbox[3]+pad))
        im=im.crop(bbox); alpha=alpha.crop(bbox)
    # White sticker stroke and soft dark drop shadow.
    stroke=alpha.filter(ImageFilter.MaxFilter(19))
    shadow=stroke.filter(ImageFilter.GaussianBlur(13))
    canvas=Image.new("RGBA",im.size,(0,0,0,0))
    sh=Image.new("RGBA",im.size,(0,0,0,0)); sh.putalpha(shadow.point(lambda v:int(v*.65)))
    canvas.alpha_composite(sh,(0,10))
    white=Image.new("RGBA",im.size,(255,255,255,0)); white.putalpha(stroke)
    canvas.alpha_composite(white)
    fg=im.convert("RGBA"); fg.putalpha(alpha)
    canvas.alpha_composite(fg)
    canvas.save(dst)
def draw_center(draw,text,y,fnt,fill,stroke="#101018",sw=5):
    bb=draw.textbbox((0,0),text,font=fnt,stroke_width=sw)
    x=(W-(bb[2]-bb[0]))//2
    draw.text((x,y),text,font=fnt,fill=fill,stroke_width=sw,stroke_fill=stroke)
def make_card(name,title,subtitle="",accent="#FFD52E",nico=True,smalltag="ZINKO"):
    bgmap={"question":"Style-Key.jpg","zinko":"Sala-Gamer.jpg","two_questions":"Sala-Gamer.jpg","what_is":"Ciudad-Neon.jpg","gta5":"Escenario-Datos.jpg"}
    bgfile=ASSETS/bgmap.get(name,"Style-Key.jpg")
    if bgfile.exists():
        bg=Image.open(bgfile).convert("RGB").resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(1.4))
        tint=Image.new("RGB",(W,H),(7,6,24)); bg=Image.blend(bg,tint,0.28)
        base=bg.convert("RGBA")
    else:
        base=Image.open(ROOT/"paper.png").convert("RGBA")
    # tilted paper panel with a torn-looking irregular edge and shadow
    panel=Image.new("RGBA",(1160,650),(0,0,0,0))
    pd=ImageDraw.Draw(panel)
    pts=[(18,12),(1140,8),(1152,34),(1144,618),(1122,640),(35,644),(8,615),(14,40)]
    pd.polygon(pts,fill=(255,255,250,255))
    pd.line(pts+[pts[0]],fill=(222,216,205,255),width=3)
    shadow=Image.new("RGBA",panel.size,(0,0,0,0))
    shadow.putalpha(panel.getchannel("A").filter(ImageFilter.GaussianBlur(18)).point(lambda v:int(v*.28)))
    base.alpha_composite(shadow,(390,230))
    base.alpha_composite(panel.rotate(-1.5,expand=False),(380,210))
    d=ImageDraw.Draw(base)
    # tag strip
    d.rounded_rectangle((480,255,790,310),radius=14,fill=(255,213,46,255),outline=(15,15,20,255),width=4)
    d.text((510,263),smalltag,font=font(27),fill="#111018",stroke_width=1,stroke_fill="#111018")
    titlefont=font(104)
    lines=wrap_text(d,title,titlefont,1000)
    y=360
    for line in lines[:2]:
        draw_center(d,line,y,titlefont,accent,sw=7); y+=120
    if subtitle:
        sf=font(42)
        lines2=wrap_text(d,subtitle,sf,1000)
        for line in lines2[:2]:
            draw_center(d,line,y+10,sf,"#15151B",sw=2); y+=55
    if nico and (ROOT/"nico_cutout.png").exists():
        n=Image.open(ROOT/"nico_cutout.png").convert("RGBA")
        n.thumbnail((390,560),Image.Resampling.LANCZOS)
        base.alpha_composite(n,(1400,510))
    # tiny neon scribble accent
    d=ImageDraw.Draw(base)
    d.arc((1320,150,1580,410),190,330,fill="#FF4FA3",width=10)
    d.line((1350,425,1510,385,1590,420),fill="#39DDD8",width=8)
    base.convert("RGB").save(CARDS/f"{name}.jpg",quality=94)
def make_calendar():
    bgfile=ASSETS/"Ciudad-Neon.jpg"
    if bgfile.exists():
        bg=Image.open(bgfile).convert("RGB").resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
        im=Image.blend(bg,Image.new("RGB",(W,H),(8,7,24)),0.32).convert("RGBA")
    else: im=Image.open(ROOT/"paper.png").convert("RGBA")
    # big calendar card with a shadow
    card=Image.new("RGBA",(560,670),(0,0,0,0)); d=ImageDraw.Draw(card)
    d.rounded_rectangle((22,22,538,648),radius=22,fill="#FFFDF7",outline="#181820",width=7)
    d.rounded_rectangle((22,22,538,150),radius=22,fill="#FFD52E",outline="#181820",width=7)
    d.rectangle((22,110,538,150),fill="#FFD52E")
    d.text((95,55),"NOVIEMBRE",font=font(56),fill="#111018",stroke_width=1,stroke_fill="#111018")
    d.text((115,185),"19",font=font(260),fill="#111018",stroke_width=4,stroke_fill="#111018")
    d.text((180,500),"2026",font=font(64),fill="#FF4FA3",stroke_width=2,stroke_fill="#111018")
    # ring holes
    for x in (145,415):
        d.ellipse((x-18,0,x+18,60),fill="#171720")
    shadow=Image.new("RGBA",card.size,(0,0,0,0)); shadow.putalpha(card.getchannel("A").filter(ImageFilter.GaussianBlur(22)).point(lambda v:int(v*.35)))
    im.alpha_composite(shadow,(690,210)); im.alpha_composite(card.rotate(-4,expand=False),(680,185))
    n=Image.open(ROOT/"nico_cutout.png").convert("RGBA"); n.thumbnail((470,650),Image.Resampling.LANCZOS); im.alpha_composite(n,(1300,400))
    im.convert("RGB").save(CARDS/"calendar.jpg",quality=94)
def make_chart():
    bgfile=ASSETS/"Escenario-Datos.jpg"
    if bgfile.exists():
        bg=Image.open(bgfile).convert("RGB").resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(1.0))
        im=Image.blend(bg,Image.new("RGB",(W,H),(7,6,24)),0.28).convert("RGBA")
    else: im=Image.open(ROOT/"paper.png").convert("RGBA")
    d=ImageDraw.Draw(im)
    d.rounded_rectangle((260,170,1650,900),radius=28,fill="#0C0A20",outline="#39DDD8",width=8)
    d.text((390,240),"GTA V",font=font(110),fill="#FFD52E",stroke_width=8,stroke_fill="#090914")
    d.text((400,390),"EL FENÓMENO QUE LO CAMBIÓ TODO",font=font(42),fill="#FFFFFF",stroke_width=2,stroke_fill="#090914")
    base_y=800; xs=[520,760,1000,1240]; heights=[130,220,330,470]
    for i,(x,h) in enumerate(zip(xs,heights)):
        col="#FF8A32" if i==3 else "#39DDD8"
        d.rounded_rectangle((x,base_y-h,x+130,base_y),radius=16,fill=col,outline="#FFFFFF",width=5)
    d.text((1390,250),"★",font=font(170),fill="#FFD52E",stroke_width=6,stroke_fill="#FFFFFF")
    n=Image.open(ROOT/"nico_cutout.png").convert("RGBA"); n.thumbnail((330,470),Image.Resampling.LANCZOS); im.alpha_composite(n,(1450,590))
    im.convert("RGB").save(CARDS/"chart.jpg",quality=94)
def make_title_logo():
    im=Image.new("RGBA",(700,230),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((8,8,692,222),radius=24,fill=(8,8,20,225),outline=(255,255,255,255),width=5)
    d.text((40,22),"GRAND THEFT",font=font(48),fill="#FFFFFF",stroke_width=3,stroke_fill="#090914")
    d.text((40,83),"AUTO",font=font(85),fill="#FFFFFF",stroke_width=5,stroke_fill="#090914")
    d.text((360,70),"VI",font=font(105),fill="#FFD52E",stroke_width=5,stroke_fill="#090914")
    im.save(ROOT/"gta_logo.png")
def transcribe_and_ass(audio_files):
    try:
        from faster_whisper import WhisperModel
        model=WhisperModel("base",device="cpu",compute_type="int8")
        all_events=[]; offset=0.0
        for i,p in enumerate(audio_files):
            segs,_=model.transcribe(str(p),language="es",word_timestamps=True,beam_size=3,vad_filter=False)
            words=[]
            for seg in segs:
                for w in (seg.words or []):
                    txt=w.word.strip()
                    if txt: words.append((max(0,w.start),max(w.start+.03,w.end),txt))
            print("TRANSCRIPT",i+1," ".join(w[2] for w in words),flush=True)
            # group into 3-4 word kinetic subtitle blocks
            k=0
            while k<len(words):
                group=words[k:k+4]
                start=offset+group[0][0]; end=offset+group[-1][1]+.20
                lines=[]
                for q in range(0,len(group),2):
                    lines.append(" ".join(x[2] for x in group[q:q+2]))
                karaoke=[]
                for q,(a,b,txt) in enumerate(group):
                    cs=max(1,int((b-a)*100))
                    karaoke.append(r"{\k%d}%s"%(cs,txt.replace("{","").replace("}","")))
                txt=" ".join(karaoke[:2])
                if len(karaoke)>2: txt+="\\N"+" ".join(karaoke[2:])
                all_events.append((start,end,txt))
                k+=4
            offset+=probe(p)
        header="""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,DejaVu Sans,58,&H0000D8FF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,1,0,1,6,3,2,80,80,70,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
        def ts(t):
            cs=int(round(t*100)); h=cs//360000; m=(cs//6000)%60; s=(cs//100)%60; c=cs%100
            return f"{h}:{m:02d}:{s:02d}.{c:02d}"
        with open(ROOT/"subtitles.ass","w",encoding="utf-8") as f:
            f.write(header)
            for a,b,t in all_events:
                f.write(f"Dialogue: 0,{ts(a)},{ts(b)},Default,,0,0,0,,{t}\n")
        return True
    except Exception as e:
        print("WHISPER_FALLBACK",repr(e),flush=True)
        (ROOT/"subtitles.ass").write_text("[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,DejaVu Sans,58,&H0000D8FF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,1,0,1,6,3,2,80,80,70,1\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n",encoding="utf-8")
        return False
def make_cut(src,start,dur,out,nico=False,logo=False,zoomdir=1):
    src=Path(src); start=max(0,float(start)); dur=max(.12,float(dur))
    if not src.exists(): raise FileNotFoundError(src)
    sd=probe(src)
    if sd>0 and start+dur>sd-.03:
        start=(start % max(.1,sd-dur-.04))
    base_vf="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,eq=contrast=1.10:saturation=1.18:gamma=0.98,unsharp=5:5:0.55,zoompan=z='min(zoom+0.0012,1.075)':x='iw/2-(iw/zoom/2)+sin(on/11)*13':y='ih/2-(ih/zoom/2)+cos(on/15)*9':d=1:s=1920x1080:fps=30,setsar=1"
    if nico:
        filt=f"[0:v]{base_vf}[bg];[1:v]scale=430:-1,format=rgba[st];[bg][st]overlay=x='W-w-90+18*sin(t*4)':y='H-h-35+10*sin(t*5)':enable='between(t,0.08,{max(.1,dur-.05):.3f})':shortest=1,format=yuv420p[v]"
        cmd=["ffmpeg","-y","-ss",str(start),"-i",str(src),"-loop","1","-i",str(ROOT/"nico_cutout.png"),"-t",str(dur),"-filter_complex",filt,"-map","[v]","-an","-r",str(FPS),"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",str(out)]
    else:
        vf=base_vf
        if logo:
            vf+=",drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf:text='GTA VI':x=68:y=55:fontsize=66:fontcolor=white:borderw=5:bordercolor=black:shadowx=4:shadowy=4"
        cmd=["ffmpeg","-y","-ss",str(start),"-i",str(src),"-t",str(dur),"-vf",vf,"-an","-r",str(FPS),"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",str(out)]
    run(cmd,quiet=True)
def make_card_cut(card,dur,out):
    vf="zoompan=z='min(zoom+0.0007,1.045)':x='iw/2-(iw/zoom/2)+sin(on/20)*6':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,eq=contrast=1.02:saturation=1.02,setsar=1,format=yuv420p"
    run(["ffmpeg","-y","-loop","1","-i",str(card),"-t",str(dur),"-vf",vf,"-an","-r",str(FPS),"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",str(out)],quiet=True)
def make_still_cut(src,dur,out,nico=False,logo=False):
    src=Path(src)
    base_vf="scale=2300:1294:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0014,1.10)':x='iw/2-(iw/zoom/2)+sin(on/13)*18':y='ih/2-(ih/zoom/2)+cos(on/17)*10':d=1:s=1920x1080:fps=30,eq=contrast=1.12:saturation=1.20:gamma=0.98,unsharp=5:5:0.5,setsar=1"
    if nico:
        filt=f"[0:v]{base_vf}[bg];[1:v]scale=430:-1,format=rgba[st];[bg][st]overlay=x='W-w-90+18*sin(t*4)':y='H-h-35+10*sin(t*5)':enable='between(t,0.08,{max(.1,dur-.05):.3f})':shortest=1,format=yuv420p[v]"
        cmd=["ffmpeg","-y","-loop","1","-i",str(src),"-loop","1","-i",str(ROOT/"nico_cutout.png"),"-t",str(dur),"-filter_complex",filt,"-map","[v]","-an","-r",str(FPS),"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",str(out)]
    else:
        vf=base_vf
        if logo:
            vf+=",drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf:text='GTA VI':x=68:y=55:fontsize=66:fontcolor=white:borderw=5:bordercolor=black:shadowx=4:shadowy=4"
        cmd=["ffmpeg","-y","-loop","1","-i",str(src),"-t",str(dur),"-vf",vf,"-an","-r",str(FPS),"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",str(out)]
    run(cmd,quiet=True)

def main():
    # Prepare the user's own visual identity.
    nico_src=ASSETS/"Nico.jpg"
    if not nico_src.exists(): nico_src=ASSETS/"nico.jpg"
    make_nico(nico_src,ROOT/"nico_cutout.png")
    paper_texture(ROOT/"paper.png"); make_title_logo()
    make_card("question","¿SERÁ UN ÉXITO?","LA EXPECTATIVA ES ENORME",accent="#FFD52E",smalltag="GTA VI")
    make_card("zinko","ZINKO","EL CANAL DE LA CURIOSIDAD",accent="#FFD52E",smalltag="BIENVENIDO")
    make_card("two_questions","2 PREGUNTAS","SOBRE GRAND THEFT AUTO VI",accent="#FF4FA3",smalltag="HOY EN ZINKO")
    make_card("what_is","¿QUÉ ES GTA VI?","VICE CITY · LEONIDA",accent="#39DDD8",smalltag="EXPLICAMOS")
    make_card("gta5","GTA V","EL JUEGO QUE LO EMPEZÓ TODO",accent="#FFD52E",smalltag="LA SAGA")
    make_calendar(); make_chart()
    # Resolve sources.
    def first(patterns):
        for pat in patterns:
            xs=glob.glob(str(pat))
            if xs: return Path(sorted(xs)[0])
        return None
    gta6=first([MEDIA/"gta6_trailer2.mp4",MEDIA/"gta6_trailer2.*",MEDIA/"GTAVI_Trailer_2.mp4",ROOT/"rockstar"/"clips"/"GTAVI_Official_Cover_Art_Landscape.mp4"])
    gta5=first([MEDIA/"gta5_trailer.mp4",MEDIA/"gta5_trailer.*"])
    if gta6 is None: gta6=first([ROOT/"rockstar"/"clips"/"GTAVI_Official_Cover_Art_Landscape.mp4",ROOT/"lineart"/"Clip03.mp4"])
    if gta5 is None: gta5=gta6
    stills={p.stem:p for p in STILLS.glob("*.jpg")}
    def still(name): return stills.get(name) or next(iter(stills.values()))
    if gta6 is None or gta5 is None: raise RuntimeError("No GTA VI/GTA V video source was downloaded.")
    # Official short character clips and user's own reaction assets.
    rj=ROOT/"rockstar"/"clips"
    jason=first([rj/"Jason_Duval_Video_Clip.mp4"]) or gta6
    lucia=first([rj/"Lucia_Caminos_Video_Clip.mp4"]) or gta6
    def getclip(name, fallback):
        p=ROOT/"clips"/name
        return p if p.exists() else fallback
    memes={
      "reaction":getclip("02.mp4",gta6),
      "streamer":getclip("13.mp4",gta6),
      "family":getclip("18.mp4",gta6),
      "cj":getclip("22.mp4",gta6),
      "kid":getclip("24.mp4",gta6)
    }
    line1=ROOT/"lineart"/"Clip01.mp4"; line2=ROOT/"lineart"/"Clip02.mp4"; line3=ROOT/"lineart"/"Clip03.mp4"
    voices=[MEDIA/f"voice-{i}.mp3" for i in range(1,5)]
    for p in voices:
        if not p.exists(): raise FileNotFoundError(p)
    transcribe_and_ass(voices)
    durations=[probe(p) for p in voices]
    print("VOICE_DURATIONS",durations,"TOTAL",sum(durations),flush=True)
    # Every cut is a separate FFmpeg render. The order mirrors R7: real gameplay,
    # paper cut-ins, Nico sticker reactions, quick meme punches, then back to footage.
    plans=[
      [
       ("v",gta6,4.0,1.22,True,True),("v",gta6,18.0,1.05,False,False),
       ("v",lucia,0.0,.72,True,False),("card",CARDS/"calendar.jpg",0,1.45,False,False),
       ("v",gta6,33.0,1.08,True,False),("v",gta6,49.0,1.00,False,False),
       ("v",memes["reaction"],.4,.62,False,False),("v",gta6,68.0,1.15,True,False),
       ("card",CARDS/"question.jpg",0,1.42,False,False),("v",gta6,86.0,1.55,True,False)
      ],
      [
       ("card",CARDS/"zinko.jpg",0,1.65,False,False),("v",gta6,98.0,1.10,True,False),
       ("v",jason,0,.70,True,False),("v",gta6,112.0,1.08,False,False),
       ("v",memes["streamer"],.6,.62,False,False),("v",gta6,126.0,1.08,True,False),
       ("v",line1,1.0,1.05,False,False),("card",CARDS/"two_questions.jpg",0,1.48,False,False),
       ("v",gta6,139.0,1.05,True,False),("v",memes["family"],1.2,.58,False,False),
       ("v",gta6,151.0,.60,False,False)
      ],
      [
       ("v",gta6,9.0,1.10,True,False),("v",lucia,0,.72,False,False),
       ("v",gta6,26.0,1.12,True,False),("card",CARDS/"what_is.jpg",0,1.40,False,False),
       ("v",gta6,43.0,1.10,False,False),("v",line3,1.4,1.00,True,False),
       ("v",gta6,60.0,1.12,False,False),("card",CARDS/"calendar.jpg",0,1.18,False,False),
       ("v",memes["cj"],.8,.62,False,False),("v",gta6,78.0,.72,True,False)
      ],
      [
       ("v",gta5,3.0,1.15,True,False),("v",gta5,10.0,1.10,False,False),
       ("v",gta5,18.0,1.10,True,False),("v",memes["kid"],.4,.60,False,False),
       ("v",gta5,28.0,1.15,False,False),("card",CARDS/"gta5.jpg",0,1.55,False,False),
       ("v",gta5,39.0,1.10,True,False),("v",gta5,51.0,1.10,False,False),
       ("card",CARDS/"chart.jpg",0,1.50,False,False),("v",gta5,62.0,0.92,True,False)
      ]
    ]
    # Render each scene's clips, proportionally stretching the last planned beat to
    # match its actual narration duration exactly (no clipped voice).
    scene_files=[]; global_offset=0.0; sfx_events=[]
    for si,(plan,target) in enumerate(zip(plans,durations),1):
        # Reserve each planned duration, scale to voice length.
        weights=[max(.25,x[3]) for x in plan]
        total=sum(weights); segdur=[target*w/total for w in weights]
        for k,(spec,dur) in enumerate(zip(plan,segdur)):
            typ,src,start,_,nico,logo=spec
            out=SEG/f"s{si}_{k:02d}.mp4"
            if typ=="card": make_card_cut(src,dur,out)
            elif typ=="img": make_still_cut(src,dur,out,nico=nico,logo=(logo or (si==1 and k==0)))
            else: make_cut(src,start,dur,out,nico=nico,logo=(logo or (si==1 and k==0)))
            scene_files.append(out)
            if k in (0,3,6): sfx_events.append(global_offset+sum(segdur[:k]))
        global_offset+=target
        print("SCENE_RENDERED",si,"duration",round(target,3),"cuts",len(plan),flush=True)
    concat=ROOT/"video_concat.txt"
    concat.write_text("".join("file '"+str(p.resolve())+"'\n" for p in scene_files),encoding="utf-8")
    run(["ffmpeg","-y","-f","concat","-safe","0","-i",str(concat),"-an","-c:v","libx264","-preset","veryfast","-crf","18","-pix_fmt","yuv420p",str(ROOT/"picture.mp4")],quiet=True)
    # Normalize and join all four narration files in order.
    norm=[]
    for i,p in enumerate(voices,1):
        q=MEDIA/f"voice-{i}.wav"
        run(["ffmpeg","-y","-i",str(p),"-af","loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000","-ar","48000","-ac","2","-c:a","pcm_s16le",str(q)],quiet=True); norm.append(q)
    lst=ROOT/"audio_concat.txt"; lst.write_text("".join("file '"+str(p.resolve())+"'\n" for p in norm),encoding="utf-8")
    run(["ffmpeg","-y","-f","concat","-safe","0","-i",str(lst),"-c:a","pcm_s16le",str(ROOT/"voice.wav")],quiet=True)
    # Add a few restrained impacts/whooshes from the user's sound-effects pack.
    sfx=sorted([p for p in (ROOT/"sfx").rglob("*") if p.suffix.lower() in (".wav",".mp3",".ogg",".m4a")])
    audio_in=["-i",str(ROOT/"voice.wav")]; mix="[0:a]volume=1.0[v]"
    labels=["[v]"]
    if sfx:
        chosen=sfx[:min(6,len(sfx))]
        parts=[]
        for i,p in enumerate(chosen,1):
            audio_in += ["-i",str(p)]
            at=sfx_events[min(i-1,len(sfx_events)-1)] if sfx_events else i*4.0
            delay=int(at*1000)
            label=f"s{i}"
            parts.append(f"[{i}:a]atrim=0:1.3,afade=t=out:st=0.85:d=0.4,volume=0.20,adelay={delay}|{delay}[{label}]")
            labels.append(f"[{label}]")
        mix=";".join(parts)+f";[0:a]volume=1.0[v];"+"".join(labels)+"amix=inputs="+str(len(labels))+":duration=first:dropout_transition=0:normalize=0[a]"
        audio_out=ROOT/"mix.wav"
        run(["ffmpeg","-y",*audio_in,"-filter_complex",mix,"-map","[a]","-ar","48000","-ac","2",str(audio_out)],quiet=True)
    else:
        audio_out=ROOT/"voice.wav"
    # Burn word-synced captions and finish.
    vf=f"subtitles={ROOT/'subtitles.ass'}:fontsdir=/usr/share/fonts/truetype/dejavu"
    final=OUT/"GTA6-ZINKO-R8-Scenes-1-4-FFmpeg.mp4"
    run(["ffmpeg","-y","-i",str(ROOT/"picture.mp4"),"-i",str(audio_out),"-vf",vf,"-map","0:v:0","-map","1:a:0","-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p","-r",str(FPS),"-c:a","aac","-b:a","192k","-ar","48000","-shortest","-movflags","+faststart",str(final)])
    print("FINAL_FILE",final,"SIZE",final.stat().st_size,"DURATION",probe(final),flush=True)
    run(["ffmpeg","-y","-ss","2","-i",str(final),"-frames:v","1","-vf","scale=960:540",str(OUT/"preview.jpg")],quiet=True)
if __name__=="__main__": main()
