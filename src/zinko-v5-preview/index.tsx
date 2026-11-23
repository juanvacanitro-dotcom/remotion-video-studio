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
const FRAMES = 600;
const INK = '#080a12';
const WHITE = '#fffaf1';
const YELLOW = '#ffe52e';
const PINK = '#ff4389';
const TEAL = '#25e0d4';
const proof = (name: string) => staticFile('zinko-proof/' + name);
const full = (name: string) => staticFile('zinko-full/' + name);
const local = (name: string) => staticFile('zinko-v5-preview/' + name);
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => {
  const x = clamp(v);
  return x * x * (3 - 2 * x);
};
const pop = (f: number, delay = 0, damping = 14) =>
  spring({frame: Math.max(0, f - delay), fps: FPS, config: {mass: 0.78, damping, stiffness: 165}});

function FadeScene({children, duration}: {children: React.ReactNode; duration: number}) {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 9, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity, overflow: 'hidden'}}>{children}</AbsoluteFill>;
}

function GameShot({
  name,
  source = 'proof',
  startFrom = 0,
  zoom = 1.035,
  zoomTo = 1.12,
  panX = 0,
  panY = 0,
  tint = 'none',
}: {
  name: string;
  source?: 'proof' | 'full';
  startFrom?: number;
  zoom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  tint?: 'warm' | 'cool' | 'none';
}) {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 150], [zoom, zoomTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftX = panX * Math.sin(f * 0.018);
  const driftY = panY * Math.sin(f * 0.015);
  const src = source === 'full' ? full(name) : proof(name);
  const color = tint === 'warm'
    ? 'saturate(1.18) contrast(1.08) sepia(.12)'
    : tint === 'cool'
      ? 'saturate(1.12) contrast(1.1) hue-rotate(-7deg)'
      : 'saturate(1.12) contrast(1.08)';
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK}}>
      <OffthreadVideo
        src={src}
        muted
        startFrom={startFrom}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 50%',
          transform: 'scale(' + scale + ') translate(' + driftX + 'px,' + driftY + 'px)',
          filter: color,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(5,6,13,.82) 0%, rgba(5,6,13,.36) 49%, rgba(5,6,13,.10) 100%), linear-gradient(0deg, rgba(5,6,13,.52), transparent 48%)',
        }}
      />
    </AbsoluteFill>
  );
}

function HeroText({
  text,
  x,
  y,
  size = 120,
  color = YELLOW,
  delay = 0,
  angle = -3,
  width = 900,
  align = 'left',
  depth = 7,
}: {
  text: string;
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
  angle?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  depth?: number;
}) {
  const f = useCurrentFrame();
  const p = pop(f, delay, 13);
  const t = ease((f - delay) / 16);
  const shadows = Array.from({length: depth}, (_, i) => {
    const n = i + 1;
    return n + 'px ' + (n + 1) + 'px 0 ' + INK;
  }).join(', ');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        color,
        textAlign: align,
        fontFamily: 'ImpactLocal, Impact, sans-serif',
        fontSize: size,
        fontWeight: 900,
        lineHeight: 0.88,
        letterSpacing: -1.5,
        whiteSpace: 'pre-line',
        WebkitTextStroke: '2px ' + INK,
        paintOrder: 'stroke fill',
        textShadow: shadows + ', 0 13px 24px rgba(0,0,0,.34)',
        opacity: interpolate(f, [delay, delay + 5], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        transform:
          'perspective(1100px) rotateY(' + ((1 - t) * -31) + 'deg) rotateZ(' +
          (angle + (1 - t) * -7) + 'deg) translateY(' + ((1 - p) * 46) +
          'px) scale(' + (0.72 + 0.28 * p) + ')',
        transformOrigin: align === 'right' ? '100% 70%' : '0% 70%',
      }}
    >
      {text}
    </div>
  );
}

