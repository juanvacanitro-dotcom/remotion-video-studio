# ZINKO · GTA VI · 18 escenas con la voz del creador

Continuación del montaje aprobado en `7258e073a6106272fce3c5932f1fc32a711b06e2`. Se conserva el diseño de su inicio y se ajusta a los 18 audios de `voz.zip`. Las pruebas posteriores del usuario quedan en sus ramas originales.

1920 × 1080, 30 fps constantes, H.264 y AAC. Duración 171,467 s. La narración termina aproximadamente en 161,47 s; la pantalla final reserva 15 s para los elementos de YouTube. Sus destinos permanecen fijos y el personaje y el papel mantienen movimiento.

La única voz es la entregada en `voz.zip`. Se recortan esperas entre frases, sin cambiar su velocidad ni generar otra voz. Los originales MP3 siguen en los adjuntos; `edit-map.json` documenta cada fragmento utilizado y sus tiempos en la edición. Mezcla normalizada a −16 LUFS y pico objetivo −1,5 dBTP, efectos atenuados bajo la voz. No se añade música.

Nico, tipografías y textura: recursos del montaje aprobado en `public/zinko-proof`. Efectos: `Pack_03_Efectos_de_Sonido.zip`, carpeta de recursos compartida por el usuario. Planos nuevos: cortes del tráiler de Rockstar disponible en el proyecto, sin su audio; capturas y arte adicionales: https://www.rockstargames.com/VI/media . Las rutas exactas se registran en `asset-sources.json`.

Los trofeos, cartucho, reloj, comparaciones y notas de prensa son gráficos editoriales propios. No se fabrican pantallas de reseñas, mediciones de rendimiento ni pruebas de daños. Las imágenes de tráiler y prensa ilustran el comentario, no una partida jugada por el canal. El cartucho es una ilustración del juego histórico. Los objetos PS5 y Xbox son ilustraciones de consolas; no se presentan como una fotografía de PS5 Pro.

## Contexto de los datos

Se edita el guion de primeras reseñas recibido el 19/11/2026. Las notas son una instantánea de ese momento. La cifra «17 M+» se identifica como estimación al 18/11, no como cifra actual o final. Su comparación con GTA V distingue acumulado de preventas de ventas del primer día. Las barras de notas usan escala 0–100; las barras de unidades comparten escala. Duraciones de juego orientativas, según la actividad del jugador. Precios de lanzamiento en dólares estadounidenses.

Fuentes consultadas para el contexto del guion y de las representaciones:
- Rockstar, medios y lanzamiento: https://www.rockstargames.com/VI/media
- Metacritic: https://www.metacritic.com/game/grand-theft-auto-vi/ (la recuperación directa de las notas no fue fiable; la cobertura de primeras reseñas se contrastó en las fuentes siguientes).
- The Guardian, primeras reseñas: https://www.theguardian.com/games/2026/nov/19/grand-theft-auto-vi-critics-response-masterpiece
- WIRED: https://es.wired.com/articulos/es-el-juego-de-mundo-abierto-mas-impresionante-jamas-hecho-gta-6-recibe-un-99-en-metacritic
- Push Square, duración y modo de consola: https://www.pushsquare.com/reviews/ps5/grand-theft-auto-6
- Wccftech, rendimiento: https://wccftech.com/review/grand-theft-auto-vi-review-ps5pro/
- PSU, experiencia de rendimiento: https://www.psu.com/reviews/grand-theft-auto-vi-review-ps5/
- IGN: https://www.ign.com/articles/grand-theft-auto-vi-review
- GameSpot: https://www.gamespot.com/reviews/grand-theft-auto-6-review/
- Recopilación de notas: https://www.pcgamer.com/games/grand-theft-auto/grand-theft-auto-6-review-roundup-rockstars-magnum-opus-a-great-love-story-and-a-new-bar-for-open-worlds/
- Reuters, corte de Sensor Tower del 18/11: https://www.reuters.com/business/gta-vi-publisher-take-two-jumps-gamers-relish-blockbuster-release-2026-11-18/
- Sensor Tower, estimaciones: https://sensortower.com/grand-theft-auto-VI/sales-tracker
- Guinness, GTA V, 11,21 millones el primer día: https://www.guinnessworldrecords.com/news/2013/10/confirmed-grand-theft-auto-breaks-six-sales-world-records-51900

## Render

`npx remotion render src/zinko-completo/index.tsx ZinkoCompleto out/ZINKO-GTA6-Completo-Mi-Voz.mp4 --concurrency=2 --crf=18 --pixel-format=yuv420p --audio-bitrate=256k`

La composición principal importa la cronología con cada punto de edición. Los componentes de `approved-intro.tsx` conservan el inicio aprobado; `index.tsx` añade los bloques 4–18, las transiciones, subtítulos y pantalla final.
