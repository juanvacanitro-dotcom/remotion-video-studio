from pathlib import Path
import subprocess,json,re,math
import numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d

import argparse
parser=argparse.ArgumentParser(description='Rebuild from the extracted voice, ASR timing, and supplied SFX.')
parser.add_argument('--work-dir',required=True)
parser.add_argument('--project-root',default=str(Path(__file__).resolve().parents[2]))
args=parser.parse_args()
B=Path(args.work_dir).resolve()
P=Path(args.project_root).resolve()
D=P/'public/zinko-completo'
R=48000
# Conservative clause boundaries around the supplied voice. No original narrator is mixed in.
ranges={
 1:[(0,3.24),(3.32,7.14),(7.30,9.34)],
 2:[(1.22,3.66),(3.98,7.24),(7.62,9.38)],
 3:[(0,3.40),(3.70,6.46),(6.60,9.68)],
 4:[(0,2.18),(2.62,5.63),(6.80,9.80)],
 5:[(0,3.24),(3.94,6.06),(6.52,9.86)],
 6:[(0,2.88),(3.18,6.64),(6.94,9.36)],
 7:[(0,3.22),(3.44,6.76),(7.00,9.52)],
 8:[(0,2.94),(3.18,5.90),(6.80,9.12)],
 9:[(0,7.24),(7.52,9.72)],
 10:[(0,1.48),(1.66,4.72),(5.02,7.82),(8.20,9.72)],
 11:[(.58,3.34),(3.76,6.44),(6.84,9.52)],
 12:[(0,3.12),(3.38,6.26),(6.76,9.50)],
 13:[(0,2.56),(3.56,6.88),(7.32,9.88)],
 14:[(0,3.92),(4.04,6.70),(7.00,9.72)],
 15:[(0,3.98),(4.12,7.76),(7.88,9.80)],
 16:[(0,1.50),(1.78,3.22),(3.42,7.16),(7.28,9.80)],
 17:[(0,3.72),(4.00,6.86),(7.10,9.80)],
 18:[(1.16,4.00),(4.54,6.96),(7.36,9.64)],
}
beats={4:[2.62,6.80],5:[3.94,6.52],6:[3.18,6.94],7:[3.44,7.00],8:[3.18,6.80],9:[2.4,4.45,7.52],10:[1.66,3.08,5.02,8.20],11:[3.76,6.84],12:[3.38,6.76],13:[3.56,5.22,7.32],14:[4.04,7.00],15:[4.12,7.88],16:[1.78,3.42,7.28],17:[2.50,4.00,7.10],18:[4.54,7.36]}
parts=[];segments=[];clips=[];cursor=0
for n in range(1,19):
 a=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(B/'voice'/f'{n:02}.mp3'),'-af','highpass=f=65,lowpass=f=14500','-ac','2','-ar',str(R),'-f','f32le','-']),np.float32).reshape(-1,2).copy()
 env=np.sqrt(uniform_filter1d(np.mean(a*a,axis=1),960)+1e-10)
 active=env>max(.012,float(env.max())*.12)
 level=np.sqrt(np.mean(a[active]**2));a*=.12/max(level,.02)
 clipstart=cursor
 for j,(st,en) in enumerate(ranges[n]):
  if j==0 and st==0:
   # Trim only the leading quiet lead-in, retaining 90 ms before detected speech.
   onset=np.where(env>max(.018,float(env.max())*.17))[0]
   if len(onset):st=min(.95,max(0,onset[0]/R-.09))
  audio=a[round(st*R):round(en*R)].copy();fade=round(.005*R)
  audio[:fade]*=np.linspace(0,1,fade)[:,None];audio[-fade:]*=np.linspace(1,0,fade)[:,None]
  seg={'clip':n,'in':round(st,4),'out':en,'timeline':round(cursor,4),'end':round(cursor+len(audio)/R,4)}
  segments.append(seg);parts.append(audio);cursor+=len(audio)/R
  gap=.13 if j<len(ranges[n])-1 else .16
  parts.append(np.zeros((round(gap*R),2),np.float32));cursor+=gap
 clips.append({'id':n,'start':round(clipstart*30),'end':round(cursor*30)})

