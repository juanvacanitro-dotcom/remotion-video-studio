# ¿Qué pasaría si entraras a GTA 6? — Avance 01

New long-form ZINKO project. The current deliverable contains only received
scenes 1–3: 30 seconds, 16:9, 1920×1080, 30fps, H.264/AAC. Original footage is
1280×720 at 24fps. The output scales the supplied animation and renders the new
type at 1080p; it does not create additional detail in the original footage.

## Received material

- `videos.zip`, Library `libfile_7c830477a99481918f8fe736bb4218d1`.
- `¿Qué pasaría si entraras a GTA 6 · Guion, assets y 30 escenas.docx`, Library
  `libfile_14bf8015732c81918c82c959f31f2f98`.
- Clip mapping: `1_516ee917.mp4` → `escena-01.mp4`, `2_6385e33f.mp4` →
  `escena-02.mp4`, `3_8aabb01e.mp4` → `escena-03.mp4`.
- `source-script.md` preserves the supplied document text.
- `scene-plan.json` inventories all 30 narration lines and identifies the
  three available sources. No footage or narration has been invented for 4–30.

The document has narration for all 30 scenes, but detailed generation prompts
end at scene 27. Scenes 28–30 have narration only. Source links supporting the
later factual claims are not included in the document; verification of those
claims remains pending before completing a factual final cut.

## Edit

- Keep the new project's midnight-neon look, Nico, narrative order and voices.
- Keep the source's hand-drawn headlines. Repair only the extra-letter typo in
  scene 2 with animated type and replace “the data stage” in scene 3 with a small
  ZINKO mark. The masks follow the specific text areas and leave Nico and the
  survival ring visible.
- Add ZINKO yellow captions with a dark outline, synchronized to detected words
  and proofread against the supplied narration. `transcript.json` retains ASR
  output; captions correct punctuation, “este aro”, and the duplicate final ASR
  word without modifying the spoken performance.
- Gentle camera emphasis follows the television's noise and suction gag.
- A neon swipe joins the room to the tunnel; a drawn circular iris joins the
  tunnel to the rules. Preserve all three complete ten-second performances.
- Balance scene loudness, retaining the source effects. Add only two quiet air
  swipes at scene joins. No music or synthetic voice.
- Preserve the illustrated survival ring already in the supplied animation.
  Follow its prescribed states as later sources arrive.

## Continue

Add each received source under `public/zinko-entrar/escena-NN.mp4`, then update
its status, inspect it against the corresponding narration, and add an authored
scene node. Do not fill missing scenes by duplicating existing clips. Keep this
project separate from the approved review video and the Short.

## Build

```bash
python3 src/zinko-entrar/build_audio.py
npx tsc --noEmit
npx remotion render src/zinko-entrar/index.tsx ZinkoEntrarAvance01 out/ZINKO-Entrar-GTA6-Avance-01.mp4 --concurrency=2 --crf=18 --pixel-format=yuv420p --audio-bitrate=256k
```

Transcription was performed once with faster-whisper base, Spanish, word
timestamps. The checked caption file is committed, so normal renders do not
download or run a speech model. There is no automatic YouTube publication.
