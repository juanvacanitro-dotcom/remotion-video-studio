# Zinko GTA VI reseñas escenas 1 a 3

Montaje de los tres clips que el usuario entregó, sobre la base Remotion aprobada. La voz se conserva íntegra y en el mismo orden; se acortan silencios entre frases. No se genera otra voz ni se añade música.

Recursos comunes de Zinko: las tipografías, Nico recortado, el papel y el logotipo de GTA VI proceden del montaje aprobado en `public/zinko-proof/`. Los nuevos planos `reveal`, `city`, `world` y `night` se recortaron del tráiler oficial de Rockstar que ya formaba parte del proyecto anterior: https://www.rockstargames.com/VI/media . Las imágenes ilustran el juego; no son capturas de una sesión de análisis del canal.

Los efectos añadidos proceden de `Pack_03_Efectos_de_Sonido.zip`, facilitado por el usuario en su carpeta de recursos. No se añaden voces de memes ni música del tráiler.

El trofeo, la línea temporal, los textos con profundidad y los papeles se dibujan como elementos editoriales animados. No son documentos ni capturas de reseñas reales. La nota se muestra en una composición propia, sin fabricar una captura de Metacritic.

## Verificación del guion

Consulta 19 de noviembre de 2026. Las cifras son una fotografía de las primeras reseñas y pueden cambiar. La voz original dice 99/100 y más de 140 críticos; se conserva ese grado de precisión.

- Rockstar, lanzamiento: https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available
- The Guardian, nota 99 y empate con Ocarina of Time de 1998: https://www.theguardian.com/games/2026/nov/19/grand-theft-auto-vi-critics-response-masterpiece
- WIRED en español, 99/100 y 147 reseñas al consultar: https://es.wired.com/articulos/es-el-juego-de-mundo-abierto-mas-impresionante-jamas-hecho-gta-6-recibe-un-99-en-metacritic
- Página primaria intentada: https://www.metacritic.com/game/grand-theft-auto-vi/ . La recuperación directa devolvió un error y una copia antigua sin las reseñas. Por ello, la comprobación del valor actual se apoya en la cobertura citada, no en una supuesta captura directa de Metacritic.

La prueba solo cubre las primeras tres escenas. No verifica las afirmaciones de las quince escenas que aún no se han montado.

## Reproducir

`npx remotion render src/zinko-resenas/index.tsx ZinkoResenas out/ZINKO-Resenas-01-03.mp4 --concurrency=2 --crf=18 --pixel-format=yuv420p --audio-bitrate=256k`

La duración final prevista es 26,9 s a 30 fps, 1920 × 1080, H.264/AAC. `edit-map.json` conserva los puntos de edición y el texto de cada segmento.