function Eyebrow({
  text,
  x,
  y,
  color = WHITE,
  delay = 0,
}: {
  text: string;
  x: number;
  y: number;
  color?: string;
  delay?: number;
}) {
  const f = useCurrentFrame();
  const p = ease((f - delay) / 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        color,
        fontFamily: 'CaptionLocal, Arial, sans-serif',
        fontSize: 27,
        fontWeight: 900,
        letterSpacing: 3.4,
        textTransform: 'uppercase',
        opacity: p,
        transform: 'translateX(' + ((1 - p) * -22) + 'px)',
        textShadow: '0 3px 12px rgba(0,0,0,.55)',
      }}
    >
      {text}
    </div>
  );
}

function NicoCutout({
  pose = 'happy',
  x,
  y,
  width,
  delay = 0,
  tilt = 0,
}: {
  pose?: 'happy' | 'question';
  x: number;
  y: number;
  width: number;
  delay?: number;
  tilt?: number;
}) {
  const f = useCurrentFrame();
  const p = pop(f, delay, 12);
  const bob = Math.sin(Math.max(0, f - delay) * 0.085) * 7;
  const turn = Math.sin(Math.max(0, f - delay) * 0.055) * 1.8;
  return (
    <Img
      src={proof('nico-' + pose + '.webp')}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: width * 1.48,
        objectFit: 'contain',
        transform:
          'translate(-50%,-50%) translateY(' + ((1 - p) * 125 + bob) +
          'px) rotate(' + (tilt + turn) + 'deg) scale(' + (0.76 + 0.24 * p) + ')',
        transformOrigin: '50% 80%',
        filter:
          'drop-shadow(2px 0 0 rgba(255,255,255,.95)) drop-shadow(-2px 0 0 rgba(255,255,255,.95)) drop-shadow(0 3px 0 rgba(255,255,255,.9)) drop-shadow(12px 18px 10px rgba(0,0,0,.4))',
        opacity: interpolate(f, [delay, delay + 5], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    />
  );
}

function AccentLine({x, y, width, color = YELLOW, delay = 0}: {x: number; y: number; width: number; color?: string; delay?: number}) {
  const f = useCurrentFrame();
  const p = ease((f - delay) / 16);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width * p,
        height: 10,
        borderRadius: 10,
        background: color,
        boxShadow: '0 0 20px ' + color + '88',
        transform: 'skewX(-17deg)',
      }}
    />
  );
}

function NeonStage() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 75% 42%, rgba(31,213,204,.22), transparent 34%), radial-gradient(ellipse at 18% 76%, rgba(255,55,130,.18), transparent 40%), linear-gradient(135deg, #080a17 0%, #11132b 52%, #090914 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          right: '-10%',
          top: '54%',
          height: '72%',
          transform:
            'perspective(850px) rotateX(62deg) translateY(' +
            (Math.sin(f * 0.025) * 10) + 'px)',
          transformOrigin: '50% 0%',
          backgroundImage:
            'linear-gradient(rgba(35,222,213,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(35,222,213,.25) 1px, transparent 1px)',
          backgroundSize: '105px 72px',
          opacity: 0.42,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 780,
          height: 780,
          borderRadius: '50%',
          border: '2px solid rgba(255,65,137,.34)',
          right: -220,
          top: -310,
          transform: 'scale(' + (1 + 0.025 * Math.sin(f * 0.04)) + ')',
          boxShadow: '0 0 70px rgba(255,65,137,.14), inset 0 0 70px rgba(255,65,137,.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 260,
          background: 'linear-gradient(0deg, rgba(0,0,0,.35), transparent)',
        }}
      />
    </AbsoluteFill>
  );
}

