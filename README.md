# 📝 Contador de palabras

Herramienta web que analiza un texto mientras se escribe, hecha con **HTML, CSS y JavaScript**.

🔗 **Demo en vivo:** https://diegorivera14.github.io/contador-palabras/

## Funcionalidades

- Cuenta palabras, caracteres (con y sin espacios), frases y párrafos.
- Calcula el tiempo de lectura aproximado.
- Muestra las 5 palabras más repetidas, sin contar artículos, preposiciones y otras palabras muy comunes.
- Límite de caracteres opcional: avisa de cuántos quedan o de cuántos te pasas (útil para tuits, formularios o resúmenes).
- Cuenta bien las tildes, la ñ y los emojis.

## Cómo usarlo

Puedes probarlo directamente en la [demo](https://diegorivera14.github.io/contador-palabras/), o descargar el repositorio y abrir `index.html` en el navegador (no necesita instalación).

```bash
git clone https://github.com/DiegoRivera14/contador-palabras.git
cd contador-palabras
# abre index.html en tu navegador
```

## Estructura

```
contador-palabras/
├── index.html   # Área de texto, estadísticas y ranking
├── style.css    # Estilos
└── script.js    # Análisis del texto y actualización de la interfaz
```

## Cómo funciona

En cada pulsación (`input`) se llama a `actualizar()`, que hace dos cosas: analizar el texto y pintar los resultados. El análisis está en funciones que no tocan el DOM (`analizar()` y `palabrasFrecuentes()`), así que se pueden probar por separado.

**Qué cuenta como cada cosa:**

| Dato | Regla |
|---|---|
| Palabra | Secuencia de letras o números, con apóstrofos o guiones internos permitidos (`check-in`). Regex: `/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu` |
| Carácter | Se cuenta con `[...texto].length` en lugar de `texto.length`, porque en JavaScript un emoji ocupa dos unidades. |
| Frase | Trozo de texto entre `.`, `!`, `?` o `…` que contiene al menos una letra o número. |
| Párrafo | Bloque separado por una o más líneas en blanco. |
| Lectura | Palabras ÷ 200 (velocidad media de lectura en silencio). |

`\p{L}` y `\p{N}` son clases Unicode (cualquier letra y cualquier número) y requieren el flag `u`. Gracias a ellas, las palabras con tilde o ñ se reconocen bien, cosa que `\w` no hace.

**Palabras más repetidas:** `palabrasFrecuentes()` pasa cada palabra a minúsculas, descarta las de una letra y las de la lista `PALABRAS_VACIAS`, y las cuenta en un `Map`. Después ordena de más a menos repetida (y alfabéticamente si empatan) y se queda con las cinco primeras.

## Autor

Diego Rivera — [GitHub](https://github.com/DiegoRivera14)