def mapped(n,t):
 ss=[s for s in segments if s['clip']==n]
 for s in ss:
  if s['in']<=t<=s['out']:return s['timeline']+t-s['in']
 if t<ss[0]['in']:return ss[0]['timeline']
 for a,b in zip(ss,ss[1:]):
  if a['out']<t<b['in']:return (a['end']+b['timeline'])/2
 return ss[-1]['end']

for c in clips:c['beats']=[round(mapped(c['id'],t)*30)-c['start'] for t in beats.get(c['id'],[])]
raw=json.loads((B/'transcript.json').read_text())
retry=json.loads((B/'retry-transcript.json').read_text())
raw[0]['segments']+=retry['1'];raw[3]['segments']+=retry['4']
raw[0]['segments'][1]['words'][:1]=[{'word':'Es','start':3.4,'end':3.75},{'word':'GTA 6,','start':4.06,'end':5.06}]

def words_for(n):
 ws=[dict(w) for s in raw[n-1]['segments'] for w in s['words']]
 replacements={('record','récord'),('SGTA6','GTA 6'),('JTA','GTA'),('bienes','vienes'),('pecas','pegas'),('ventas','preventas')}
 for w in ws:
  w['word']=w['word'].strip()
  for old,new in replacements:
   w['word']=re.sub(r'\b'+old+r'\b',new,w['word'],flags=re.I)
  if n in [5,13,15]:w['word']=re.sub(r'\bcuatro\b','4',w['word']);w['word']=re.sub(r'\bcinco\b','5',w['word'])
  if n in [1,4,18]:w['word']=re.sub(r'\bseis\b','6',w['word'])
  if n==18:w['word']=w['word'].replace('cinco','Zinko').replace('tu,','tú,')
  if n==14 and w['word']=='esplo':w['word']=''
  if n==11 and w['word']=='entiroteos,':w['word']='en tiroteos,'
 for i in range(len(ws)-1):
  a,b=ws[i],ws[i+1]
  if (a['word'],b['word']) in [('veré','dicto.'),('no','tan'),('un','anime.'),('pondría','es'),('Take','-Two,')]:
   val={('veré','dicto.'):'veredicto.',('no','tan'):'notan',('un','anime.'):'unánime.',('pondría','es'):'pondrías',('Take','-Two,'):'Take-Two,'}[(a['word'],b['word'])]
   a['word']=val;a['end']=b['end'];b['word']=''
 return [w for w in ws if w['word']]

cues=[]
for n in range(1,19):
 ws=words_for(n);group=[]
 def flush():
  if not group:return
  text=' '.join(w['word'] for w in group)
  cues.append({'start':round(mapped(n,group[0]['start'])*30),'end':round(mapped(n,group[-1]['end']+.04)*30),'text':text,'clip':n})
  group.clear()
 for w in ws:
  if group and (len(' '.join(g['word'] for g in group)+' '+w['word'])>34 or len(group)>=5 or w['start']-group[-1]['end']>.30):flush()
  group.append(w)
  if re.search(r'[.!?,]$',w['word']) and len(group)>=2:flush()
 flush()
for a,b in zip(cues,cues[1:]):a['end']=min(a['end'],b['start'])

