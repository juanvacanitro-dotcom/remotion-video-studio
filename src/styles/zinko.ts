export const zinko = {
  captions: {
    color: '#FFD52A',
    outline: '#080808',
    outlineWidth: 5,
    fontWeight: 900,
    maxWordsPerBeat: 5,
  },
  motion: {
    punchInScale: [1, 1.12, 1.2] as const,
    settleFrames: 8,
    whipFrames: 7,
    freezeFrameFrames: 5,
  },
  pacing: {
    // Starting ranges only; editorial timing follows the spoken phrase.
    hookCutSeconds: [0.6, 2.2] as const,
    normalShotSeconds: [1.2, 3.5] as const,
    holdForExplanationSeconds: [2.5, 5] as const,
  },
  audio: {
    preserveDialogue: true,
    backgroundMusicByDefault: false,
    duckEffectsUnderSpeech: true,
  },
} as const;
