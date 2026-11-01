// =====================================================
// Contador de palabras
// Analiza el texto en cada pulsación de tecla y muestra
// estadísticas y las palabras que más se repiten.
// =====================================================

const PALABRAS_POR_MINUTO = 200; // velocidad media de lectura en silencio
const TAMANO_TOP = 5;

// Palabras muy comunes que no aportan nada al ranking de repetidas
const PALABRAS_VACIAS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "lo", "al", "del",
  "de", "a", "en", "y", "e", "o", "u", "que", "por", "para", "con", "sin",
  "se", "su", "sus", "es", "no", "si", "mi", "me", "te", "le", "les", "nos",
  "ya", "más", "pero", "como", "muy", "este", "esta", "eso", "esto",
]);

// Una palabra es una secuencia de letras o números (incluidas tildes y ñ).
// Admite apóstrofos y guiones internos: "check-in", "l'Hospitalet".
const REGEX_PALABRA = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

const areaTexto = document.getElementById("texto");
const inputLimite = document.getElementById("limite");
const textoRestantes = document.getElementById("restantes");
const listaTop = document.getElementById("top");
const mensajeSinTop = document.getElementById("sin-top");

const salida = {
  palabras: document.getElementById("palabras"),
  caracteres: document.getElementById("caracteres"),
  sinEspacios: document.getElementById("sin-espacios"),
  frases: document.getElementById("frases"),
  parrafos: document.getElementById("parrafos"),
  lectura: document.getElementById("lectura"),
};

// ---------- Análisis (funciones puras, no tocan el DOM) ----------

function analizar(texto) {
  const palabras = texto.match(REGEX_PALABRA) || [];

  // [...texto] cuenta bien los emojis, que en JS ocupan 2 "caracteres"
  const caracteres = [...texto].length;
  const sinEspacios = [...texto.replace(/\s/g, "")].length;

  // Una frase termina en . ! ? o … ; se ignoran los trozos sin palabras
  const frases = texto
    .split(/[.!?…]+/)
    .filter((trozo) => /[\p{L}\p{N}]/u.test(trozo))
    .length;

  // Los párrafos se separan por una o más líneas en blanco
  const parrafos = texto.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;

  const minutos = palabras.length / PALABRAS_POR_MINUTO;

  return {
    palabras,
    caracteres,
    sinEspacios,
    frases,
    parrafos,
    lectura: minutos === 0 ? "0 min" : minutos < 1 ? "< 1 min" : `${Math.round(minutos)} min`,
  };
}

function palabrasFrecuentes(palabras) {
  const conteo = new Map();

  for (const palabra of palabras) {
    const clave = palabra.toLowerCase();
    if (clave.length < 2 || PALABRAS_VACIAS.has(clave)) continue;
    conteo.set(clave, (conteo.get(clave) || 0) + 1);
  }

  // Ordena de más a menos repetida y, a igual número, alfabéticamente
  return [...conteo.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .slice(0, TAMANO_TOP);
}

// ---------- Interfaz ----------

function pintarTop(top) {
  const elementos = top.map(([palabra, veces]) => {
    const li = document.createElement("li");
    li.textContent = palabra;
    const contador = document.createElement("b");
    contador.textContent = `×${veces}`;
    li.append(contador);
    return li;
  });

  listaTop.replaceChildren(...elementos);
  mensajeSinTop.classList.toggle("oculto", top.length > 0);
}

function pintarLimite(caracteres) {
  const limite = parseInt(inputLimite.value, 10);

  if (!limite || limite < 1) {
    textoRestantes.textContent = "";
    textoRestantes.classList.remove("excedido");
    areaTexto.classList.remove("excedido");
    return;
  }

  const restantes = limite - caracteres;
  const excedido = restantes < 0;

  textoRestantes.textContent = excedido
    ? `Te pasas por ${-restantes} caracteres`
    : `Quedan ${restantes} caracteres`;
  textoRestantes.classList.toggle("excedido", excedido);
  areaTexto.classList.toggle("excedido", excedido);
}

function actualizar() {
  const resultado = analizar(areaTexto.value);

  salida.palabras.textContent = resultado.palabras.length;
  salida.caracteres.textContent = resultado.caracteres;
  salida.sinEspacios.textContent = resultado.sinEspacios;
  salida.frases.textContent = resultado.frases;
  salida.parrafos.textContent = resultado.parrafos;
  salida.lectura.textContent = resultado.lectura;

  pintarTop(palabrasFrecuentes(resultado.palabras));
  pintarLimite(resultado.caracteres);
}

// ---------- Eventos ----------

areaTexto.addEventListener("input", actualizar);
inputLimite.addEventListener("input", actualizar);

document.getElementById("borrar").addEventListener("click", () => {
  areaTexto.value = "";
  actualizar();
  areaTexto.focus();
});

actualizar();
