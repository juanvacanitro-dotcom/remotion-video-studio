# ZINKO GTA 6 — Motion V3 (no supplied video clips)

## Composition
- Remotion composition: `GTA6ZinkoMotionV3`
- Entry: `src/gta6-zinko-v2/index.tsx`
- Duration: 180 seconds
- Output: 1920×1080, 30 fps, H.264 MP4

## Production approach
- Build every visual scene inside Remotion; do not download or use a user video-clips ZIP.
- Use the 18 Spanish narration tracks and the supplied sound-effects pack.
- Use original generated motion backplates and scene-specific SVG motifs: trophy, score ring, timeline, ranking bars, map, character pair, clock, review cards, controller, performance graph, car, coins, comparison split, verdict scale and end-screen cards.
- Use the project's mascot artwork in presenter cut-ins.
- Kinetic captions, punch-in movement, impact transitions, perspective panels and a metallic title sting.
- No official GTA footage, official game logo, Rockstar marks or copied TikTok footage.

- Official GTA VI screenshot B-roll is fetched at render time from Rockstar Games' official media gallery and used as brief, credited editorial cutaways. The screenshots remain Rockstar Games property; they are not redistributed as standalone assets.

## GTA Components research and adaptation
The external `echris6/gta-components` repository contains 126 standalone HyperFrames projects using HTML, GSAP and Three.js. It is not a Remotion package and does not include gameplay footage. Its MIT-licensed code was reviewed; rather than adding a second renderer, selected motion patterns were adapted into `GtaMotionKit.tsx` as native Remotion components. See the root `THIRD-PARTY-NOTICES.md`.

## Cloud rendering
- Preview workflow: `.github/workflows/render-gta6-zinko-v3-preview.yml`
- Full workflow: `.github/workflows/render-gta6-zinko-v3-full.yml`
- Preview trigger: `src/gta6-zinko-v2/RENDER-V3-PREVIEW.txt`
- Full render trigger: `src/gta6-zinko-v2/RENDER-V3-FULL.txt`
- Both V3 workflows stage only narration and sound effects; neither downloads video clips.