# The nine approved opening beats follow the new voice rather than fixed clip duration.
intro_seconds=[mapped(1,0),mapped(1,1.52),mapped(1,3.32),mapped(1,7.30),mapped(2,1.22),mapped(2,3.98),mapped(2,7.62),mapped(3,0),mapped(3,3.70),mapped(3,6.60),clips[2]['end']/30]
old=[0,42,95,214,278,358,460,515,617,702,807]
intro=[{'index':i,'start':round(intro_seconds[i]*30),'end':round(intro_seconds[i+1]*30),'originalDuration':old[i+1]-old[i]} for i in range(10)]
endcard_start=clips[-1]['start']+clips[-1]['beats'][0]
frames=max(math.ceil(cursor*30),endcard_start+450)
duration=frames/30
voice=np.zeros((round(duration*R),2),np.float32);x=np.concatenate(parts);voice[:len(x)]=x
wavfile.write(B/'dialogue.wav',R,voice)
sfx=np.zeros_like(voice)
sf=B.parent/'zinko-resenas/sfx/03_Efectos_Sonido'
cache={}
def sound(name,t,gain=.025,pan=0):
 if name not in cache:
  q=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(sf/name),'-ac','2','-ar',str(R),'-f','f32le','-']),np.float32).reshape(-1,2).copy();cache[name]=q/max(float(np.max(np.abs(q))),.001)
 a=cache[name]*gain;a=a.copy();a[:,0]*=1-.25*pan;a[:,1]*=1+.25*pan
 st=max(0,round(t*R));ln=min(len(a),len(sfx)-st)
 if ln>0:sfx[st:st+ln]+=a[:ln]
for i,e in enumerate(intro):
 t=e['start']/30
 sound('13_golpe_bajo.wav',t+.02,.038)
 if i:sound('04_whoosh.wav',max(0,t-.12),.028)
 sound('01_pop.wav',t+.22,.020)
for c in clips[3:]:
 t=c['start']/30
 sound('04_whoosh.wav',t-.11,.026)
 sound('13_golpe_bajo.wav',t+.02,.035)
 for j,beat in enumerate(c['beats']):
  at=t+beat/30
  sound('01_pop.wav' if j%2==0 else '20_click.wav',at+.07,.022,(-1 if j%2 else 1)*.5)
  if c['id'] in [6,7,11,13,17]:sound('11_swoosh.wav',at-.08,.020)
for c in [clips[3],clips[7],clips[13]]:sound('06_ding.wav',c['start']/30+c['beats'][0]/30+.25,.017)
sound('08_error.wav',mapped(10,3.08),.020)
sound('08_error.wav',mapped(5,6.70)+.3,.015)
sound('20_click.wav',mapped(15,7.98)+.1,.026)
sound('06_ding.wav',mapped(18,4.64)+.3,.019)
env=np.sqrt(uniform_filter1d(np.mean(voice**2,axis=1),2400)+1e-9)
sfx*=(.58+.42*np.exp(-env*25))[:,None]
mix=voice+sfx
wavfile.write(B/'mix.wav',R,mix)
r=subprocess.run(['ffmpeg','-hide_banner','-i',str(B/'mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
j=json.loads(re.search(r'\{\s*"input_i".*?\}',r.stderr,re.S).group())
flt=f"loudnorm=I=-16:TP=-1.5:LRA=8:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-v','error','-i',str(B/'mix.wav'),'-af',flt,'-ar',str(R),'-c:a','pcm_s24le','-y',str(B/'master.wav')],check=True)
subprocess.run(['ffmpeg','-v','error','-i',str(B/'master.wav'),'-c:a','aac','-b:a','256k','-movflags','+faststart','-y',str(D/'audio.m4a')],check=True)
manifest={'frames':frames,'duration':duration,'dialogueEnd':cursor,'endcardStart':endcard_start,'clips':clips,'intro':intro,'cues':cues,'segments':segments,'voiceSource':'voz.zip; 18 user-provided recordings','musicAdded':False,'generatedVoice':False}
(B/'edit-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(P/'src/zinko-completo/timeline.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(D/'edit-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps({'frames':frames,'duration':duration,'introEnd':clips[2]['end']/30,'clips':clips,'cueCount':len(cues)},ensure_ascii=False))
