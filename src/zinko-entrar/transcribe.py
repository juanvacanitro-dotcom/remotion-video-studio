"""Transcribe the three received clips without changing their narration."""
from pathlib import Path
import json
import subprocess
import numpy as np
from faster_whisper import WhisperModel

ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'src/zinko-entrar'
model=WhisperModel('base',device='cpu',compute_type='int8',cpu_threads=4)
clips=[]
for number in range(1,4):
    path=ROOT/f'public/zinko-entrar/escena-{number:02d}.mp4'
    decoded=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-ar','16000','-ac','1','-f','f32le','-'])
    audio=np.frombuffer(decoded,dtype=np.float32).copy()
    segments,info=model.transcribe(audio,language='es',beam_size=5,
        word_timestamps=True,vad_filter=True,initial_prompt='Zinko. GTA seis.')
    rows=[]
    for s in segments:
        rows.append({'start':s.start,'end':s.end,'text':s.text,
                     'words':[{'start':w.start,'end':w.end,'word':w.word,'probability':w.probability} for w in (s.words or [])]})
    clips.append({'number':number,'segments':rows})
    print(number,' '.join(s['text'].strip() for s in rows),flush=True)
(DEST/'transcript.json').write_text(json.dumps(clips,ensure_ascii=False,indent=2)+'\n')
