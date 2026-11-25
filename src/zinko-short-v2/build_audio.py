"""A new comic micro-story, using the creator's voice and original synthesized SFX.

Speech is pitch-preserving at 1.14–1.15x. No voice cloning, music or sampled meme
audio. Every sound below is synthesized for the corresponding on-screen action.
"""
from pathlib import Path
import array
import json
import math
import random
import subprocess
import wave

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / 'public/zinko-short-v2'
DEST.mkdir(parents=True, exist_ok=True)
FPS, SR, FRAMES = 30, 48000, 468
EDITS = [
    # name, source in, source out, destination frame, speed
    ('hook', 112.7434, 115.3034, 0, 1.14),
    ('crash', 109.2934, 110.7300, 96, 1.15),
    ('bills', 110.9000, 112.6134, 138, 1.15),
    ('realism', 106.6596, 109.1634, 204, 1.14),
    ('you', 150.6524, 153.3524, 310, 1.14),
    ('cta', 159.0324, 161.3124, 384, 1.14),
]
source = json.loads((ROOT / 'src/zinko-completo/timeline.json').read_text())
filters = [f'[0:a]asplit={len(EDITS)}'+''.join(f'[s{i}]' for i in range(len(EDITS)))]
captions, manifest = [], []
for i, (name, start, end, frame, rate) in enumerate(EDITS):
    duration = (end-start)/rate
    filters.append(f'[s{i}]atrim=start={start}:end={end},asetpts=PTS-STARTPTS,'
                   f'atempo={rate},afade=t=in:d=0.004,afade=t=out:st={duration-.008}:d=0.008,'
                   f'adelay={round(frame/FPS*1000)}:all=1[p{i}]')
    for cue in source['cues']:
        a, b = cue['start']/FPS, cue['end']/FPS
        if a >= start-.07 and b <= end+.07:
            text = cue['text'].replace('Realismo','realismo')
            if name == 'realism':
                text = text.replace('Y el realismo tiene curva','Y el realismo\ntiene curva')
            if name == 'bills':
                if text == 'a día.':
                    continue
                text = 'gastos y tareas\ndel día a día.'
                b = 3374/FPS
            captions.append({'text':text,
                             'startMs':round((frame/FPS+max(0,a-start)/rate)*1000),
                             'endMs':round((frame/FPS+min(end-start,b-start)/rate)*1000),
                             'timestampMs':None,'confidence':None})
    manifest.append({'scene':name,'sourceIn':start,'sourceOut':end,'startFrame':frame,'rate':rate})
filters.append(''.join(f'[p{i}]' for i in range(len(EDITS)))+
               f'amix=inputs={len(EDITS)}:normalize=0,apad,atrim=duration={FRAMES/FPS},'
               'loudnorm=I=-17:TP=-2:LRA=9[voice]')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',
               '-i',str(ROOT/'public/zinko-completo/audio.m4a'),
               '-filter_complex',';'.join(filters),'-map','[voice]',
               '-ar',str(SR),'-ac','2','-c:a','pcm_s16le',str(DEST/'voice.wav')],check=True)

# Punches, swishes, mechanical hits, receipts and a brief brake/scratch.
rng = random.Random(20261125)
sound = [0.0]*round(FRAMES/FPS*SR)
events = []
def effect(frame, kind, level=.22, duration=.24):
    offset = round(frame/FPS*SR)
    events.append({'frame':frame,'type':kind,'duration':duration})
    phase=0.0
    previous=0.0
    for i in range(round(duration*SR)):
        t=i/SR
        p=t/duration
        noise=rng.uniform(-1,1)
        if kind=='boom':
            phase += 2*math.pi*(47+105*math.exp(-t*30))/SR
            x=(math.sin(phase)*math.exp(-t*11)+noise*.30*math.exp(-t*70))*min(1,t/.003)
        elif kind=='whip':
            x=(noise-previous)*.55*(math.sin(math.pi*p)**1.9)
            previous=noise
        elif kind=='cash':
            x=(math.sin(2*math.pi*1440*t)+.5*math.sin(2*math.pi*2160*t))*math.exp(-t*18)*min(1,t/.002)
        elif kind=='paper':
            x=noise*math.exp(-t*25)*(1+.45*math.sin(2*math.pi*90*t))
        elif kind=='scratch':
            phase += 2*math.pi*(1700*(1-p)**2+120+180*math.sin(2*math.pi*13*t))/SR
            x=(math.sin(phase)*.6+noise*.25)*(math.sin(math.pi*p)**.5)
        elif kind=='motor':
            phase += 2*math.pi*(80+360*p)/SR
            x=(math.sin(phase)+.35*math.sin(2*phase)+.15*noise)*math.sin(math.pi*p)
        else:
            x=math.sin(2*math.pi*(330+800*p)*t)*math.exp(-t*23)
        j=offset+i
        if j<len(sound): sound[j]+=x*level

effect(0,'boom',.31,.42)
effect(12,'whip',.18,.15)
effect(25,'boom',.25,.29)
effect(48,'paper',.12,.15)
effect(69,'whip',.24,.23)
effect(72,'motor',.22,.78)
effect(81,'whip',.18,.18)
effect(96,'boom',.38,.40)
effect(99,'paper',.17,.30)
effect(118,'paper',.18,.14)
effect(138,'cash',.16,.32)
effect(151,'cash',.14,.30)
effect(165,'paper',.19,.23)
effect(177,'cash',.17,.27)
effect(186,'scratch',.25,.48)
effect(202,'whip',.18,.18)
effect(204,'boom',.23,.33)
effect(228,'tick',.11,.15)
effect(247,'tick',.12,.15)
effect(274,'boom',.26,.32)
effect(289,'paper',.19,.18)
effect(307,'whip',.18,.19)
effect(310,'boom',.22,.30)
effect(344,'paper',.17,.20)
effect(381,'whip',.22,.20)
effect(384,'boom',.25,.40)
effect(400,'paper',.13,.21)
effect(430,'cash',.11,.25)
with wave.open(str(DEST/'effects.wav'),'wb') as wav:
    wav.setparams((2,2,SR,0,'NONE','not compressed'))
    pcm=array.array('h')
    for x in sound:
        q=round(max(-.95,min(.95,x))*32767)
        pcm.extend((q,q))
    wav.writeframes(pcm.tobytes())

subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',
    '-i',str(DEST/'voice.wav'),'-i',str(DEST/'effects.wav'),
    '-filter_complex','[0:a]asplit=2[v][key];[1:a][key]sidechaincompress=threshold=0.032:ratio=4:attack=4:release=70[fx];'
    '[v][fx]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.3:LRA=8[mix]',
    '-map','[mix]','-ar',str(SR),'-ac','2','-c:a','pcm_s16le',str(DEST/'mix.wav')],check=True)
(ROOT/'src/zinko-short-v2/captions.json').write_text(json.dumps(captions,ensure_ascii=False,indent=2)+'\n')
(DEST/'edit-map.json').write_text(json.dumps({'frames':FRAMES,'fps':FPS,'edits':manifest,'sfx':events},indent=2)+'\n')
print(json.dumps({'frames':FRAMES,'duration':FRAMES/FPS,'soundEffects':len(events)}))
