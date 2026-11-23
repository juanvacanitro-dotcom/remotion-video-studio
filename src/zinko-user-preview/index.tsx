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
const ORANGE = '#ff9c45';
const YELLOW = '#ffed23';
const userFile = (name: string) => staticFile('zinko-user-preview/' + name);
const sourceFile = (name: string) => staticFile('zinko-proof/' + name);
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const x = clamp(n);
  return x * x * (3 - 2 * x);
};
const pop = (frame: number, damping = 13) =>
  spring({frame: Math.max(0, frame), fps: FPS, config: {mass: 0.72, damping, stiffness: 175}});

function BaseClip({name, sceneTwo = false}: {name: string; sceneTwo?: boolean}) {
  const f = useCurrentFrame();
  const zoom = sceneTwo ? 1.018 + 0.008 * Math.sin(f * 0.07) : 1.012 + 0.012 * Math.sin(f * 0.055);
  const x = sceneTwo ? 3 * Math.sin(f * 0.04) : 4 * Math.sin(f * 0.035);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK}}>
      <OffthreadVideo
        src={userFile(name)}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(' + zoom + ') translateX(' + x + 'px)',
          filter: 'saturate(1.06) contrast(1.035)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,5,18,.12) 0%, transparent 22%, transparent 70%, rgba(4,5,18,.24) 100%)',
        }}
      />
    </AbsoluteFill>
  );
}

function MainCaption({frame}: {frame: number}) {
  const cues = [
    {start: 0, end: 46, text: 'UN JUEGO ACABA DE IGUALAR'},
    {start: 46, end: 104, text: 'UN RÉCORD DE 28 AÑOS'},
    {start: 105, end: 139, text: 'ES GTA 6'},
    {start: 139, end: 199, text: 'Y LAS RESEÑAS SON HISTÓRICAS'},
    {start: 199, end: 297, text: 'PERO HAY PEGAS QUE CASI NADIE CUENTA'},
    {start: 300, end: 344, text: 'BIENVENIDO A ZINKO'},
    {start: 344, end: 404, text: 'EL CANAL DE LA CURIOSIDAD'},
    {start: 404, end: 450, text: '¿QUÉ AMAN Y QUÉ CRITICAN?'},
  ];
  const cue = cues.find((c) => frame >= c.start && frame < c.end);
  if (!cue) return null;
  const local = frame - cue.start;
  const p = pop(local, 16);
  const size = cue.text.length > 34 ? 43 : cue.text.length > 26 ? 49 : 57;
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: 38,
        textAlign: 'center',
        fontFamily: 'CaptionLocal, Impact, sans-serif',
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: 1.2,
        whiteSpace: 'nowrap',
        color: YELLOW,
        WebkitTextStroke: '3.5px ' + INK,
        paintOrder: 'stroke fill',
        textShadow: '0 5px 0 #05050a, 0 9px 18px rgba(0,0,0,.55)',
        transform:
          'translateY(' + (1 - p) * 24 + 'px) scale(' + (0.92 + 0.08 * p) + ')',
        opacity: interpolate(local, [0, 4, 10], [0, 1, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      {cue.text}
    </div>
  );
}

function GameCard({
  name,
  label,
  angle = -5,
  width = 700,
  height = 392,
  startFrom = 24,
  accent = TEAL,
}: {
  name: string;
  label: string;
  angle?: number;
  width?: number;
  height?: number;
  startFrom?: number;
  accent?: string;
}) {
  const f = useCurrentFrame();
  const enter = pop(f, 14);
  const out = interpolate(f, [58, 78], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = 1195 + 16 * Math.sin(f * 0.045);
  const y = 555 + 8 * Math.sin(f * 0.06);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: height + 58,
        transform:
          'translate(-50%,-50%) perspective(1500px) rotateY(' +
          (angle + (1 - ease(f / 12)) * -24) +
          'deg) rotateZ(' +
          (angle * 0.28 + 1.2 * Math.sin(f * 0.055)) +
          'deg) translateY(' +
          ((1 - enter) * 90) +
          'px) scale(' +
          (0.74 + 0.26 * enter) +
          ')',
        opacity: out,
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(20px 28px 18px rgba(0,0,0,.52))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: 10,
          background: '#f7f7f2',
          border: '3px solid #fff',
          boxShadow: 'inset 0 0 0 2px ' + accent + ', 0 0 26px ' + accent + '66',
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
            filter: 'saturate(1.12) contrast(1.06)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          background: '#080817',
          borderLeft: '3px solid ' + accent,
          borderRight: '3px solid ' + accent,
          borderBottom: '3px solid ' + accent,
          color: '#fff',
          fontFamily: 'CaptionLocal, sans-serif',
          fontSize: 18,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}
      >
        <span>{label}</span>
        <span style={{color: accent}}>ROCKSTAR GAMES</span>
      </div>
    </div>
  );
}

function GTAStamp() {
  const f = useCurrentFrame();
  const p = pop(f, 12);
  const exit = interpolate(f, [67, 83], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Img
      src={sourceFile('gta-logo.webp')}
      style={{
        position: 'absolute',
        right: 92,
        top: 95,
        width: 260,
        transform:
          'perspective(900px) rotateY(' +
          ((1 - ease(f / 15)) * -35) +
          'deg) rotateZ(' +
          (-6 + 2 * Math.sin(f * 0.07)) +
          'deg) scale(' +
          (0.55 + 0.45 * p) +
          ')',
        opacity: exit,
        filter:
          'drop-shadow(7px 9px 0 #05050a) drop-shadow(0 0 22px ' +
          PINK +
          '88) drop-shadow(0 0 22px ' +
          TEAL +
          '66)',
      }}
    />
  );
}

