# ZINKO — Short teaser del análisis completo

Nuevo montaje vertical de 26,5 segundos, 1080 × 1920, 30 fps. Parte del vídeo aprobado en la ejecución 45478934713 y conserva la voz original mediante siete selecciones de frases completas. La composición horizontal original permanece intacta.

Estructura propia: nota casi perfecta → una cualidad del mundo → giro → una crítica concreta → contraste con el aplauso → pregunta → invitación al análisis completo. Se reserva el veredicto y las explicaciones amplias para el vídeo largo.

Las composiciones se diseñaron para vertical con margen adicional a la derecha y debajo para la interfaz de Shorts. El guion hablado no se reescribió; las cifras y comentarios pertenecen al contexto de primeras reseñas del vídeo fuente. Fuentes visuales y permisos documentados en los directorios originales. No hay música añadida ni voz sintética.

`build_audio.py` produce la mezcla, el mapa de edición y los subtítulos por escena a partir de `public/zinko-completo/audio.m4a` y su cronología. Audio de salida: estéreo, 48 kHz, objetivo −16 LUFS, pico −1,5 dBTP. El MP4 final se exporta en H.264/AAC.

Título sugerido: **GTA 6: ¿un 99/100 lo dice todo? 👀**

Descripción sugerida: Una nota casi perfecta y una pega que divide opiniones. Mi análisis completo y el veredicto están en el vídeo relacionado. #GTA6 #Zinko #Shorts

Al publicar, seleccionar el análisis largo como «Vídeo relacionado» de este Short en YouTube Studio. La CTA en pantalla presupone esa configuración. No se ha publicado ni vinculado automáticamente. El largo debe ser público o no listado y el canal necesita acceso a funciones avanzadas. Fuente: https://support.google.com/youtube/answer/14075157?hl=es

Render:

```bash
python3 src/zinko-short/build_audio.py
npx tsc --noEmit
npx remotion render src/zinko-short/index.tsx ZinkoShortTeaser out/ZINKO-GTA6-Short-Teaser.mp4 --concurrency=2 --crf=18 --pixel-format=yuv420p --audio-bitrate=256k
```