function SplitScreen() {
  const f = useCurrentFrame();
  const leftX = interpolate(f, [0, 16], [-80, 0], {extrapolateRight: 'clamp'});
  const rightX = interpolate(f, [0, 16], [80, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50.2%',
          height: '100%',
          overflow: 'hidden',
          transform: 'translateX(' + leftX + 'px)',
        }}
      >
        <GameShot name="crowd.mp4" zoom={1.04} zoomTo={1.16} panX={12} tint="warm" />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50.2%',
          height: '100%',
          overflow: 'hidden',
          transform: 'translateX(' + rightX + 'px)',
        }}
      >
        <GameShot name="lowrider.mp4" zoom={1.02} zoomTo={1.13} panX={-10} tint="cool" />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 8,
          height: '100%',
          background: 'linear-gradient(180deg,' + TEAL + ',' + PINK + ')',
          boxShadow: '0 0 30px rgba(37,224,212,.65)',
          transform: 'translateX(-50%) scaleY(' + ease(f / 12) + ')',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(0deg, rgba(4,5,10,.6), transparent 52%), linear-gradient(90deg, rgba(4,5,10,.12), transparent 50%, rgba(4,5,10,.12))',
        }}
      />
    </AbsoluteFill>
  );
}

function SlashWipe({color = TEAL}: {color?: string}) {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 13], [-2400, 2400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(f, [0, 2, 10, 13], [0, 0.92, 0.92, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', opacity}}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: -350,
          width: 270,
          height: 1800,
          transform: 'rotate(17deg)',
          background:
            'linear-gradient(90deg, transparent 0%, ' + color + '22 22%, ' +
            color + ' 48%, #ffffff 51%, ' + color + ' 56%, transparent 100%)',
          filter: 'blur(1px) drop-shadow(0 0 24px ' + color + ')',
        }}
      />
    </AbsoluteFill>
  );
}

function SceneOne() {
  const f = useCurrentFrame();
  return (
    <FadeScene duration={165}>
      <Sequence from={0} durationInFrames={82}>
        <GameShot name="opening.mp4" zoom={1.025} zoomTo={1.12} panX={10} tint="warm" />
      </Sequence>
      <Sequence from={82} durationInFrames={83}>
        <GameShot name="crowd.mp4" zoom={1.035} zoomTo={1.15} panX={-8} tint="warm" />
      </Sequence>
      <Eyebrow text="UN JUEGO ACABA DE IGUALAR" x={155} y={250} color={WHITE} delay={4} />
      <HeroText text="28" x={135} y={315} size={310} color={YELLOW} delay={3} width={500} angle={-5} depth={10} />
      <HeroText text="AÑOS" x={455} y={455} size={112} color={WHITE} delay={13} width={440} angle={-4} depth={6} />
      <AccentLine x={155} y={610} width={460} color={PINK} delay={20} />
      <div
        style={{
          position: 'absolute',
          left: 155,
          top: 660,
          padding: '13px 22px',
          background: 'rgba(8,10,18,.78)',
          borderLeft: '7px solid ' + TEAL,
          color: WHITE,
          fontFamily: 'CaptionLocal, Arial, sans-serif',
          fontSize: 25,
          fontWeight: 900,
          letterSpacing: 2,
          opacity: ease((f - 25) / 12),
          transform: 'translateY(' + ((1 - ease((f - 25) / 12)) * 20) + 'px)',
        }}
      >
        UN RÉCORD DE 28 AÑOS
      </div>
      <NicoCutout x={1570} y={650} width={430} delay={34} tilt={2} />
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 90,
          width: 160,
          height: 160,
          borderRadius: '50%',
          border: '3px solid rgba(255,229,46,.8)',
          boxShadow: '0 0 30px rgba(255,229,46,.28)',
          opacity: ease((f - 52) / 14),
          transform: 'scale(' + (0.75 + 0.25 * pop(f, 52, 12)) + ')',
        }}
      />
    </FadeScene>
  );
}

