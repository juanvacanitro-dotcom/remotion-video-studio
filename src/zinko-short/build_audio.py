"""Build the teaser from exact clauses of the creator's approved mixed voice.

No new voice, time stretching or rewritten spoken claims. Reproducible from
the approved repository assets. Outputs are generated, not committed.
"""
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / 'public/zinko-short'
DEST.mkdir(parents=True, exist_ok=True)
FPS = 30
EDITS = [
    ('hook', 20.8086, 23.5686, 86),
    ('world', 44.5010, 50.3592, 177),
    ('twist', 7.2660, 9.3060, 65),
    ('fps', 81.7458, 87.7358, 180),
    ('paradox', 141.1918, 143.7118, 79),
    ('question', 153.5124, 156.3524, 88),
    ('cta', 159.0324, 161.3124, 120),
]

source = json.loads((ROOT/'src/zinko-completo/timeline.json').read_text())
filters = [f'[0:a]asplit={len(EDITS)}' + ''.join(f'[s{i}]' for i in range(len(EDITS)))]
captions, manifest, cursor = {}, [], 0
for i, (name, start, end, frames) in enumerate(EDITS):
    dur = end-start
    filters.append(
        f'[s{i}]atrim=start={start}:end={end},asetpts=PTS-STARTPTS,'
        f'afade=t=in:d=0.005,afade=t=out:st={dur-0.009}:d=0.009,'
        f'apad,atrim=duration={frames/FPS}[p{i}]'
    )
    captions[name] = []
    for c in source['cues']:
        a, b = c['start']/FPS, c['end']/FPS
        if a >= start-0.065 and b <= end+0.065:
            text = c['text']
            if name == 'hook': text = '99 sobre 100\nen Metacritic'
            if name == 'fps' and '30 fotogramas' in text: text = '30 fotogramas\npor segundo.'
            if name == 'question' and '¿Qué nota' in text: text = '¿Qué nota\nle pondrías tú'
            captions[name].append({
                'text': text,
                'startMs': round(max(0,a-start)*1000),
                'endMs': round(min(dur,b-start)*1000),
                'timestampMs': None,
                'confidence': None,
            })
    manifest.append({'scene':name, 'sourceIn':start, 'sourceOut':end,
                     'startFrame':cursor, 'durationInFrames':frames})
    cursor += frames
filters.append(''.join(f'[p{i}]' for i in range(len(EDITS))) +
               f'concat=n={len(EDITS)}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11[a]')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',
    '-i',str(ROOT/'public/zinko-completo/audio.m4a'),
    '-filter_complex',';'.join(filters),'-map','[a]',
    '-ar','48000','-ac','2','-c:a','pcm_s16le',str(DEST/'voice.wav')],check=True)
(ROOT/'src/zinko-short/captions.json').write_text(json.dumps(captions,ensure_ascii=False,indent=2)+'\n')
(DEST/'edit-map.json').write_text(json.dumps({'frames':cursor,'fps':FPS,'edits':manifest},indent=2)+'\n')
print(json.dumps({'frames':cursor,'seconds':cursor/FPS,'audio':str(DEST/'voice.wav')}))
