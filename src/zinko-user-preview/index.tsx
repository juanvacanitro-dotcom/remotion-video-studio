import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  registerRoot,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const FPS = 30;
const INK = '#090916';
const PINK = '#ff2c9c';
const TEAL = '#20f2e6';
const YELLOW = '#ffed23';
const WHITE = '#fffefa';
const userFile = (name: string) => staticFile('zinko-user-preview/' + name);
const sourceFile = (name: string) => staticFile('zinko-proof/' + name);
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const x = clamp(n);
  return x * x * (3 - 2 * x);
};
const pop = (frame: number, damping = 13) =>
  spring({frame: Math.max(0, frame), fps: FPS, config: {mass: 0.72, damping, stiffness: 175}});

function pulseAt(frame: number, beats: number[], spread = 7) {
  return Math.max(
    0,
    ...beats.map((beat) => {
      const d = Math.abs(frame - beat);
      return d >= spread ? 0 : (1 - d / spread) * (1 - d / spread);
    }),
  );
}

function BaseClip({name, sceneTwo = false}: {name: string; sceneTwo?: boolean}) {
  const f = useCurrentFrame();
  const beats = sceneTwo ? [0, 18, 52, 108, 135] : [0, 46, 72, 105, 139, 199, 232, 270, 294];
  const hit = pulseAt(f, beats, 7);
  const zoom = sceneTwo
    ? 1.035 + 0.018 * ease(f / 150) + 0.006 * Math.sin(f * 0.075)
    : 1.035 + 0.032 * ease(f / 300) + 0.006 * Math.sin(f * 0.052);
  const x = (sceneTwo ? 5 : 7) * Math.sin(f * 0.037) + hit * 5 * Math.sin(f * 2.4);
  const y = 4 * Math.cos(f * 0.031) + hit * 4 * Math.cos(f * 2.1);
  const rotation = 0.12 * Math.sin(f * 0.027) + hit * 0.28 * Math.sin(f * 2.6);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK}}>
      <OffthreadVideo
        src={userFile(name)}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(' + zoom + ') translate(' + x + 'px,' + y + 'px) rotate(' + rotation + 'deg)',
          filter: 'saturate(1.1) contrast(1.045)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,5,18,.08) 0%, transparent 18%, transparent 68%, rgba(4,5,18,.3) 100%)',
        }}
      />
    </AbsoluteFill>
  );
}

function GameCutaway({
  name,
  label,
  startFrom = 20,
  accent = TEAL,
  duration = 36,
}: {
  name: string;
  label: string;
  startFrom?: number;
  accent?: string;
  duration?: number;
}) {
  const f = useCurrentFrame();
  const reveal = interpolate(f, [0, 9], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(f, [duration - 7, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enter = ease(f / 9);
  const shake = pulseAt(f, [0, 8], 5);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK, opacity: exit}}>
      <AbsoluteFill
        style={{
          clipPath: 'polygon(0 0, ' + reveal + '% 0, ' + Math.max(0, reveal - 9) + '% 100%, 0 100%)',
        }}
      >
        <OffthreadVideo
          src={sourceFile(name)}
          muted
          startFrom={startFrom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform:
              'scale(' +
              (1.09 - 0.055 * enter + 0.006 * Math.sin(f * 0.11)) +
              ') translate(' +
              (8 * Math.sin(f * 0.06) + shake * 4) +
              'px,' +
              (5 * Math.cos(f * 0.05)) +
              'px)',
            filter: 'saturate(1.16) contrast(1.07)',
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(115deg, rgba(5,5,18,.1), transparent 42%, rgba(5,5,18,.28))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 76,
            top: 70,
            padding: '10px 17px',
            color: WHITE,
            background: 'rgba(7,8,20,.82)',
            borderLeft: '6px solid ' + accent,
            fontFamily: 'ImpactLocal, Impact, sans-serif',
            fontSize: 25,
            letterSpacing: 2,
            textShadow: '2px 3px 0 #000',
            transform: 'translateX(' + ((1 - enter) * -45) + 'px)',
            opacity: enter,
          }}
        >
          {label}
        </div>
        <div
          style={{
            position: 'absolute',
            right: 76,
            top: 76,
            color: accent,
            fontFamily: 'CaptionLocal, sans-serif',
            fontSize: 16,
            letterSpacing: 2,
            textShadow: '0 2px 8px #000',
            opacity: enter,
          }}
        >
          GTA VI // ROCKSTAR
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: reveal + '%',
          top: '-10%',
          height: '120%',
          width: 32,
          transform: 'translateX(-50%) skewX(-13deg)',
          background: 'linear-gradient(90deg, transparent, #fff 38%, ' + accent + ' 62%, transparent)',
          filter: 'blur(4px)',
          opacity: reveal > 0 && reveal < 100 ? 0.9 : 0,
        }}
      />
    </AbsoluteFill>
  );
}