function NeonWipe() {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 5, 11, 17], [0, 0.9, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(f, [0, 17], [-35, 115], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity,
        background:
          'linear-gradient(105deg, transparent ' +
          (x - 16) +
          '%, ' +
          PINK +
          ' 48%, #fff 50%, ' +
          TEAL +
          ' 52%, transparent ' +
          (x + 28) +
          '%)',
        filter: 'blur(7px)',
        mixBlendMode: 'screen',
      }}
    />
  );
}

function MiniPanel({
  name,
  label,
  left,
  angle,
  accent,
  delay,
}: {
  name: string;
  label: string;
  left: number;
  angle: number;
  accent: string;
  delay: number;
}) {
  const f = useCurrentFrame() - delay;
  const p = pop(f, 13);
  const y = 405 + 9 * Math.sin(Math.max(0, f) * 0.09);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: y,
        width: 510,
        height: 310,
        padding: 8,
        background: '#fff',
        border: '2px solid ' + accent,
        boxShadow: '0 0 26px ' + accent + '77, 12px 20px 18px rgba(0,0,0,.5)',
        transform:
          'translate(-50%,-50%) perspective(1100px) rotateY(' +
          angle +
          'deg) rotateZ(' +
          angle * 0.12 +
          'deg) scale(' +
          (0.7 + 0.3 * p) +
          ')',
        opacity: interpolate(f, [0, 5], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <OffthreadVideo
        src={sourceFile(name)}
        muted
        startFrom={30}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <div
        style={{
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 8,
          height: 42,
          paddingLeft: 13,
          display: 'flex',
          alignItems: 'center',
          background: '#070713eF',
          color: '#fff',
          fontFamily: 'ImpactLocal, Impact, sans-serif',
          fontSize: 27,
          letterSpacing: 1,
          borderLeft: '6px solid ' + accent,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ZinkoTag() {
  const f = useCurrentFrame();
  const p = pop(f, 12);
  const fade = interpolate(f, [62, 76], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 95,
        top: 105,
        padding: '12px 22px 10px',
        color: '#fff',
        fontFamily: 'ImpactLocal, Impact, sans-serif',
        fontSize: 58,
        letterSpacing: 2,
        lineHeight: 1,
        background: 'linear-gradient(110deg, #111126ee, #11112699)',
        borderLeft: '8px solid ' + PINK,
        borderBottom: '3px solid ' + TEAL,
        textShadow: '3px 4px 0 #05050a, 0 0 18px ' + PINK,
        transform:
          'perspective(900px) rotateY(-18deg) rotateZ(-3deg) translateY(' +
          ((1 - p) * -35) +
          'px) scale(' +
          (0.78 + 0.22 * p) +
          ')',
        opacity: fade,
      }}
    >
      ZINKO
      <div
        style={{
          marginTop: 6,
          fontFamily: 'CaptionLocal, sans-serif',
          fontSize: 14,
          letterSpacing: 2.1,
          color: TEAL,
          textShadow: 'none',
        }}
      >
        CANAL DE LA CURIOSIDAD
      </div>
    </div>
  );
}

function Sound({name, from, volume = 0.28}: {name: string; from: number; volume?: number}) {
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

  const sceneOneScale = 1 + 0.004 * Math.sin(frame * 0.045);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Sequence from={0} durationInFrames={300}>
        <BaseClip name="clips/scene-01.mp4" />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <BaseClip name="clips/scene-02.mp4" sceneTwo />
      </Sequence>

      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            transform: 'scale(' + sceneOneScale + ')',
            background:
              'radial-gradient(ellipse at 50% 48%, transparent 48%, rgba(3,4,18,.22) 100%)',
          }}
        />
      </Sequence>

      <Sequence from={104} durationInFrames={82}>
        <GameCard name="opening.mp4" label="VICE CITY · LEONIDA" width={720} height={405} angle={-7} startFrom={38} />
      </Sequence>
      <Sequence from={138} durationInFrames={55}>
        <GameCard name="lowrider.mp4" label="METRAJE IN-GAME" width={500} height={282} angle={5} startFrom={22} accent={PINK} />
      </Sequence>
      <Sequence from={112} durationInFrames={86}>
        <GTAStamp />
      </Sequence>

      <Sequence from={194} durationInFrames={18}>
        <NeonWipe />
      </Sequence>

      <Sequence from={300} durationInFrames={150}>
        <ZinkoTag />
      </Sequence>
      <Sequence from={414} durationInFrames={36}>
        <MiniPanel name="crowd.mp4" label="LO QUE AMAN" left={520} angle={-7} accent={TEAL} delay={0} />
        <MiniPanel name="lowrider.mp4" label="LO QUE CRITICAN" left={1400} angle={7} accent={PINK} delay={7} />
      </Sequence>

      <MainCaption frame={frame} />

      <Sequence from={0} durationInFrames={300}>
        <Audio src={userFile('voice/1.mp3')} volume={1} />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <Audio src={userFile('voice/2.mp3')} volume={1} />
      </Sequence>

      <Sound name="05_whoosh_largo.wav" from={8} volume={0.18} />
      <Sound name="13_golpe_bajo.wav" from={99} volume={0.3} />
      <Sound name="04_whoosh.wav" from={104} volume={0.25} />
      <Sound name="06_ding.wav" from={132} volume={0.22} />
      <Sound name="11_swoosh.wav" from={193} volume={0.22} />
      <Sound name="01_pop.wav" from={306} volume={0.25} />
      <Sound name="07_ding_doble.wav" from={420} volume={0.18} />

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(3,4,18,.08), transparent 18%, transparent 76%, rgba(3,4,18,.22))',
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
