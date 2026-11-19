# Prueba ZINKO en Remotion · 9,3 segundos

Adaptación del inicio de la R7 aprobada por el usuario. Conserva las tres primeras frases de la voz original, los recortes de Nico, las tipografías Lilita One y Anton y las imágenes auténticas de GTA VI. Se prueban títulos con profundidad, el calendario en perspectiva, un cambio de plano con papel y una pregunta final con énfasis por palabras.

Es una prueba independiente. Las otras composiciones y el vídeo R7 completo permanecen disponibles. La profundidad del calendario y de los textos se construye con capas y transformaciones CSS, no con modelos nuevos.

## Render

Desde la raíz: `npm ci`, `npx remotion browser ensure`, y `npx remotion render src/zinko-proof/index.tsx ZinkoRemotionProof out/GTA6-prueba-Remotion.mp4 --concurrency=2 --crf=18 --audio-bitrate=256k`.

La salida es H.264/AAC, 1920 × 1080, 30 fps constantes, 279 fotogramas. El MP4 se puede ver directamente en el teléfono.

## Procedencia

- Nico y narración: clips originales del usuario; recortes y mezcla de audio de R7.
- Fondos del juego y logotipo: tráiler oficial de Rockstar Games que ya se utilizó en R7. Fuente: https://www.rockstargames.com/VI/media
- Papel: recurso de composición de R7.
- Tipografías: Lilita One y Anton, con sus licencias OFL incluidas.

Se reutilizaron todos los recursos; no se generaron imágenes ni voces nuevas. Los subtítulos y los tiempos de montaje se conservaron de R7, ajustados al fotograma de salida. La fecha es la del guion original y no se añadieron afirmaciones nuevas.