function SceneTwo() {
  const f = useCurrentFrame();
  return (
    <FadeScene duration={160}>
      <Sequence from={0} durationInFrames={78}>
        <GameShot name="lowrider.mp4" zoom={1.035} zoomTo={1.14} panX={9} tint="cool" />
      </Sequence>
      <Sequence from={78} durationInFrames={82}>
        <GameShot name="rockstar.mp4" source="full" zoom={1.025} zoomTo={1.13} panX={-10} tint="warm" />
      </Sequence>
      <Img
        src={proof('gta-logo.webp')}
        style={{
          position: 'absolute',
          left: 145,
          top: 150,
          width: 360,
          objectFit: 'contain',
          filter: 'drop-shadow(9px 13px 9px rgba(0,0,0,.48))',
          transform:
            'perspective(1100px) rotateY(' + ((1 - ease(f / 18)) * -38) +
            'deg) rotate(-5deg) scale(' + (0.72 + 0.28 * pop(f, 2, 12)) + ')',
        }}
      />
      <HeroText text="ES GTA 6" x={150} y={565} size={148} color={WHITE} delay={12} width={760} angle={-4} depth={9} />
      <Eyebrow text="Y LAS RESEÑAS SON HISTÓRICAS" x={160} y={760} color={YELLOW} delay={25} />
      <NicoCutout pose="question" x={1580} y={675} width={400} delay={38} tilt={-2} />
      <Sequence from={88} durationInFrames={72}>
        <HeroText text="PERO HAY\nPEGAS" x={1050} y={315} size={106} color={PINK} delay={0} width={720} angle={4} depth={8} />
        <div
          style={{
            position: 'absolute',
            right: 235,
            top: 675,
            width: 94,
            height: 94,
            border: '8px solid ' + PINK,
            borderRadius: 22,
            transform: 'rotate(45deg) scale(' + (0.7 + 0.3 * pop(f - 88, 9, 12)) + ')',
            opacity: ease((f - 88) / 10),
          }}
        />
      </Sequence>
    </FadeScene>
  );
}

function SceneThree() {
  const f = useCurrentFrame();
  return (
    <FadeScene duration={160}>
      <NeonStage />
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 180,
          width: 10,
          height: 620,
          background: 'linear-gradient(180deg,' + PINK + ',' + TEAL + ')',
          boxShadow: '0 0 28px rgba(37,224,212,.5)',
          transform: 'scaleY(' + ease(f / 18) + ')',
          transformOrigin: 'top',
        }}
      />
      <Eyebrow text="EL CANAL DE LA CURIOSIDAD" x={160} y={300} color={TEAL} delay={8} />
      <HeroText text="BIENVENIDO" x={145} y={365} size={128} color={WHITE} delay={12} width={970} angle={-3} depth={9} />
      <HeroText text="A ZINKO" x={155} y={510} size={168} color={YELLOW} delay={25} width={800} angle={-3} depth={11} />
      <AccentLine x={160} y={715} width={560} color={PINK} delay={37} />
      <NicoCutout x={1500} y={640} width={515} delay={20} tilt={3} />
      <div
        style={{
          position: 'absolute',
          right: 170,
          top: 165,
          width: 290,
          height: 290,
          border: '2px solid rgba(37,224,212,.52)',
          borderRadius: '50%',
          boxShadow: '0 0 55px rgba(37,224,212,.18), inset 0 0 35px rgba(37,224,212,.1)',
          transform: 'scale(' + (0.86 + 0.035 * Math.sin(f * 0.06)) + ')',
        }}
      />
    </FadeScene>
  );
}

