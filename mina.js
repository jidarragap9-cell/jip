// Minero de la portada: al tocarlo pica, saca una pepita de oro y cuenta un dato del Sur de Bolívar
(() => {
  const mina = document.getElementById("mina"), minero = document.getElementById("minero"), dato = document.getElementById("dato");
  if (!mina || !minero) return;
  const DATOS = [
    "La <b>Serranía de San Lucas</b> es hogar del <b>jaguar</b>, el felino más grande de América. 🐆",
    "En la Serranía de San Lucas vive el <b>paujil de pico azul</b>, un ave que solo existe en Colombia. 🐦",
    "El <b>mono araña café</b>, en peligro de extinción, todavía se esconde en los bosques del Sur de Bolívar. 🐒",
    "El <b>Sur de Bolívar</b> es una de las regiones con más tradición en minería de oro de Colombia. ⛏️",
    "En la Serranía también se ha visto el <b>oso de anteojos</b>, el único oso de Suramérica. 🐻",
    "Desde las minas hasta tu vereda: en <b>J&amp;P del Sur</b> te llevamos lo que necesitas. 🚚"
  ];
  let n = 0, t, pepitas = 0;
  const decir = (html, ms) => { dato.innerHTML = html; dato.classList.add("on"); clearTimeout(t); t = setTimeout(() => { dato.classList.remove("on"); mina.classList.remove("pausa"); }, ms); };
  minero.addEventListener("click", () => {
    mina.classList.add("pausa");
    minero.classList.remove("golpe"); void minero.offsetWidth; minero.classList.add("golpe");
    const p = document.createElement("span"); p.className = "pepita"; p.textContent = "✨"; minero.append(p); setTimeout(() => p.remove(), 1200);
    pepitas++;
    decir(DATOS[n++ % DATOS.length] + (pepitas > 1 ? `<br><small>Pepitas encontradas: ${pepitas} ✨</small>` : ""), 6000);
  });
  setTimeout(() => { if (!dato.classList.contains("on")) decir("¡Hola! Tócame y te cuento algo del Sur de Bolívar ⛏️", 4000); }, 2500);
})();
