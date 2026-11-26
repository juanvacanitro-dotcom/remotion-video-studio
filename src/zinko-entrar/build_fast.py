"""Build the V2 edit from source ranges; retain words and voice pitch.

No music. Source effects stay in the mix; all added effects are synthesized here.
The JSON frame map is shared by the footage, caption timing and text repairs.
"""
from pathlib import Path
import array, json, math, random, subprocess, wave

ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'public/zinko-entrar'
EDIT=json.loads((Path(__file__).parent/'fast-edit.json').read_text())
SR=48000
FPS=EDIT['fps']

for scene in EDIT['scenes']:
    n=scene['scene']; filters=[]; labels=[]
    for i,s in enumerate(scene['segments']):
        a,b,r,frames=s['sourceStart'],s['sourceEnd'],s['rate'],s['frames']
        d=frames/FPS
        filters.append(f'[0:v]trim=start={a}:end={b},setpts=(PTS-STARTPTS)/{r},fps={FPS},tpad=stop_mode=clone:stop_duration=0.1,trim=end_frame={frames},setpts=PTS-STARTPTS[v{i}]')
        filters.append(f'[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,atempo={r},apad,atrim=duration={d},afade=t=in:d=0.003,afade=t=out:st={d-.004}:d=0.004[a{i}]')
        labels.append(f'[v{i}][a{i}]')
    filters.append(''.join(labels)+f'concat=n={len(labels)}:v=1:a=1[v][a]')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(DEST/f'escena-{n:02d}.mp4'),'-filter_complex',';'.join(filters),'-map','[v]','-map','[a]','-c:v','libx264','-preset','fast','-crf','15','-pix_fmt','yuv420p','-c:a','aac','-b:a','256k','-ar',str(SR),'-movflags','+faststart',str(DEST/f'fast-{n:02d}.mp4')],check=True)
    print(f'Prepared scene {n}: {scene["frames"]} frames',flush=True)

# Short, varied accent sounds: low impacts, whips, electrical chirps and clicks.
# Nothing is downloaded, sampled from a song or synthesized as new speech.
events=[(0,'hit',.12),(.8,'click',.075),(1.47,'whip',.08),(2.17,'buzz',.10),
        (2.73,'click',.065),(3.5,'buzz',.09),(4.07,'hit',.17),(4.77,'whoosh',.12),
        (5.67,'hit',.10),(6.73,'portal',.13),(7.03,'hit',.13),(8.20,'click',.07),
        (9.73,'whip',.11),(10.63,'click',.07),(11.73,'pop',.12),(12.73,'hit',.17),
        (13.70,'tick',.09),(14.80,'hit',.12),(15.60,'pop',.08),(16.57,'whip',.08),
        (17.57,'hit',.12),(18.23,'tick',.10),(19.20,'whip',.09),(20.40,'hit',.13),
        (21.03,'buzz',.085),(21.73,'click',.07)]
samples=[0.0]*round(SR*EDIT['frames']/FPS)
rng=random.Random(233)
for start,kind,gain in events:
    dur={'hit':.24,'click':.065,'whip':.17,'buzz':.16,'whoosh':.30,'portal':.30,'pop':.12,'tick':.07}[kind]
    offset=round(start*SR);phase=0.;previous=0.
    for j in range(round(dur*SR)):
        if offset+j>=len(samples):break
        t=j/SR;p=t/dur;noise=rng.uniform(-1,1)
        if kind=='hit':
            phase+=2*math.pi*(48+105*math.exp(-22*t))/SR
            val=math.sin(phase)*math.exp(-18*t)+noise*.2*math.exp(-120*t)
        elif kind in ('whip','whoosh','portal'):
            env=math.sin(math.pi*p)**1.6
            phase+=2*math.pi*(170+1200*p*p)/SR
            val=(noise-previous)*.45*env+math.sin(phase)*.14*env
        elif kind=='buzz':
            gate=.5+.5*math.sin(2*math.pi*42*t)
            val=(noise*.55+math.sin(2*math.pi*(240*t+1200*t*t))*.25)*gate*math.sin(math.pi*p)
        elif kind=='pop':
            phase+=2*math.pi*(260+850*math.exp(-60*t))/SR
            val=math.sin(phase)*math.exp(-32*t)
        else:
            val=(noise*.25+math.sin(2*math.pi*(1050 if kind=='tick' else 650)*t)) * math.exp(-70*t)
        samples[offset+j]+=gain*val
        previous=noise
with wave.open(str(DEST/'fast-fx.wav'),'wb') as out:
    out.setparams((2,2,SR,0,'NONE','not compressed')); data=array.array('h')
    for value in samples:
        q=round(max(-.95,min(.95,value))*32767);data.extend((q,q))
    out.writeframes(data.tobytes())

args=['ffmpeg','-hide_banner','-loglevel','error','-y']
for n in range(1,4):args+=['-i',str(DEST/f'fast-{n:02d}.mp4')]
args+=['-i',str(DEST/'fast-fx.wav')]
filters=[]
for i,(scene,gain) in enumerate(zip(EDIT['scenes'],[-3.59,.06,-1.25])):
    filters.append(f'[{i}:a]atrim=duration={scene["frames"]/FPS},asetpts=PTS-STARTPTS,volume={gain}dB[a{i}]')
filters+=['[a0][a1][a2]concat=n=3:v=0:a=1[voice]',
          '[voice][3:a]amix=inputs=2:normalize=0,loudnorm=I=-15.5:TP=-1.5:LRA=8[mix]']
args+=['-filter_complex',';'.join(filters),'-map','[mix]','-t',str(EDIT['frames']/FPS),'-ar',str(SR),'-ac','2','-c:a','pcm_s16le',str(DEST/'fast-mix.wav')]
subprocess.run(args,check=True)
print(f'V2 mix ready: {EDIT["frames"]/FPS}s, pitch-preserved voice, {len(events)} sound accents',flush=True)