function SceneFour() {
  const f = useCurrentFrame();
  return (
    <FadeScene duration={160}>
      <Sequence from={0} durationInFrames={90}>
        <SplitScreen />
        <HeroText text="QUÉ AMAN" x={105} y={160} size={93} color={YELLOW} delay={10} width={700} angle={-4} depth={8} />
        <HeroText text="QUÉ CRITICAN" x={1070} y={160} size={84} color={PINK} delay={19} width={760} angle={4} depth={8} />
      </Sequence>
      <Sequence from={90} durationInFrames={70}>
        <GameShot name="coast.mp4" source="full" zoom={1.025} zoomTo={1.13} panX={-9} tint="warm" />
        <HeroText text="¿VALIÓ LA\nESPERA?" x={145} y={320} size={150} color={YELLOW} delay={3} width={820} angle={-4} depth={10} />
        <Eyebrow text="Y AL FINAL, MI VEREDICTO" x={160} y={665} color={WHITE} delay={20} />
        <NicoCutout pose="question" x={1510} y={660} width={430} delay={18} tilt={-2} />
      </Sequence>
    </FadeScene>
  );
}

const cues = [
  {start: 0, end: 145, text: 'Un juego acaba de igualar un récord de veintiocho años.'},
  {start: 145, end: 220, text: 'Es GTA seis, y las reseñas son históricas.'},
  {start: 220, end: 298, text: 'Pero tiene pegas que casi nadie cuenta.'},
  {start: 298, end: 390, text: 'Bienvenido a Zinko, el canal de la curiosidad.'},
  {start: 390, end: 465, text: 'Hoy veremos qué aman, qué critican'},
  {start: 465, end: 535, text: 'y si valió la espera.'},
  {start: 535, end: 600, text: 'Y al final, mi veredicto.'},
];

function Captions() {
  const f = useCurrentFrame();
  const cue = cues.find((c) => f >= c.start && f < c.end);
  if (!cue) return null;
  const localFrame = f - cue.start;
  const p = pop(localFrame, 0, 17);
  return (
    <div
      style={{
        position: 'absolute',
        left: 100,
        right: 100,
        bottom: 38,
        display: 'flex',
        justifyContent: 'center',
        opacity: interpolate(localFrame, [0, 7, cue.end - cue.start - 7, cue.end - cue.start], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        transform: 'translateY(' + ((1 - p) * 12) + 'px)',
      }}
    >
      <div
        style={{
          maxWidth: 1640,
          padding: '5px 12px 8px',
          color: YELLOW,
          fontFamily: 'CaptionLocal, Arial, sans-serif',
          fontSize: 34,
          fontWeight: 900,
          lineHeight: 1.1,
          textAlign: 'center',
          WebkitTextStroke: '2.5px ' + INK,
          paintOrder: 'stroke fill',
          textShadow: '0 4px 0 ' + INK + ', 0 8px 18px rgba(0,0,0,.6)',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
}

function V5Intro() {
  const [fontHandle] = useState(() => delayRender('Cargando tipografías de ZINKO V5'));
  useEffect(() => {
    const fonts = [
      new FontFace('CaptionLocal', 'url(' + proof('Caption.ttf') + ')'),
      new FontFace('ImpactLocal', 'url(' + proof('Impact.ttf') + ')'),
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
      <Sequence from={0} durationInFrames={165}><SceneOne /></Sequence>
      <Sequence from={150} durationInFrames={160}><SceneTwo /></Sequence>
      <Sequence from={295} durationInFrames={160}><SceneThree /></Sequence>
      <Sequence from={440} durationInFrames={160}><SceneFour /></Sequence>
      <Sequence from={147} durationInFrames={14}><SlashWipe color={TEAL} /></Sequence>
      <Sequence from={292} durationInFrames={14}><SlashWipe color={PINK} /></Sequence>
      <Sequence from={437} durationInFrames={14}><SlashWipe color={YELLOW} /></Sequence>
      <Captions />
      <Audio src={local('voice/intro-clean.wav')} volume={1} />
      <Audio src={local('sfx/13_golpe_bajo.wav')} volume={0.065} />
      <Sequence from={150} durationInFrames={45}>
        <Audio src={local('sfx/11_swoosh.wav')} volume={0.045} />
      </Sequence>
    </AbsoluteFill>
  );
}

const Root = () => (
  <Composition
    id="ZinkoGTA6V5"
    component={V5Intro}
    durationInFrames={FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
