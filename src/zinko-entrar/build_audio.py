"""Preserve all three original performances and balance their levels.

No speech replacement, time stretch or music. Only two quiet synthesized air
swipes support the joins between scenes. Original scene effects are retained.
"""
from pathlib import Path
import array,math,random,subprocess,wave

ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'public/zinko-entrar'
SR=48000
fx=[0.0]*(SR*30)
rng=random.Random(30)
for second in [9.78,19.78]:
    n=round(SR*.44); offset=round(second*SR); prev=0
    for i in range(n):
        p=i/n; noise=rng.uniform(-1,1)
        fx[offset+i]+=(noise-prev)*.045*math.sin(math.pi*p)**2
        prev=noise
with wave.open(str(DEST/'transition-fx.wav'),'wb') as wav:
    wav.setparams((2,2,SR,0,'NONE','not compressed'))
    samples=array.array('h')
    for v in fx:
        q=round(v*32767);samples.extend((q,q))
    wav.writeframes(samples.tobytes())

args=['ffmpeg','-hide_banner','-loglevel','error','-y']
for i in range(1,4):args+=['-i',str(DEST/f'escena-{i:02d}.mp4')]
args+=['-i',str(DEST/'transition-fx.wav')]
gain=[-3.59,.06,-1.25]
filters=[]
for i,g in enumerate(gain):
    filters.append(f'[{i}:a]atrim=duration=10,asetpts=PTS-STARTPTS,volume={g}dB,'
                   f'afade=t=in:d=0.004,afade=t=out:st=9.996:d=0.004[p{i}]')
filters+=['[p0][p1][p2]concat=n=3:v=0:a=1[voice]',
          '[voice][3:a]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=9[mix]']
args+=['-filter_complex',';'.join(filters),'-map','[mix]','-t','30','-ar',str(SR),'-ac','2','-c:a','pcm_s16le',str(DEST/'mix.wav')]
subprocess.run(args,check=True)
print('30-second original narration and effects mix ready')