function LogoBurst() {
  const f = useCurrentFrame();
  const enter = pop(f, 12);
  const exit = interpolate(f, [34, 44], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: exit}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '43%',
          width: 570,
          height: 390,
          transform: 'translate(-50%,-50%) scale(' + (0.5 + 0.5 * enter) + ')',
          background: 'radial-gradient(ellipse, rgba(255,44,156,.27), rgba(32,242,230,.08) 42%, transparent 72%)',
          filter: 'blur(18px)',
        }}
      />
      <Img
        src={sourceFile('gta-logo.webp')}
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          width: 365,
          transform:
            'translate(-50%,-50%) perspective(1100px) rotateY(' +
            ((1 - ease(f / 15)) * -42) +
            'deg) rotateZ(' +
            (-8 + 2 * Math.sin(f * 0.11)) +
            'deg) scale(' +
            (0.45 + 0.55 * enter) +
            ')',
          filter:
            'drop-shadow(10px 13px 0 #05050a) drop-shadow(0 0 25px ' +
            PINK +
            ') drop-shadow(0 0 22px ' +
            TEAL +
            ')',
        }}
      />
    </AbsoluteFill>
  );
}

function MiniPanel({
  name,
  label,
  left,
  angle,
  accent,
  delay = 0,
}: {
  name: string;
  label: string;
  left: number;
  angle: number;
  accent: string;
  delay?: number;
}) {
  const f = useCurrentFrame() - delay;
  const p = pop(f, 13);
  const y = 410 + 10 * Math.sin(Math.max(0, f) * 0.1);
  const rotate = angle + 1.5 * Math.sin(Math.max(0, f) * 0.08);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: y,
        width: 440,
        height: 286,
        padding: 8,
        background: '#fffef9',
        border: '2px solid ' + accent,
        boxShadow: '0 0 26px ' + accent + '88, 14px 24px 18px rgba(0,0,0,.52)',
        transform:
          'translate(-50%,-50%) perspective(1100px) rotateY(' +
          rotate +
          'deg) rotateZ(' +
          angle * 0.12 +
          'deg) translateY(' +
          ((1 - p) * 80) +
          'px) scale(' +
          (0.7 + 0.3 * p) +
          ')',
        opacity: interpolate(f, [0, 6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <OffthreadVideo
        src={sourceFile(name)}
        muted
        startFrom={36}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <div
        style={{
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 8,
          height: 43,
          paddingLeft: 13,
          display: 'flex',
          alignItems: 'center',
          background: '#070713ee',
          color: WHITE,
          fontFamily: 'ImpactLocal, Impact, sans-serif',
          fontSize: 25,
          letterSpacing: 1.1,
          borderLeft: '6px solid ' + accent,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function NicoCutout({delay = 0, x = 1460, y = 450}: {delay?: number; x?: number; y?: number}) {
  const f = useCurrentFrame() - delay;
  const p = pop(f, 11);
  return (
    <Img
      src={sourceFile('nico-happy.webp')}
      style={{
        position: 'absolute',
        left: x + 5 * Math.sin(Math.max(0, f) * 0.09),
        top: y + 7 * Math.sin(Math.max(0, f) * 0.12) + 65 * (1 - ease(f / 12)),
        width: 390,
        transform:
          'translate(-50%,-50%) perspective(900px) rotateY(' +
          ((1 - ease(f / 13)) * -24) +
          'deg) rotateZ(' +
          (2 * Math.sin(Math.max(0, f) * 0.09)) +
          'deg) scale(' +
          Math.max(0.001, p) +
          ')',
        filter:
          'drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 4px 0 white) drop-shadow(12px 18px 8px #0007)',
      }}
    />
  );
}

function ZinkoTag() {
  const f = useCurrentFrame();
  const p = pop(f, 12);
  const fade = interpolate(f, [75, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 88,
        top: 84,
        padding: '13px 24px 11px',
        color: WHITE,
        fontFamily: 'ImpactLocal, Impact, sans-serif',
        fontSize: 68,
        letterSpacing: 2.5,
        lineHeight: 1,
        background: 'linear-gradient(110deg, #111126ee, #11112699)',
        borderLeft: '9px solid ' + PINK,
        borderBottom: '4px solid ' + TEAL,
        textShadow: '4px 5px 0 #05050a, 0 0 20px ' + PINK,
        transform:
          'perspective(1000px) rotateY(-18deg) rotateZ(-3deg) translateY(' +
          ((1 - p) * -45) +
          'px) scale(' +
          (0.72 + 0.28 * p) +
          ')',
        opacity: fade,
      }}
    >
      ZINKO
      <div
        style={{
          marginTop: 7,
          fontFamily: 'CaptionLocal, sans-serif',
          fontSize: 15,
          letterSpacing: 2.2,
          color: TEAL,
          textShadow: 'none',
        }}
      >
        CANAL DE LA CURIOSIDAD
      </div>
    </div>
  );
}

function Caption({frame}: {frame: number}) {
  const cues = [
    {start: 0, end: 46, text: 'UN JUEGO ACABA DE IGUALAR'},
    {start: 46, end: 104, text: 'UN RÉCORD DE 28 AÑOS'},
    {start: 105, end: 139, text: 'ES GTA 6'},
    {start: 139, end: 199, text: 'Y LAS RESEÑAS SON HISTÓRICAS'},
    {start: 199, end: 297, text: 'PERO TIENE PEGAS QUE CASI NADIE CUENTA'},
    {start: 300, end: 344, text: 'BIENVENIDO A ZINKO'},
    {start: 344, end: 404, text: 'EL CANAL DE LA CURIOSIDAD'},
    {start: 404, end: 450, text: 'HOY VEREMOS QUÉ AMAN Y QUÉ CRITICAN'},
  ];
  const cue = cues.find((c) => frame >= c.start && frame < c.end);
  if (!cue) return null;
  const local = frame - cue.start;
  const words = cue.text.split(' ');
  const fontSize = cue.text.length > 37 ? 43 : cue.text.length > 28 ? 49 : 57;
  const highlights = new Set(['28', 'AÑOS', 'GTA', '6', 'HISTÓRICAS', 'PEGAS', 'ZINKO', 'AMAN', 'CRITICAN']);
  return (
    <div
      style={{
        position: 'absolute',
        left: 85,
        right: 85,
        bottom: 30,
        minHeight: 82,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 12,
        rowGap: 2,
        textAlign: 'center',
        fontFamily: 'CaptionLocal, Impact, sans-serif',
        fontWeight: 900,
        fontSize,
        lineHeight: 1.02,
        letterSpacing: 0.8,
        color: YELLOW,
        WebkitTextStroke: '3.5px ' + INK,
        paintOrder: 'stroke fill',
        textShadow: '0 5px 0 #05050a, 0 9px 18px rgba(0,0,0,.62)',
      }}
    >
      {words.map((word, index) => {
        const p = pop(local - index * 2, 15);
        const clean = word.toUpperCase().replace(/[.,!?…]/g, '');
        const color = highlights.has(clean) ? (clean === 'PEGAS' || clean === 'CRITICAN' ? PINK : TEAL) : YELLOW;
        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              color,
              transform:
                'translateY(' +
                ((1 - p) * (index % 2 === 0 ? 23 : -18)) +
                'px) rotate(' +
                ((1 - p) * (index % 2 === 0 ? -8 : 7)) +
                'deg) scale(' +
                (0.68 + 0.32 * p) +
                ')',
              opacity: clamp((local - index * 2) / 3),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

function SpeedLines({frame}: {frame: number}) {
  const intensity = pulseAt(frame, [0, 46, 72, 105, 139, 199, 232, 294, 300, 414], 8);
  if (intensity < 0.01) return null;
  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: intensity * 0.55,
        pointerEvents: 'none',
        transform: 'rotate(' + (frame % 2 === 0 ? 0.5 : -0.5) + 'deg)',
      }}
    >
      {Array.from({length: 22}).map((_, i) => {
        const a = (Math.PI * 2 * i) / 22;
        const x1 = 960 + Math.cos(a) * 270;
        const y1 = 540 + Math.sin(a) * 170;
        const x2 = 960 + Math.cos(a) * 1030;
        const y2 = 540 + Math.sin(a) * 700;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i % 2 === 0 ? TEAL : PINK}
            strokeWidth={i % 4 === 0 ? 6 : 3}
            strokeLinecap="round"
            strokeDasharray="70 90"
            strokeDashoffset={-frame * (i % 2 === 0 ? 15 : 11)}
          />
        );
      })}
    </svg>
  );
}

function Flash({frame}: {frame: number}) {
  const hit = pulseAt(frame, [0, 46, 72, 105, 139, 199, 232, 294, 300, 414], 5);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: hit * 0.16,
        background: 'radial-gradient(ellipse at center, #fff 0%, ' + TEAL + ' 35%, ' + PINK + ' 70%, transparent 100%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}


function NeonWipe() {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 17], [-2200, 2200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(f, [0, 4, 12, 17], [0, 0.95, 0.72, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity,
        background:
          'linear-gradient(105deg, transparent 0%, ' +
          PINK +
          ' 46%, #fff 50%, ' +
          TEAL +
          ' 54%, transparent 100%)',
        transform: 'translateX(' + x + 'px) skewX(-12deg)',
        filter: 'blur(8px)',
        mixBlendMode: 'screen',
      }}
    />
  );
}

function Sound({name, from, volume = 0.22}: {name: string; from: number; volume?: number}) {
  return (
    <Sequence from={from}>
      <Audio src={userFile('sfx/' + name)} volume={volume} />
    </Sequence>
  );
}

function Preview() {
  const frame = useCurrentFrame();
  const [fontHandle] = useState(() => delayRender('Cargando tipografías ZINKO'));
  useEffect(() => {
    const fonts = [
      new FontFace('CaptionLocal', 'url(' + sourceFile('Caption.ttf') + ')'),
      new FontFace('ImpactLocal', 'url(' + sourceFile('Impact.ttf') + ')'),
    ];
    Promise.all(fonts.map((font) => font.load()))
      .then((loaded) => {
        loaded.forEach((font) => document.fonts.add(font));
        continueRender(fontHandle);
      })
      .catch((error) => cancelRender(error));
  }, [fontHandle]);

  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Sequence from={0} durationInFrames={300}>
        <BaseClip name="clips/scene-01.mp4" />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <BaseClip name="clips/scene-02.mp4" sceneTwo />
      </Sequence>

      <Sequence from={72} durationInFrames={36}>
        <GameCutaway name="opening.mp4" label="VICE CITY // LEONIDA" startFrom={24} accent={TEAL} duration={36} />
      </Sequence>
      <Sequence from={145} durationInFrames={32}>
        <GameCutaway name="crowd.mp4" label="UN MUNDO VIVO" startFrom={42} accent={PINK} duration={32} />
      </Sequence>
      <Sequence from={178} durationInFrames={34}>
        <GameCutaway name="lowrider.mp4" label="GTA VI // GAMEPLAY" startFrom={65} accent={TEAL} duration={34} />
      </Sequence>
      <Sequence from={236} durationInFrames={30}>
        <GameCutaway name="opening.mp4" label="PERO NO TODO ES PERFECTO" startFrom={112} accent={PINK} duration={30} />
      </Sequence>

      <Sequence from={104} durationInFrames={34}>
        <LogoBurst />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <ZinkoTag />
      </Sequence>
      <Sequence from={310} durationInFrames={82}>
        <NicoCutout delay={4} x={1510} y={448} />
      </Sequence>
      <Sequence from={410} durationInFrames={40}>
        <MiniPanel name="crowd.mp4" label="LO QUE AMAN" left={440} angle={-7} accent={TEAL} delay={0} />
        <MiniPanel name="lowrider.mp4" label="LO QUE CRITICAN" left={1480} angle={7} accent={PINK} delay={5} />
      </Sequence>

      <Sequence from={294} durationInFrames={18}>
        <NeonWipe />
      </Sequence>

      <Caption frame={frame} />
      <SpeedLines frame={frame} />
      <Flash frame={frame} />

      <Sequence from={0} durationInFrames={300}>
        <Audio src={userFile('voice/1.mp3')} volume={1} />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <Audio src={userFile('voice/2.mp3')} volume={1} />
      </Sequence>

      <Sound name="13_golpe_bajo.wav" from={0} volume={0.23} />
      <Sound name="05_whoosh_largo.wav" from={46} volume={0.17} />
      <Sound name="04_whoosh.wav" from={70} volume={0.23} />
      <Sound name="02_pop_agudo.wav" from={104} volume={0.2} />
      <Sound name="11_swoosh.wav" from={144} volume={0.2} />
      <Sound name="16_laser.wav" from={177} volume={0.14} />
      <Sound name="03_pop_grave.wav" from={198} volume={0.2} />
      <Sound name="12_sorpresa.wav" from={232} volume={0.16} />
      <Sound name="05_whoosh_largo.wav" from={294} volume={0.2} />
      <Sound name="13_golpe_bajo.wav" from={300} volume={0.22} />
      <Sound name="06_ding.wav" from={322} volume={0.17} />
      <Sound name="07_ding_doble.wav" from={410} volume={0.17} />
      <Sound name="40_final_epico.wav" from={441} volume={0.14} />

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(3,4,18,.06), transparent 16%, transparent 78%, rgba(3,4,18,.25))',
        }}
      />
    </AbsoluteFill>
  );
}

const Root = () => (
  <Composition
    id="ZinkoGTA6Preview15s"
    component={Preview}
    durationInFrames={450}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
