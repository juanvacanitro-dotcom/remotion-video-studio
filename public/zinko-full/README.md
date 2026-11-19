# Inicio completo: clips 1–3

La composición `ZinkoRemotionFull` extiende la prueba a los 26,8 segundos de narración de R7. Mantiene las diez frases originales, su orden, el narrador y la mezcla de audio. Los silencios son los mismos que en R7.

Se reutilizan Nico, las tipografías, el papel y los recortes 3D de las consolas. La bienvenida, las preguntas, las reacciones y la fecha tienen composición y animación propias. No se generaron voces o imágenes nuevas.

## Render

`npx remotion render src/zinko-proof/index.tsx ZinkoRemotionFull out/GTA6-inicio-Remotion.mp4 --concurrency=2 --crf=18 --audio-bitrate=256k`

Salida: 1920×1080, 30 fps, 804 fotogramas, H.264/AAC. El MP4 es el archivo para reproducir en el teléfono; el código de GitHub es el proyecto reproducible.

## Recursos

- Voz, recortes de Nico y mezcla: proyecto R7 del usuario.
- `action.mp4`, `rockstar.mp4` y `coast.mp4`: extractos del tráiler oficial de Rockstar Games previamente usado en R7, https://www.rockstargames.com/VI/media
- `success.mp4`, `shock.mp4`: recursos de reacción compartidos por el usuario; procedencia en `meme-sources.json`. El segundo usa una repetición de ida y vuelta para mantener el gesto sin el destello posterior del original.
- Consolas: imágenes transparentes de los modelos 3D que ya se renderizaron para R7; se animan como capas con perspectiva.
- Tipografías y recursos comunes: `public/zinko-proof/`, con licencias OFL incluidas.

La fecha y las plataformas conservan lo expresado en el guion original. No se añadieron nuevas afirmaciones sobre el juego.
