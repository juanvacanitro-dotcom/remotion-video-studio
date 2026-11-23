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
const PAPER = '#f3eddf';
const INK = '#17171a';
const PINK = '#e84b83';
const TEAL = '#16a7a1';
const YELLOW = '#f4d64e';
const proof = (name: string) => staticFile('zinko-proof/' + name);
const user = (name: string) => staticFile('zinko-refined-preview/' + name);
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const x = clamp(v);
  return x * x * (3 - 2 * x);
};
const entrance = (f: number, damping = 18) =>
  spring({frame: Math.max(0, f), fps: FPS, config: {mass: 0.85, damping, stiffness: 125}});

function PaperBackground() {
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: PAPER}}>
      <Img
        src={proof('paper.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(1.04) saturate(.72) contrast(1.02)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(118deg, rgba(255,255,255,.16), rgba(243,237,223,.03) 48%, rgba(85,65,40,.07))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.13,
          background:
            'radial-gradient(ellipse at 15% 12%, rgba(255,255,255,.75), transparent 42%), radial-gradient(ellipse at 88% 85%, rgba(70,54,32,.2), transparent 40%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
}

function Tape({left, top, rotate = -4}: {left: number; top: number; rotate?: number}) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: 142,
        height: 27,
        zIndex: 5,
        background: 'linear-gradient(180deg, rgba(249,226,160,.83), rgba(232,207,139,.72))',
        border: '1px solid rgba(150,119,67,.16)',
        boxShadow: '0 2px 4px rgba(40,30,15,.08)',
        transform: 'rotate(' + rotate + 'deg)',
        opacity: 0.88,
      }}
    />
  );
}

type PhotoCardProps = {
  src: string;
  source: 'user' | 'proof';
  startFrom?: number;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  zoom?: number;
  objectPosition?: string;
  cropTop?: number;
  tape?: boolean;
  tapeSide?: 'left' | 'right';
};

function PhotoCard({
  src,
  source,
  startFrom = 0,
  left,
  top,
  width,
  height,
  rotate = -1.2,
  zoom = 1.06,
  objectPosition = 'center 54%',
  cropTop = 0,
  tape = true,
  tapeSide = 'left',
}: PhotoCardProps) {
  const f = useCurrentFrame();
  const p = entrance(f - 2, 19);
  const y = interpolate(p, [0, 1], [42, 0]);
  const scale = interpolate(p, [0, 1], [0.965, 1]);
  const srcUrl = source === 'user' ? user('clips/' + src) : proof(src);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        padding: 17,
        boxSizing: 'border-box',
        background: '#fffdf8',
        boxShadow: '0 22px 34px rgba(38,31,20,.23), 0 3px 7px rgba(38,31,20,.12)',
        transform:
          'translateY(' + y + 'px) rotate(' + rotate + 'deg) scale(' + scale + ')',
        opacity: interpolate(f, [0, 7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        border: '1px solid rgba(90,75,53,.18)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 8,
          background: '#e9e1d3',
          clipPath:
            'polygon(0 1%, 8% 0, 17% 1%, 26% 0, 35% 1%, 44% 0, 53% 1%, 62% 0, 71% 1%, 80% 0, 90% 1%, 100% 0, 99% 99%, 90% 100%, 81% 99%, 72% 100%, 63% 99%, 54% 100%, 45% 99%, 36% 100%, 27% 99%, 18% 100%, 9% 99%, 0 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 17,
          right: 17,
          top: 17,
          bottom: 17,
          overflow: 'hidden',
          clipPath:
            'polygon(0 1%, 8% 0, 17% 1%, 26% 0, 35% 1%, 44% 0, 53% 1%, 62% 0, 71% 1%, 80% 0, 90% 1%, 100% 0, 99% 99%, 90% 100%, 81% 99%, 72% 100%, 63% 99%, 54% 100%, 45% 99%, 36% 100%, 27% 99%, 18% 100%, 9% 99%, 0 100%)',
        }}
      >
        <OffthreadVideo
          src={srcUrl}
          muted
          startFrom={startFrom}
          style={{
            width: '100%',
            height: cropTop > 0 ? 100 + cropTop + '%' : '100%',
            objectFit: 'cover',
            objectPosition,
            transform:
              'scale(' + zoom + ')' +
              (cropTop > 0 ? ' translateY(-' + cropTop / 2 + '%)' : ''),
            filter: 'saturate(1.05) contrast(1.035)',
          }}
        />
      </div>
      {tape ? <Tape left={tapeSide === 'left' ? 38 : width - 180} top={-9} rotate={tapeSide === 'left' ? -5 : 4} /> : null}
    </div>
  );
}

