# ZINKO Short V2 — ¿GTA 6 o vida adulta?

A comic micro-story about coming for chaos and finding the realities of car
repairs and everyday chores. It reserves the verdict for the complete analysis.
The earlier summary Short was rejected by the creator for copying the long
video's argument and feeling slow. Do not use that first Short as a style
reference or mark this new cut approved until the creator reviews it.

## Editorial decisions

- 15.6 seconds, 1080×1920, 30fps, nine distinct scenes, internal cuts and stamps.
- Fresh opening, comic setup, escalating receipts, a half-second reaction,
  a visual learning curve, and an unresolved question: realism or punishment?
- Original creator speech reordered from the approved long video's source;
  pitch-preserving tempo of 1.14–1.15×. No synthetic narration or new spoken claims.
- 28 original synthesized, action-specific effects: impacts, whips, engine,
  receipt hits, cash chimes, brake/scratch and choice ticks. No added music.
- Voice-triggered ducking keeps effects below speech. Final target −15 LUFS,
  maximum true peak −1.3dBTP.
- Real vertical cropping, custom paper/receipt scenes, collision crack,
  camera shake, bursts, flying cutouts, punch zooms and brief speed lines.
- Nico, source fonts, warm paper, yellow captions and extruded typography
  preserve ZINKO's identity. No long video's rendered scene is reused.
- CTA gives the long video a purpose: find the complete argument and verdict.
  Link the actual long upload using YouTube's related-video setting.

## Provenance

Voice and GTA assets: approved commit
`2b5b1f4aa4bd2dcca036e3b90db935863c0af10f`, with original asset-source records in
`public/zinko-completo/asset-sources.json`. The reaction is the creator-provided
`public/zinko-full/shock.mp4`, documented in `meme-sources.json`.
The car crack, bills, road and sound effects are editorial illustrations, not
gameplay evidence. Claims remain quotations from the provided analysis.

## Build

```bash
python3 src/zinko-short-v2/build_audio.py
npx tsc --noEmit
npx remotion render src/zinko-short-v2/index.tsx ZinkoShortV2 out/ZINKO-GTA6-Short-V2-Vida-Adulta.mp4 --concurrency=2 --crf=18 --pixel-format=yuv420p --audio-bitrate=256k
```

Keep the approved long and first Short separate. All nine scenes are registered
independently for later editing. Generated audio is reproducible and ignored.