function Headline({
  text,
  left,
  top,
  width = 700,
  size = 82,
  accent = PINK,
  eyebrow,
  align = 'left',
}: {
  text: string;
  left: number;
  top: number;
  width?: number;
  size?: number;
  accent?: string;
  eyebrow?: string;
  align?: 'left' | 'center' | 'right';
}) {
  const f = useCurrentFrame();
  const p = entrance(f - 2, 20);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        color: INK,
        textAlign: align,
        transform: 'translateY(' + (1 - p) * 28 + 'px)',
        opacity: interpolate(f, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      {eyebrow ? (
        <div
          style={{
            fontFamily: 'CaptionLocal, sans-serif',
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 4,
            color: '#6e665b',
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: 'ImpactLocal, Impact, sans-serif',
          fontSize: size,
          fontWeight: 900,
          lineHeight: 0.96,
          letterSpacing: 1.2,
          whiteSpace: 'pre-line',
          textShadow: '2px 3px 0 rgba(255,255,255,.48)',
        }}
      >
        {text}
      </div>
      <div
        style={{
          width: Math.min(width * 0.62, 390),
          height: 9,
          marginTop: 17,
          marginLeft: align === 'center' ? 'auto' : align === 'right' ? 'auto' : 0,
          marginRight: align === 'center' ? 'auto' : 0,
          borderRadius: 20,
          background: accent,
          transform: 'rotate(-1.2deg) scaleX(' + smooth(f / 16) + ')',
          transformOrigin: align === 'right' ? 'right' : 'left',
        }}
      />
    </div>
  );
}

function BigNumber28() {
  const f = useCurrentFrame();
  const p = entrance(f - 8, 13);
  const circle = interpolate(f, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 250,
        top: 420,
        width: 420,
        height: 320,
        transform: 'rotate(-5deg) scale(' + (0.78 + 0.22 * p) + ')',
        opacity: interpolate(f, [8, 16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <div
        style={{
          fontFamily: 'ImpactLocal, Impact, sans-serif',
          fontSize: 255,
          lineHeight: 0.9,
          letterSpacing: -7,
          color: PINK,
          WebkitTextStroke: '2px #fffaf0',
          textShadow: '5px 7px 0 rgba(40,25,20,.13)',
        }}
      >
        28
      </div>
      <div
        style={{
          marginLeft: 25,
          marginTop: -1,
          fontFamily: 'ImpactLocal, Impact, sans-serif',
          fontSize: 58,
          color: INK,
          letterSpacing: 5,
        }}
      >
        AÑOS
      </div>
      <svg
        viewBox="0 0 420 300"
        style={{
          position: 'absolute',
          inset: '-18px -10px 0 -8px',
          width: '108%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 36 106 C 8 23, 297 -5, 367 79 C 428 159, 353 268, 194 266 C 60 270, 2 208, 36 106"
          fill="none"
          stroke={TEAL}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="980"
          strokeDashoffset={980 * (1 - circle)}
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

function GtaLogoSticker() {
  const f = useCurrentFrame();
  const p = entrance(f - 2, 15);
  return (
    <div
      style={{
        position: 'absolute',
        left: 1265,
        top: 610,
        width: 280,
        height: 155,
        padding: 8,
        background: '#fffdf8',
        boxShadow: '0 12px 24px rgba(30,24,18,.22)',
        transform: 'rotate(2deg) scale(' + (0.82 + 0.18 * p) + ')',
        opacity: interpolate(f, [0, 7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <Img
        src={proof('gta-logo.webp')}
        style={{width: '100%', height: '100%', objectFit: 'contain'}}
      />
    </div>
  );
}

function PaperNote({
  text,
  accent = PINK,
  left = 410,
  top = 275,
  width = 1050,
  height = 300,
}: {
  text: string;
  accent?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}) {
  const f = useCurrentFrame();
  const p = entrance(f - 2, 19);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff9eb',
        border: '1px solid rgba(90,70,40,.16)',
        boxShadow: '0 22px 35px rgba(39,30,18,.18)',
        transform: 'translateY(' + (1 - p) * 38 + 'px) rotate(-1.3deg) scale(' + (0.97 + 0.03 * p) + ')',
        opacity: interpolate(f, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 12,
          border: '2px dashed rgba(50,42,32,.18)',
        }}
      />
      <div
        style={{
          fontFamily: 'ImpactLocal, Impact, sans-serif',
          color: INK,
          fontSize: 78,
          letterSpacing: 2,
          textAlign: 'center',
          lineHeight: 1,
          position: 'relative',
          padding: 18,
        }}
      >
        {text}
        <div
          style={{
            height: 10,
            width: '68%',
            margin: '18px auto 0',
            borderRadius: 12,
            background: accent,
            transform: 'rotate(-1.5deg)',
          }}
        />
      </div>
      <Tape left={width / 2 - 70} top={-10} rotate={2} />
    </div>
  );
}

function NicoCutout() {
  const f = useCurrentFrame();
  const p = entrance(f - 4, 16);
  return (
    <Img
      src={proof('nico-happy.webp')}
      style={{
        position: 'absolute',
        left: 1260,
        top: 205,
        width: 390,
        height: 570,
        objectFit: 'contain',
        transform: 'translateY(' + (1 - p) * 40 + 'px) rotate(1deg) scale(' + (0.96 + 0.04 * p) + ')',
        filter: 'drop-shadow(12px 18px 12px rgba(35,25,16,.18))',
        opacity: interpolate(f, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    />
  );
}

function Subtitle({frame}: {frame: number}) {
  const cues = [
    {start: 0, end: 78, text: 'Un juego acaba de igualar un récord de veintiocho años.'},
    {start: 78, end: 147, text: 'Es GTA seis, y las reseñas son históricas.'},
    {start: 147, end: 300, text: 'Pero tiene pegas que casi nadie cuenta.'},
    {start: 300, end: 390, text: 'Bienvenido a Zinko, el canal de la curiosidad.'},
    {start: 390, end: 465, text: 'Hoy veremos qué aman y qué critican.'},
    {start: 465, end: 540, text: 'Y si valió la espera.'},
    {start: 485, end: 600, text: 'Y al final, mi veredicto.'},
  ];
  const cue = cues.find((c) => frame >= c.start && frame < c.end);
  if (!cue) return null;
  const local = frame - cue.start;
  const p = entrance(local, 22);
  return (
    <div
      style={{
        position: 'absolute',
        left: 150,
        right: 150,
        bottom: 34,
        display: 'flex',
        justifyContent: 'center',
        opacity: interpolate(local, [0, 8, cue.end - cue.start - 8, cue.end - cue.start], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        transform: 'translateY(' + (1 - p) * 12 + 'px)',
      }}
    >
      <div
        style={{
          maxWidth: 1540,
          padding: '13px 28px 15px',
          background: 'rgba(22,22,24,.88)',
          color: YELLOW,
          fontFamily: 'CaptionLocal, sans-serif',
          fontSize: 31,
          fontWeight: 900,
          letterSpacing: 0.1,
          textAlign: 'center',
          lineHeight: 1.1,
          borderRadius: 5,
          boxShadow: '0 8px 18px rgba(30,24,18,.16)',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
}

function PaperSwipe() {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 28], [-2350, 1920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: -90,
          width: 2350,
          height: 1260,
          background: '#f7f0e2',
          boxShadow: '24px 0 30px rgba(48,38,24,.18)',
          clipPath: 'polygon(0 0, 100% 0, 98% 9%, 100% 18%, 98% 28%, 100% 39%, 98% 50%, 100% 61%, 98% 73%, 100% 84%, 98% 93%, 100% 100%, 0 100%)',
          transform: 'rotate(2deg)',
        }}
      />
    </AbsoluteFill>
  );
}

function Sound({name, from, volume}: {name: string; from: number; volume: number}) {
  return (
    <Sequence from={from}>
      <Audio src={user('sfx/' + name)} volume={volume} />
    </Sequence>
  );
}

function RefinedIntro() {
  const frame = useCurrentFrame();
  const [fontHandle] = useState(() => delayRender('Cargando tipografías del montaje'));
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
    <AbsoluteFill style={{background: PAPER, overflow: 'hidden'}}>
      <PaperBackground />

      {/* ESCENA 1 — gancho: una idea protagonista por plano */}
      <Sequence from={0} durationInFrames={96}>
        <Headline
          text={'RÉCORD DE'}
          eyebrow="UN JUEGO ACABA DE IGUALAR UN"
          left={210}
          top={235}
          width={650}
          size={82}
          accent={TEAL}
        />
        <BigNumber28 />
      </Sequence>
      <Sequence from={8} durationInFrames={90}>
        <PhotoCard
          src="scene-01.mp4"
          source="user"
          startFrom={24}
          left={890}
          top={210}
          width={830}
          height={535}
          rotate={1.3}
          zoom={1.13}
          objectPosition="center 64%"
          cropTop={12}
          tapeSide="right"
        />
      </Sequence>

      <Sequence from={96} durationInFrames={110}>
        <Headline
          text={'ES GTA 6'}
          eyebrow="EL JUEGO DEL QUE TODO EL MUNDO HABLA"
          left={205}
          top={310}
          width={650}
          size={104}
          accent={PINK}
        />
        <PhotoCard
          src="opening.mp4"
          source="proof"
          startFrom={42}
          left={820}
          top={185}
          width={900}
          height={555}
          rotate={-1.1}
          zoom={1.08}
          objectPosition="center 52%"
          tapeSide="left"
        />
        <Sequence from={26} durationInFrames={55}>
          <GtaLogoSticker />
        </Sequence>
      </Sequence>

      <Sequence from={204} durationInFrames={46}>
        <Headline
          text={'RESEÑAS\\nHISTÓRICAS'}
          left={185}
          top={305}
          width={660}
          size={78}
          accent={TEAL}
        />
        <PhotoCard
          src="crowd.mp4"
          source="proof"
          startFrom={54}
          left={865}
          top={195}
          width={840}
          height={525}
          rotate={1.1}
          zoom={1.1}
          objectPosition="center 50%"
          tapeSide="right"
        />
      </Sequence>
      <Sequence from={250} durationInFrames={50}>
        <PaperNote text="PERO HAY PEGAS" accent={PINK} left={475} top={330} width={970} height={260} />
      </Sequence>

      {/* ESCENA 2 — bienvenida y promesa del vídeo */}
      <Sequence from={300} durationInFrames={82}>
        <Headline
          text={'BIENVENIDO\\nA ZINKO'}
          eyebrow="EL CANAL DE LA CURIOSIDAD"
          left={185}
          top={300}
          width={790}
          size={91}
          accent={PINK}
        />
        <PhotoCard
          src="scene-02.mp4"
          source="user"
          startFrom={22}
          left={1030}
          top={185}
          width={670}
          height={510}
          rotate={-1.4}
          zoom={1.1}
          objectPosition="center 52%"
          tapeSide="left"
        />
      </Sequence>
      <Sequence from={382} durationInFrames={92}>
        <Headline text="QUÉ AMAN" left={205} top={345} width={590} size={96} accent={TEAL} />
        <PhotoCard
          src="crowd.mp4"
          source="proof"
          startFrom={78}
          left={850}
          top={195}
          width={860}
          height={525}
          rotate={1.2}
          zoom={1.09}
          objectPosition="center 52%"
          tapeSide="right"
        />
      </Sequence>
      <Sequence from={474} durationInFrames={72}>
        <Headline text="QUÉ CRITICAN" left={205} top={345} width={660} size={83} accent={PINK} />
        <PhotoCard
          src="lowrider.mp4"
          source="proof"
          startFrom={90}
          left={850}
          top={195}
          width={860}
          height={525}
          rotate={-1.1}
          zoom={1.07}
          objectPosition="center 55%"
          tapeSide="left"
        />
      </Sequence>
      <Sequence from={546} durationInFrames={54}>
        <Headline
          text={'MI\\nVEREDICTO'}
          eyebrow="Y AL FINAL..."
          left={245}
          top={330}
          width={720}
          size={95}
          accent={TEAL}
        />
        <NicoCutout />
      </Sequence>

      {/* Transición de página: limpia y física, sin destellos ni flashes */}
      <Sequence from={86} durationInFrames={28}>
        <PaperSwipe />
      </Sequence>
      <Sequence from={286} durationInFrames={28}>
        <PaperSwipe />
      </Sequence>

      <Subtitle frame={frame} />

      {/* Solo tres acentos sonoros; la voz permanece siempre al frente */}
      <Sequence from={0} durationInFrames={FRAMES}>
        <Audio src={user('voice/intro-clean.wav')} volume={1} />
      </Sequence>
      <Sound name="13_golpe_bajo.wav" from={62} volume={0.11} />
      <Sound name="05_whoosh_largo.wav" from={102} volume={0.075} />
      <Sound name="11_swoosh.wav" from={298} volume={0.075} />
    </AbsoluteFill>
  );
}

const Root = () => (
  <Composition
    id="ZinkoGTA6Refined20s"
    component={RefinedIntro}
    durationInFrames={FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
